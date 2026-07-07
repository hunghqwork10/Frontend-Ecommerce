import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import type { Product } from '@/types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-square">
          <img
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-sm px-2 py-1 rounded">
              -{discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{product.rating}</span>
          <span className="text-sm text-gray-400">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-blue-600">
            {new Intl.NumberFormat('vi-VN').format(product.price)}đ
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {new Intl.NumberFormat('vi-VN').format(product.originalPrice)}đ
            </span>
          )}
        </div>

        <Button variant="outline" size="sm" className="w-full">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Thêm giỏ
        </Button>
      </div>
    </div>
  );
}