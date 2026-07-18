import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutForm from '@/components/common/CheckoutForm';
import PaymentMethod from '@/components/common/PaymentMethod';
import OrderSummary from '@/components/common/OrderSummary';
import Button from '@/components/common/Button';
import type { CartItem } from '@/types';

// Mock cart data - sẽ thay bằng cart store sau
const mockCartItems: CartItem[] = [
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

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = mockCartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const discount = mockCartItems.reduce(
    (sum, item) => sum + (item.product.originalPrice ? (item.product.originalPrice - item.product.price) * item.quantity : 0),
    0
  );
  const total = subtotal + shipping - discount;

  const handleFormSubmit = () => {
    setIsSubmitting(true);

    // TODO: Call API to create order

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/order-success', { state: { orderId: 'ORD123456' } });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Thanh toán</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-8">
            <CheckoutForm onSubmit={handleFormSubmit} />
            <PaymentMethod selected={paymentMethod} onChange={setPaymentMethod} />
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={mockCartItems}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
            />

            <Button
              size="lg"
              className="w-full mt-6"
              isLoading={isSubmitting}
              onClick={() => {
                const form = document.querySelector('form');
                if (form) form.requestSubmit();
              }}
            >
              Đặt hàng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
