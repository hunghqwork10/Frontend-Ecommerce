import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import CheckoutForm from '@/components/common/CheckoutForm';
import PaymentMethod from '@/components/common/PaymentMethod';
import OrderSummary from '@/components/common/OrderSummary';
import Button from '@/components/common/Button';
import { cartService, orderService } from '@/services';

export default function Checkout() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card' | 'wallet'>('cod');

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const createOrderMutation = useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: (order) => {
      navigate('/order-success', { state: { orderId: order.orderNumber } });
    },
  });

  const items = cart?.items ?? [];
  const subtotal = cart?.totalAmount ?? 0;
  const shipping = subtotal > 5000000 ? 0 : 30000;
  const discount = cart?.discountAmount ?? 0;
  const total = cart?.finalAmount ?? 0;

  const handleFormSubmit = () => {
    createOrderMutation.mutate({
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddressId: 'addr-1',
      paymentMethod: paymentMethod === 'card' ? 'credit_card' : paymentMethod as 'cod' | 'momo',
    });
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
              items={items}
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
            />

            <Button
              size="lg"
              className="w-full mt-6"
              isLoading={createOrderMutation.isPending}
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
