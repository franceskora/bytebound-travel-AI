// src/store/useUserStore.ts
import { create } from 'zustand';
import { getCurrentUser, logoutUser } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,
  isAuthenticated: false,

  fetchUser: async () => {
    try {
      const data = await getCurrentUser();
      set({ user: data, loading: false, isAuthenticated: true });
    } catch {
      set({ user: null, loading: false, isAuthenticated: false });
    }
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, isAuthenticated: false });
  },
}));