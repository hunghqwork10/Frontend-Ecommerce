import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartItem from '@/components/common/CartItem';
import CartSummary from '@/components/common/CartSummary';
import Button from '@/components/common/Button';
import type { CartItem as CartItemType } from '@/types';

// Mock cart data - sẽ thay bằng cart store sau
const mockCartItems: CartItemType[] = [
  {
    id: '1',
    product: {
      id: '1',
      name: 'MacBook Pro 14 M3',
      slug: 'macbook-pro-14-m3',
      description: 'Laptop mạnh mẽ với chip M3',
      price: 34990000,
      originalPrice: 39990000,
      discount: 13,
      images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
      brand: 'Apple',
      category: { id: '1', name: 'Laptop', slug: 'laptop' },
      stock: 10,
      sold: 50,
      rating: 4.8,
      reviewCount: 120,
      specifications: {},
      warranty: '12 tháng',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 2,
    price: 34990000,
  },
  {
    id: '2',
    product: {
      id: '2',
      name: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Điện thoại flagship của Apple',
      price: 28990000,
      originalPrice: 31990000,
      discount: 9,
      images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
      brand: 'Apple',
      category: { id: '2', name: 'Điện thoại', slug: 'phone' },
      stock: 20,
      sold: 100,
      rating: 4.9,
      reviewCount: 250,
      specifications: {},
      warranty: '12 tháng',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 1,
    price: 28990000,
  },
];

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(mockCartItems);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const discount = cartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice ? (item.product.originalPrice - item.product.price) * item.quantity : 0),
    0
  );
  const total = subtotal + shipping - discount;

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
            <p className="text-gray-600 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <Button onClick={() => navigate('/')}>
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Giỏ hàng ({cartItems.length} sản phẩm)</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
