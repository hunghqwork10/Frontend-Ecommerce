import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CartItem from '@/components/common/CartItem';
import CartSummary from '@/components/common/CartSummary';
import Button from '@/components/common/Button';
import { CartItemSkeleton } from '@/components/common/Skeleton';
import { cartService } from '@/services';

export default function Cart() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [couponError, setCouponError] = useState<string | null>(null);

  const { data: cart, isLoading, error } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  const updateMutation = useMutation({
    mutationFn: cartService.updateCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: cartService.removeCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const couponMutation = useMutation({
    mutationFn: cartService.applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCouponError(null);
    },
    onError: (err: Error) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Mã giảm giá không hợp lệ';
      setCouponError(message);
    },
  });

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    const item = cart?.items.find((i) => i.product.id === productId);
    if (item) {
      updateMutation.mutate({ cartItemId: item.id, quantity });
    }
  };

  const handleRemove = (productId: string) => {
    const item = cart?.items.find((i) => i.product.id === productId);
    if (item) {
      removeMutation.mutate(item.id);
    }
  };

  const handleApplyCoupon = (code: string) => {
    setCouponError(null);
    couponMutation.mutate(code);
  };

  const handleRemoveCoupon = () => {
    cartService.clearCart().then(() => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      setCouponError(null);
    });
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Giỏ hàng</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <CartItemSkeleton key={`skel-${i}`} />
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="h-5 bg-gray-200 rounded w-32 animate-shimmer" />
                <div className="h-4 bg-gray-200 rounded w-full animate-shimmer" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer" />
                <div className="h-10 bg-gray-200 rounded w-full animate-shimmer" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải giỏ hàng.</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
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
          <h1 className="text-2xl font-bold">Giỏ hàng ({cart.totalItems} sản phẩm)</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
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
              subtotal={cart.totalAmount}
              shipping={cart.finalAmount > 5000000 ? 0 : 30000}
              discount={cart.discountAmount}
              total={cart.finalAmount}
              couponCode={cart.couponCode}
              onCheckout={handleCheckout}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={cart.couponCode ? handleRemoveCoupon : undefined}
              isCouponLoading={couponMutation.isPending}
              couponError={couponError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
