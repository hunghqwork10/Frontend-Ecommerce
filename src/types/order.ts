import type { Address, User } from "./user";

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: User;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'momo';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: OrderStatus;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddressId: string;
  paymentMethod: 'cod' | 'bank_transfer' | 'credit_card' | 'momo';
  couponCode?: string;
  note?: string;
}