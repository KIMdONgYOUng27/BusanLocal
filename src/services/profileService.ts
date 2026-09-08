import { User } from '../types';
import { mockCurrentUser } from '../mock/mockData';

export const profileService = {
  async getProfile(): Promise<User> {
    return { ...mockCurrentUser };
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    return {
      ...mockCurrentUser,
      ...updates
    };
  }
};
