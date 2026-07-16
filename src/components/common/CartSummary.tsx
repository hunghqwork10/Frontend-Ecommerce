import Button from './Button';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  onCheckout: () => void;
}

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  onCheckout,
}: CartSummaryProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
      <h2 className="text-xl font-bold">Tóm tắt đơn hàng</h2>

      <div className="space-y-2">
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

      <Button size="lg" className="w-full" onClick={onCheckout}>
        Thanh toán ngay
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Bao gồm thuế VAT. Phí vận chuyển được tính khi thanh toán.
      </p>
    </div>
  );
}