import api from './api';
import type { LoginRequest, RegisterRequest, User } from '@/types';
import type { AuthResponse } from '@/types';

export const authService = {
  // Đăng nhập
  login: async (data: LoginRequest) => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Đăng ký
  register: async (data: RegisterRequest) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  // Đăng xuất
  logout: async () => {
    await api.post('/auth/logout');
  },

  // Lấy profile hiện tại
  getProfile: async () => {
    const response = await api.get<User>('/auth/profile');
    return response.data;
  },

  // Quên mật khẩu
  forgotPassword: async (email: string) => {
    await api.post('/auth/forgot-password', { email });
  },

  // Reset mật khẩu
  resetPassword: async (token: string, newPassword: string) => {
    await api.post('/auth/reset-password', { token, newPassword });
  },
};
