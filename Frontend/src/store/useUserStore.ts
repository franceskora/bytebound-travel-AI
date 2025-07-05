// src/store/useUserStore.ts
import { create } from 'zustand';
import { getCurrentUser, logoutUser } from '../api/auth';

interface User {
  // Define the properties of your user object here, for example:
  id: string;
  name: string;
  email: string;
  // Add other fields as needed
}

interface UserStore {
  user: User | null;
  loading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: true,

  fetchUser: async () => {
    try {
      const data = await getCurrentUser();
      set({ user: data, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  logout: async () => {
    await logoutUser();
    set({ user: null });
  },
}));