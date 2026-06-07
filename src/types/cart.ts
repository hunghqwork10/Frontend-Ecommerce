import type { Product } from "./product";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  price: number; // Price at time of adding to cart
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  couponCode?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}