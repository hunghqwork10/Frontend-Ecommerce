import { create } from 'zustand';
import type { Cart } from '@/types';

interface CartStore {
  cart: Cart | null;
  isLoading: boolean;
  setCart: (cart: Cart) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  cart: null,
  isLoading: false,
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: null }),
}));