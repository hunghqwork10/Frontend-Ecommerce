import api from './api';
import type { Cart, AddToCartRequest, UpdateCartItemRequest } from '@/types';

export const cartService = {
  // Lấy giỏ hàng
  getCart: async () => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  // Thêm sản phẩm vào giỏ
  addToCart: async (data: AddToCartRequest) => {
    const response = await api.post<Cart>('/cart/items', data);
    return response.data;
  },

  // Cập nhật số lượng
  updateCartItem: async (data: UpdateCartItemRequest) => {
    const response = await api.put<Cart>(`/cart/items/${data.cartItemId}`, {
      quantity: data.quantity
    });
    return response.data;
  },

  // Xóa sản phẩm khỏi giỏ
  removeCartItem: async (cartItemId: string) => {
    const response = await api.delete<Cart>(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async () => {
    const response = await api.delete<Cart>('/cart');
    return response.data;
  },

  // Áp mã giảm giá
  applyCoupon: async (couponCode: string) => {
    const response = await api.post<Cart>('/cart/coupon', { couponCode });
    return response.data;
  },
};