import type { CartItem } from '@/types';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export default function OrderSummary({
  items,
  subtotal,
  shipping,
  discount,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <h2 className="text-xl font-bold">Đơn hàng của bạn</h2>

      {/* Products */}
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <img
              src={item.product.images[0] || '/placeholder.jpg'}
              alt={item.product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
            </div>
            <p className="font-medium">
              {new Intl.NumberFormat('vi-VN').format(item.product.price * item.quantity)}đ
            </p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span>{new Intl.NumberFormat('vi-VN').format(subtotal)}đ</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span>{shipping === 0 ? 'Miễn phí' : new Intl.NumberFormat('vi-VN').format(shipping) + 'đ'}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá</span>
            <span>-{new Intl.NumberFormat('vi-VN').format(discount)}đ</span>
          </div>
        )}
        <div className="border-t pt-2 flex justify-between text-xl font-bold">
          <span>Tổng cộng</span>
          <span className="text-blue-600">{new Intl.NumberFormat('vi-VN').format(total)}đ</span>
        </div>
      </div>
    </div>
  );
}
