import { http, HttpResponse, delay } from 'msw';
import { mockProducts } from './data/products';
import { mockUsers } from './data/users';
import { mockOrders } from './data/orders';
import type { Cart, Product, ProductListResponse } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

let cartState: Cart = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  discountAmount: 0,
  finalAmount: 0,
};

function recalcCart(): Cart {
  const totalAmount = cartState.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalItems = cartState.items.reduce((sum, item) => sum + item.quantity, 0);
  cartState = {
    ...cartState,
    totalItems,
    totalAmount,
    finalAmount: totalAmount - cartState.discountAmount,
  };
  return cartState;
}

function getProductById(id: string): Product | undefined {
  return mockProducts.find((p) => p.id === id);
}

function paginate<T>(items: T[], page: number, pageSize: number): { data: T[]; total: number } {
  const start = (page - 1) * pageSize;
  return { data: items.slice(start, start + pageSize), total: items.length };
}

export const handlers = [
  // ============ PRODUCTS ============

  http.get(`${API_BASE}/products`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const brands = url.searchParams.getAll('brand');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const minRating = url.searchParams.get('minRating');
    const search = url.searchParams.get('search');
    const sortBy = url.searchParams.get('sortBy');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '12');

    let filtered = [...mockProducts];

    if (category) {
      filtered = filtered.filter((p) => p.category.slug === category);
    }
    if (brands.length > 0) {
      filtered = filtered.filter((p) => brands.includes(p.brand));
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }
    if (minRating) {
      filtered = filtered.filter((p) => p.rating >= Number(minRating));
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'best_selling':
        filtered.sort((a, b) => b.sold - a.sold);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    const { data, total } = paginate(filtered, page, pageSize);
    const response: ProductListResponse = { products: data, total, page, pageSize };
    return HttpResponse.json(response);
  }),

  http.get(`${API_BASE}/products/:id`, async ({ params }) => {
    await delay(200);
    const product = getProductById(params.id as string);
    if (!product) {
      return HttpResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }
    return HttpResponse.json(product);
  }),

  http.get(`${API_BASE}/products/:productId/related`, async ({ params, request }) => {
    await delay(200);
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    let related = mockProducts.filter(
      (p) => p.id !== params.productId && (!category || p.category.slug === category)
    );
    related = related.slice(0, 4);
    return HttpResponse.json(related);
  }),

  // ============ CART ============

  http.get(`${API_BASE}/cart`, async () => {
    await delay(200);
    return HttpResponse.json(cartState);
  }),

  http.post(`${API_BASE}/cart/items`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { productId: string; quantity: number };
    const product = getProductById(body.productId);
    if (!product) {
      return HttpResponse.json({ message: 'Sản phẩm không tồn tại' }, { status: 404 });
    }

    const existing = cartState.items.find((item) => item.product.id === body.productId);
    if (existing) {
      existing.quantity += body.quantity;
    } else {
      cartState.items.push({
        id: `cart-${Date.now()}`,
        product,
        quantity: body.quantity,
        price: product.price,
      });
    }

    return HttpResponse.json(recalcCart());
  }),

  http.put(`${API_BASE}/cart/items/:cartItemId`, async ({ params, request }) => {
    await delay(200);
    const body = (await request.json()) as { quantity: number };
    const item = cartState.items.find((i) => i.id === params.cartItemId);
    if (!item) {
      return HttpResponse.json({ message: 'Cart item không tồn tại' }, { status: 404 });
    }
    item.quantity = body.quantity;
    return HttpResponse.json(recalcCart());
  }),

  http.delete(`${API_BASE}/cart/items/:cartItemId`, async ({ params }) => {
    await delay(200);
    cartState.items = cartState.items.filter((i) => i.id !== params.cartItemId);
    return HttpResponse.json(recalcCart());
  }),

  http.delete(`${API_BASE}/cart`, async () => {
    await delay(200);
    cartState = { items: [], totalItems: 0, totalAmount: 0, discountAmount: 0, finalAmount: 0 };
    return HttpResponse.json(cartState);
  }),

  http.post(`${API_BASE}/cart/coupon`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as { couponCode: string };
    if (body.couponCode === 'GIAM10') {
      cartState.discountAmount = cartState.totalAmount * 0.1;
      cartState.couponCode = body.couponCode;
    } else if (body.couponCode === 'GIAM50K') {
      cartState.discountAmount = 50000;
      cartState.couponCode = body.couponCode;
    } else {
      return HttpResponse.json({ message: 'Mã giảm giá không hợp lệ' }, { status: 400 });
    }
    return HttpResponse.json(recalcCart());
  }),

  // ============ AUTH ============

  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as { email: string; password: string };
    const user = mockUsers.find((u) => u.email === body.email);
    if (!user || body.password !== '123456') {
      return HttpResponse.json({ message: 'Email hoặc mật khẩu không đúng' }, { status: 401 });
    }
    return HttpResponse.json({
      user,
      token: `mock-token-${user.id}`,
      refreshToken: `mock-refresh-${user.id}`,
    });
  }),

  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      name: string;
      email: string;
      phone: string;
      password: string;
    };
    const newUser = {
      id: String(mockUsers.length + 1),
      email: body.email,
      name: body.name,
      phone: body.phone,
      avatar: '',
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return HttpResponse.json({
      user: newUser,
      token: `mock-token-${newUser.id}`,
      refreshToken: `mock-refresh-${newUser.id}`,
    });
  }),

  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(200);
    return HttpResponse.json({ message: 'Đăng xuất thành công' });
  }),

  http.get(`${API_BASE}/auth/profile`, async ({ request }) => {
    await delay(200);
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-token-', '');
    const user = mockUsers.find((u) => u.id === userId);
    if (!user) {
      return HttpResponse.json({ message: 'User không tồn tại' }, { status: 404 });
    }
    return HttpResponse.json(user);
  }),

  http.post(`${API_BASE}/auth/forgot-password`, async () => {
    await delay(500);
    return HttpResponse.json({ message: 'Email đặt lại mật khẩu đã được gửi' });
  }),

  http.post(`${API_BASE}/auth/reset-password`, async () => {
    await delay(500);
    return HttpResponse.json({ message: 'Đặt lại mật khẩu thành công' });
  }),

  // ============ ORDERS ============

  http.post(`${API_BASE}/orders`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as {
      items: { productId: string; quantity: number }[];
      paymentMethod: string;
      note?: string;
    };
    const orderItems = body.items.map((item) => {
      const product = getProductById(item.productId)!;
      return {
        id: `order-item-${Date.now()}-${item.productId}`,
        productId: item.productId,
        productName: product.name,
        productImage: product.images[0],
        price: product.price,
        quantity: item.quantity,
        total: product.price * item.quantity,
      };
    });
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0);
    const order = {
      id: `order-${Date.now()}`,
      orderNumber: `ORD${Date.now()}`,
      userId: '1',
      user: mockUsers[0],
      items: orderItems,
      shippingAddress: {
        id: 'addr-1',
        userId: '1',
        fullName: 'Nguyễn Văn A',
        phone: '0901234567',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        street: '123 Đường Lê Lợi',
        isDefault: true,
      },
      paymentMethod: body.paymentMethod as 'cod' | 'bank_transfer' | 'credit_card' | 'momo',
      paymentStatus: 'pending' as const,
      status: 'pending' as const,
      subtotal,
      shippingFee: subtotal > 5000000 ? 0 : 30000,
      discountAmount: 0,
      totalAmount: subtotal + (subtotal > 5000000 ? 0 : 30000),
      note: body.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    cartState = { items: [], totalItems: 0, totalAmount: 0, discountAmount: 0, finalAmount: 0 };

    return HttpResponse.json(order);
  }),

  http.get(`${API_BASE}/orders`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = 10;

    const { data, total } = paginate(mockOrders, page, pageSize);
    return HttpResponse.json({ orders: data, total });
  }),

  http.get(`${API_BASE}/orders/:id`, async ({ params }) => {
    await delay(200);
    const order = mockOrders.find((o) => o.id === params.id);
    if (order) {
      return HttpResponse.json(order);
    }
    return HttpResponse.json({ message: 'Đơn hàng không tồn tại' }, { status: 404 });
  }),

  http.patch(`${API_BASE}/orders/:id/cancel`, async ({ params }) => {
    await delay(300);
    const orderIndex = mockOrders.findIndex((o) => o.id === params.id);
    if (orderIndex !== -1) {
      mockOrders[orderIndex] = {
        ...mockOrders[orderIndex],
        status: 'cancelled',
        updatedAt: new Date().toISOString(),
      };
      return HttpResponse.json(mockOrders[orderIndex]);
    }
    return HttpResponse.json({ message: 'Đơn hàng không tồn tại' }, { status: 404 });
  }),
];
