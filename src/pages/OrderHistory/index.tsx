import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Package, Eye } from 'lucide-react';
import Pagination from '@/components/common/Pagination';
import { orderService } from '@/services';
import type { OrderStatus } from '@/types';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-800' },
};

const paymentMethodLabels: Record<string, string> = {
  cod: 'Thanh toán khi nhận hàng',
  bank_transfer: 'Chuyển khoản ngân hàng',
  credit_card: 'Thẻ tín dụng',
  momo: 'Ví MoMo',
};

const formatPrice = (price: number) => new Intl.NumberFormat('vi-VN').format(price);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function OrderHistory() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['orders', currentPage],
    queryFn: () => orderService.getOrders({ page: currentPage }),
  });

  const totalPages = data ? Math.ceil(data.total / 10) : 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-48 animate-shimmer" />
              <div className="h-4 bg-gray-200 rounded w-32 animate-shimmer" />
              <div className="h-4 bg-gray-200 rounded w-64 animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Không thể tải danh sách đơn hàng.</p>
          <button onClick={() => window.location.reload()} className="text-blue-600 hover:underline">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!data || data.orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Package className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Chưa có đơn hàng</h2>
            <p className="text-gray-600 mb-6">Bạn chưa đặt đơn hàng nào. Hãy bắt đầu mua sắm!</p>
            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-4">
        {data.orders.map((order) => {
          const status = statusConfig[order.status];
          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">#{order.orderNumber}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">Đặt ngày {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{formatPrice(order.totalAmount)}đ</p>
                  <p className="text-sm text-gray-500">{paymentMethodLabels[order.paymentMethod]}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{formatPrice(item.total)}đ</p>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/orders/${order.id}`}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
