import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { User } from '../types';

export function mapSupabaseUser(user: SupabaseUser | null): User | null {
  if (!user) return null;

  const metadata = user.user_metadata || {};
  const name = metadata.nickname || metadata.name || user.email?.split('@')[0] || '부산여행자';

  return {
    id: user.id,
    name,
    email: user.email || '',
    avatar:
      metadata.avatar_url ||
      metadata.avatar ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBw13gQPDSpIuMEhG0s5k64vRtDKjl-AuuA8QQMf04bclN6uEl9A-fiF7sXWRo3uhmdnLKokoT4GX1jfJNGfS-yuOfhQx4XIyDMavMkR76Q8Cu1qajmj3P8n8_f4z_fM1Xz51u_n41MgnUGWt5XnFTZjTM-GqlAUlU7g3tqoHWpVUEx8hqf48w2OB9EWgfFfEOodZNwXhYorjjS0f9SETZg40M9PvnYJepgzjet92VQdqWyDeRphExgMg',
    role: (metadata.role as 'local_creator' | 'traveler') || 'traveler',
    badgeText: metadata.badgeText || '해변 산책러',
    isVerifiedLocal: Boolean(metadata.isVerifiedLocal || false),
    bio: metadata.bio || '부산 구석구석을 여행하는 여행자입니다 🌊',
    savedCount: typeof metadata.savedCount === 'number' ? metadata.savedCount : 0,
    forkedCount: typeof metadata.forkedCount === 'number' ? metadata.forkedCount : 0,
    createdCount: typeof metadata.createdCount === 'number' ? metadata.createdCount : 0,
  };
}

export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return '알 수 없는 오류가 발생했습니다.';
  const message = String(error.message || '');

  if (message.includes('Invalid login credentials')) {
    return '이메일 또는 비밀번호가 올바르지 않습니다.';
  }
  if (message.includes('Email not confirmed')) {
    return '인증 이메일을 확인해주세요.';
  }
  if (message.includes('User already registered') || message.includes('already exists')) {
    return '이미 가입된 이메일 주소입니다.';
  }
  if (message.includes('Password should be at least 6 characters')) {
    return '비밀번호는 최소 6자리 이상이어야 합니다.';
  }
  if (message.includes('invalid format') || message.includes('Unable to validate email address')) {
    return '올바른 이메일 형식을 입력해주세요.';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.';
  }

  return error.message || '인증 처리 중 오류가 발생했습니다.';
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      return mapSupabaseUser(user);
    } catch {
      return null;
    }
  },

  async login(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error };
    }

    return { user: mapSupabaseUser(data.user), error: null };
  },

  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User | null; needsEmailVerification: boolean; error: Error | null }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          nickname: name,
        },
      },
    });

    if (error) {
      return { user: null, needsEmailVerification: false, error };
    }

    const needsEmailVerification = Boolean(data.user && !data.session);

    return {
      user: mapSupabaseUser(data.user),
      needsEmailVerification,
      error: null,
    };
  },

  async logout(): Promise<{ error: Error | null }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      callback(mapSupabaseUser(session?.user ?? null));
    });
    return subscription;
  },
};
