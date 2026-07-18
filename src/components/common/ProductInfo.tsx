import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import Button from './Button';
import type { Product } from '@/types';

interface ProductInfoProps {
  product: Product;
  onAddToCart: (productId: string, quantity: number) => void;
}

export default function ProductInfo({ product, onAddToCart }: ProductInfoProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product.id, quantity);
  };

  const handleBuyNow = () => {
    onAddToCart(product.id, quantity);
    navigate('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Brand */}
      <p className="text-sm text-gray-500">{product.brand}</p>

      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-lg ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating} ({product.reviewCount} đánh giá)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-blue-600">
          {new Intl.NumberFormat('vi-VN').format(product.price)}đ
        </span>
        {product.originalPrice && (
          <>
            <span className="text-xl text-gray-400 line-through">
              {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
            </span>
            {discount > 0 && (
              <span className="bg-red-600 text-white text-sm px-2 py-1 rounded">
                -{discount}%
              </span>
            )}
          </>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
        </span>
        <span className="text-sm text-gray-400">| Đã bán {product.sold}</span>
      </div>

      {/* Quantity */}
      <div className="flex items-center gap-4">
        <span className="font-medium">Số lượng:</span>
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            -
          </button>
          <span className="px-4 py-2 font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            disabled={quantity >= product.stock}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button size="lg" className="flex-1" onClick={handleAddToCart}>
          <ShoppingCart className="w-5 h-5 mr-2" />
          Thêm giỏ hàng
        </Button>
        <Button variant="secondary" size="lg" className="flex-1" onClick={handleBuyNow}>
          Mua ngay
        </Button>
        <Button variant="outline" size="lg" className="px-4">
          <Heart className="w-5 h-5" />
        </Button>
        <Button variant="outline" size="lg" className="px-4">
          <Share2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Warranty */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">Bảo hành:</span>
          <span>{product.warranty}</span>
        </div>
      </div>
    </div>
  );
}