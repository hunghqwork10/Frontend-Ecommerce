import { create } from 'zustand';
import type { User } from '@/types';
import { authService } from '@/services';

interface UserStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    authService.logout().catch(() => {});
    set({ user: null, token: null });
  },
  fetchProfile: async () => {
    const token = get().token;
    if (!token) return;
    set({ isLoading: true });
    try {
      const user = await authService.getProfile();
      set({ user, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, token: null, isLoading: false });
    }
  },
}));