import { User } from '../types';
import { mockCurrentUser } from '../mock/mockData';

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    // In future: return supabase.auth.getUser()
    return { ...mockCurrentUser };
  },

  async login(email: string): Promise<User> {
    // In future: supabase.auth.signInWithPassword(...)
    return {
      ...mockCurrentUser,
      email: email || mockCurrentUser.email,
    };
  },

  async signup(name: string, email: string): Promise<User> {
    // In future: supabase.auth.signUp(...)
    return {
      ...mockCurrentUser,
      id: `user_${Date.now()}`,
      name: name || '부산여행자',
      email: email || 'user@localflow.kr',
    };
  },

  async logout(): Promise<void> {
    // In future: supabase.auth.signOut()
  }
};
