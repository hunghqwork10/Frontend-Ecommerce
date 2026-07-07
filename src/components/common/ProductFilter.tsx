import { X } from 'lucide-react';
import type { ProductFilter } from '@/types';

interface ProductFilterProps {
  filter: ProductFilter;
  onChange: (filter: ProductFilter) => void;
}

const brands = ['Apple', 'Samsung', 'Dell', 'HP', 'Asus', 'Lenovo', 'Xiaomi'];
const ratings = [4, 3, 2, 1];

export default function ProductFilter({ filter, onChange }: ProductFilterProps) {
  const handleBrandToggle = (brand: string) => {
    const currentBrands = filter.brand || [];
    const newBrands = currentBrands.includes(brand)
      ? currentBrands.filter((b) => b !== brand)
      : [...currentBrands, brand];
    onChange({ ...filter, brand: newBrands });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    onChange({ ...filter, [field]: value ? Number(value) : undefined });
  };

  const handleRatingChange = (rating: number) => {
    onChange({ ...filter, minRating: filter.minRating === rating ? undefined : rating });
  };

  const clearFilter = () => {
    onChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">Bộ lọc</h3>
        <button
          onClick={clearFilter}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          <X className="w-4 h-4" />
          Xóa bộ lọc
        </button>
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Hãng</h4>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filter.brand?.includes(brand) || false}
                onChange={() => handleBrandToggle(brand)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Khoảng giá</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={filter.minPrice || ''}
            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Đến"
            value={filter.maxPrice || ''}
            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <h4 className="font-medium mb-3">Đánh giá từ</h4>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => handleRatingChange(rating)}
              className={`flex items-center gap-1 text-sm ${
                filter.minRating === rating ? 'text-yellow-500' : 'text-gray-400'
              }`}
            >
              <span>{'★'.repeat(rating)}</span>
              <span className="text-gray-600">trở lên</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}