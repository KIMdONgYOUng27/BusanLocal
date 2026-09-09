import { User } from '../types';
import { supabase } from '../lib/supabase';
import { authService, mapSupabaseUser } from './authService';

export const profileService = {
  async getProfile(): Promise<User | null> {
    return authService.getCurrentUser();
  },

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const payload: Record<string, any> = {};
    if (updates.name) payload.nickname = updates.name;
    if (updates.avatar) payload.avatar_url = updates.avatar;
    if (updates.bio) payload.bio = updates.bio;
    if (updates.badgeText) payload.badge_text = updates.badgeText;

    if (Object.keys(payload).length > 0) {
      await supabase
        .from('profiles')
        .upsert({ id: user.id, ...payload }, { onConflict: 'id' });
    }

    return authService.getCurrentUser();
  }
};
