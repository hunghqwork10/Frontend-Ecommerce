import { create } from 'zustand';

interface UIStore {
  isLoading: boolean;
  sidebarOpen: boolean;
  setLoading: (loading: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isLoading: false,
  sidebarOpen: false,
  setLoading: (isLoading) => set({ isLoading }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));