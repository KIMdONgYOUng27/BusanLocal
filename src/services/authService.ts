import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function mapSupabaseUser(user: SupabaseUser | null, profile?: any, fallbackName?: string): User | null {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const name =
    metadata.nickname ||
    metadata.name ||
    profile?.nickname ||
    profile?.name ||
    fallbackName ||
    user.email?.split('@')[0] ||
    '부산여행자';

  return {
    id: user.id,
    name,
    email: user.email || '',
    avatar:
      profile?.avatar_url ||
      metadata.avatar_url ||
      metadata.avatar ||
      '',
    role: (profile?.role || metadata.role as 'local_creator' | 'traveler') || 'traveler',
    badgeText: profile?.badge_text || metadata.badgeText || '해변 산책러',
    isVerifiedLocal: Boolean(profile?.is_verified_local ?? metadata.isVerifiedLocal ?? false),
    bio: profile?.bio || metadata.bio || '부산 구석구석을 여행하는 여행자입니다 🌊',
    savedCount: typeof profile?.saved_count === 'number' ? profile.saved_count : (typeof metadata.savedCount === 'number' ? metadata.savedCount : 0),
    forkedCount: typeof profile?.forked_count === 'number' ? profile.forked_count : (typeof metadata.forkedCount === 'number' ? metadata.forkedCount : 0),
    createdCount: typeof profile?.created_count === 'number' ? profile.created_count : (typeof metadata.createdCount === 'number' ? metadata.createdCount : 0),
  };
}

export async function fetchProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function syncProfile(userId: string, defaultNickname: string) {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Profile fetch warning:', error);
    }

    // 프로필 행이 없거나 nickname이 비어 있으면 upsert
    if (!profile || !profile.nickname || !profile.nickname.trim()) {
      const { data: upserted, error: upsertError } = await supabase
        .from('profiles')
        .upsert(
          {
            id: userId,
            nickname: defaultNickname,
          },
          { onConflict: 'id' }
        )
        .select()
        .maybeSingle();

      if (!upsertError && upserted) {
        return upserted;
      }
    }

    return profile;
  } catch (err) {
    console.warn('syncProfile error:', err);
    return null;
  }
}

export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  const message = String(error.message || '');
  const lower = message.toLowerCase();

  let koreanPrefix = '';
  if (message.includes('Invalid login credentials') || lower.includes('invalid credentials')) {
    koreanPrefix = '이메일 또는 비밀번호가 올바르지 않습니다.';
  } else if (message.includes('Email not confirmed') || lower.includes('email not confirmed')) {
    koreanPrefix = '이메일 확인이 필요합니다. 전송된 인증 메일을 확인해주세요.';
  } else if (lower.includes('failed to fetch') || lower.includes('network') || lower.includes('fetch error')) {
    koreanPrefix = '네트워크 연결을 확인해주세요.';
  } else if (message.includes('User already registered') || message.includes('already exists')) {
    koreanPrefix = '이미 가입된 이메일 주소입니다.';
  } else if (message.includes('Password should be at least 6 characters')) {
    koreanPrefix = '비밀번호는 최소 6자리 이상이어야 합니다.';
  } else if (message.includes('invalid format') || message.includes('Unable to validate email address') || lower.includes('invalid email')) {
    koreanPrefix = '올바른 이메일 형식을 입력해주세요.';
  } else if (message.includes('rate limit') || message.includes('too many requests')) {
    koreanPrefix = '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  } else if (message.includes('Signup requires a valid password') || lower.includes('password')) {
    koreanPrefix = '올바른 비밀번호를 입력해주세요.';
  }

  if (koreanPrefix) {
    return `${koreanPrefix} (${message})`;
  }
  return message ? `오류: ${message}` : '인증 처리 중 오류가 발생했습니다.';
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      const profile = await fetchProfile(user.id);
      return mapSupabaseUser(user, profile);
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    const trimmedEmail = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password,
    });

    if (error || !data.user) {
      console.error('Supabase signInWithPassword error:', error);
      return { user: null, error };
    }

    const profile = await fetchProfile(data.user.id);
    return { user: mapSupabaseUser(data.user, profile), error: null };
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; session: any; error: Error | null; message?: string }> {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            name: trimmedName,
            nickname: trimmedName,
          },
        },
      });

      if (error) {
        console.error('Supabase signUp error:', error);
        return {
          user: null,
          session: null,
          error,
          message: getFriendlyAuthErrorMessage(error),
        };
      }

      if (!data.user) {
        const customErr = new Error('사용자 계정 생성에 실패했습니다.');
        console.error('Supabase signUp failed: no user returned', customErr);
        return {
          user: null,
          session: null,
          error: customErr,
          message: '사용자 계정 생성에 실패했습니다.',
        };
      }

      // 8. 이메일 확인 설정 때문에 session이 없다면 "이메일 확인이 필요합니다" 표시
      if (!data.session) {
        console.warn('Supabase signUp returned user without session. Email confirmation is required.');
        const noSessionErr = new Error('이메일 확인이 필요합니다.');
        return {
          user: null,
          session: null,
          error: noSessionErr,
          message: '이메일 확인이 필요합니다. 전송된 인증 메일을 확인해 주세요.',
        };
      }

      // 7. 회원가입 성공 후 session이 존재하면 사용자 프로필을 불러오고 반환
      const profile = await syncProfile(data.user.id, trimmedName);
      const user = mapSupabaseUser(data.user, profile, trimmedName);

      return {
        user,
        session: data.session,
        error: null,
      };
    } catch (err: any) {
      console.error('Supabase signUp unexpected error:', err);
      return {
        user: null,
        session: null,
        error: err,
        message: getFriendlyAuthErrorMessage(err),
      };
    }
  },

  async logout(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        callback(mapSupabaseUser(session.user, profile));
      } else {
        callback(null);
      }
    });
    return subscription;
  },
};
