import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Truck, CheckCircle, Clock, Package, XCircle } from 'lucide-react';
import { orderService } from '@/services';
import Button from '@/components/common/Button';
import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: typeof Package }> = {
  pending: { label: 'Chờ xác nhận', color: 'text-yellow-600', icon: Clock },
  confirmed: { label: 'Đã xác nhận', color: 'text-blue-600', icon: CheckCircle },
  processing: { label: 'Đang xử lý', color: 'text-blue-600', icon: Package },
  shipped: { label: 'Đang giao hàng', color: 'text-purple-600', icon: Truck },
  delivered: { label: 'Đã giao hàng', color: 'text-green-600', icon: CheckCircle },
  cancelled: { label: 'Đã hủy', color: 'text-red-600', icon: XCircle },
  refunded: { label: 'Đã hoàn tiền', color: 'text-gray-600', icon: XCircle },
};

const timelineSteps: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

const paymentMethodLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  credit_card: 'Thẻ tín dụng',
  momo: 'Ví MoMo',
};

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id!),
    enabled: !!id,
  });

  const cancelMutation = useMutation({
    mutationFn: orderService.cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', id] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) {
      cancelMutation.mutate(id!);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="h-5 bg-gray-200 rounded w-48 animate-shimmer" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-6 bg-gray-200 rounded w-64 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-full animate-shimmer" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer" />
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="h-5 bg-gray-200 rounded w-48 animate-shimmer" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded animate-shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-shimmer" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải thông tin đơn hàng.</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Đơn hàng không tồn tại.</p>
          <Link to="/orders" className="text-blue-600 hover:underline">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;
  const currentStepIndex = timelineSteps.indexOf(order.status);
  const canCancel = order.status === 'pending' || order.status === 'confirmed';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link to="/orders" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại danh sách đơn hàng
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Đơn hàng #{order.orderNumber}</h1>
            <div className={`flex items-center gap-2 font-medium ${status.color}`}>
              <StatusIcon className="w-5 h-5" />
              {status.label}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timeline */}
            {order.status !== 'cancelled' && order.status !== 'refunded' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-bold mb-6">Trạng thái đơn hàng</h2>
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
                  <div
                    className="absolute top-4 left-0 h-0.5 bg-blue-600 -z-10 transition-all"
                    style={{ width: `${(currentStepIndex / (timelineSteps.length - 1)) * 100}%` }}
                  />
                  {timelineSteps.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                          } ${isCurrent ? 'ring-2 ring-blue-200' : ''}`}
                        >
                          {isCompleted ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs font-medium">{index + 1}</span>}
                        </div>
                        <span className={`text-xs mt-2 text-center ${isCompleted ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                          {statusConfig[step].label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Sản phẩm ({order.items.length})</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <Link to={`/product/${item.productId}`}>
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.productId}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price)}đ</p>
                      <p className="text-sm text-gray-500">Tổng: {formatPrice(item.total)}đ</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span>{formatPrice(order.subtotal)}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span>{order.shippingFee === 0 ? 'Miễn phí' : `${formatPrice(order.shippingFee)}đ`}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="text-green-600">-{formatPrice(order.discountAmount)}đ</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{formatPrice(order.totalAmount)}đ</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Địa chỉ giao hàng</h2>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress.phone}</p>
                <p className="text-gray-600">
                  {order.shippingAddress.street}, {order.shippingAddress.ward},{' '}
                  {order.shippingAddress.district}, {order.shippingAddress.province}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Phương thức thanh toán</h2>
              <p className="text-sm text-gray-600">{paymentMethodLabels[order.paymentMethod]}</p>
              <p className="text-sm mt-1">
                Trạng thái:{' '}
                <span className={`font-medium ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </p>
            </div>

            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold mb-4">Thông tin đơn hàng</h2>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng</span>
                  <span className="font-medium">#{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt</span>
                  <span>{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cập nhật lần cuối</span>
                  <span>{formatDate(order.updatedAt)}</span>
                </div>
                {order.note && (
                  <div className="pt-2 border-t">
                    <span className="text-gray-600">Ghi chú:</span>
                    <p className="mt-1">{order.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <Button
                variant="danger"
                className="w-full"
                onClick={handleCancel}
                isLoading={cancelMutation.isPending}
              >
                Hủy đơn hàng
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
