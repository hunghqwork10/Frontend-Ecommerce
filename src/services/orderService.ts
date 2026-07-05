import api from './api';
import type { Order, CreateOrderRequest } from '@/types';

export const orderService = {
  // Tạo đơn hàng
  createOrder: async (data: CreateOrderRequest) => {
    const response = await api.post<Order>('/orders', data);
    return response.data;
  },

  // Lấy danh sách đơn hàng của user
  getOrders: async (params?: { page?: number; status?: string }) => {
    const response = await api.get<{ orders: Order[]; total: number }>('/orders', { params });
    return response.data;
  },

  // Lấy chi tiết đơn hàng
  getOrderById: async (id: string) => {
    const response = await api.get<Order>(`/orders/${id}`);
    return response.data;
  },

  // Hủy đơn hàng
  cancelOrder: async (id: string) => {
    const response = await api.patch<Order>(`/orders/${id}/cancel`);
    return response.data;
  },
};