import { Trash2, Plus, Minus } from 'lucide-react';
import Button from './Button';
import type { CartItem } from '@/types';

interface CartItemProps {
  item: CartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleIncrease = () => {
    if (item.quantity < item.product.stock) {
      onUpdateQuantity(item.product.id, item.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(item.product.id);
  };

  const discount = item.product.originalPrice
    ? Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)
    : 0;

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg shadow-sm">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={item.product.images[0] || '/placeholder.jpg'}
          alt={item.product.name}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 mb-1">{item.product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{item.product.brand}</p>
        
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN').format(item.product.price)}đ
          </span>
          {item.product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {new Intl.NumberFormat('vi-VN').format(item.product.originalPrice)}đ
            </span>
          )}
          {discount > 0 && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quantity Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-1 font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrease}
              disabled={item.quantity >= item.product.stock}
              className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <Button variant="danger" size="sm" onClick={handleRemove}>
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </Button>
        </div>
      </div>

      {/* Subtotal */}
      <div className="text-right">
        <p className="text-sm text-gray-500">Thành tiền</p>
        <p className="text-xl font-bold text-gray-900">
          {new Intl.NumberFormat('vi-VN').format(item.product.price * item.quantity)}đ
        </p>
      </div>
    </div>
  );
}