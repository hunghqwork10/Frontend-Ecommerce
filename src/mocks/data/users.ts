import type { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    avatar: '',
    role: 'customer',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
  {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin',
    phone: '0909876543',
    avatar: '',
    role: 'admin',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-01T08:00:00Z',
  },
];
