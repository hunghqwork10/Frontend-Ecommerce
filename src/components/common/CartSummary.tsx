import { useState } from 'react';
import { Tag, X } from 'lucide-react';
import Button from './Button';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  couponCode?: string;
  onCheckout: () => void;
  onApplyCoupon?: (code: string) => void;
  onRemoveCoupon?: () => void;
  isCouponLoading?: boolean;
  couponError?: string | null;
}

export default function CartSummary({
  subtotal,
  shipping,
  discount,
  total,
  couponCode,
  onCheckout,
  onApplyCoupon,
  onRemoveCoupon,
  isCouponLoading = false,
  couponError,
}: CartSummaryProps) {
  const [inputValue, setInputValue] = useState('');

  const handleApply = () => {
    const code = inputValue.trim().toUpperCase();
    if (code && onApplyCoupon) {
      onApplyCoupon(code);
    }
  };

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

      {/* Coupon Section */}
      <div className="border-t pt-4">
        {couponCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{couponCode}</span>
            </div>
            {onRemoveCoupon && (
              <button
                onClick={onRemoveCoupon}
                className="text-gray-400 hover:text-red-500"
                title="Xóa mã giảm giá"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                placeholder="Nhập mã giảm giá"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                disabled={isCouponLoading}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleApply}
                isLoading={isCouponLoading}
                disabled={!inputValue.trim()}
              >
                Áp dụng
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-red-500 mt-1">{couponError}</p>
            )}
          </div>
        )}
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
