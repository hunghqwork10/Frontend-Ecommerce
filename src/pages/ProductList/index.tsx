import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/common/ProductCard';
import ProductFilter from '@/components/common/ProductFilter';
import ProductSort from '@/components/common/ProductSort';
import Pagination from '@/components/common/Pagination';
import type { Product, ProductFilter as ProductFilterType } from '@/types';

// Mock data - sẽ thay bằng API call sau
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'MacBook Pro 14 M3',
    slug: 'macbook-pro-14-m3',
    description: 'Laptop mạnh mẽ với chip M3',
    price: 34990000,
    originalPrice: 39990000,
    discount: 13,
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    brand: 'Apple',
    category: { id: '1', name: 'Laptop', slug: 'laptop' },
    stock: 10,
    sold: 50,
    rating: 4.8,
    reviewCount: 120,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Điện thoại flagship của Apple',
    price: 28990000,
    originalPrice: 31990000,
    discount: 9,
    images: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
    brand: 'Apple',
    category: { id: '2', name: 'Điện thoại', slug: 'phone' },
    stock: 20,
    sold: 100,
    rating: 4.9,
    reviewCount: 250,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Điện thoại Android cao cấp',
    price: 26990000,
    originalPrice: 29990000,
    discount: 10,
    images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    brand: 'Samsung',
    category: { id: '2', name: 'Điện thoại', slug: 'phone' },
    stock: 15,
    sold: 80,
    rating: 4.7,
    reviewCount: 180,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    description: 'Laptop mỏng nhẹ mạnh mẽ',
    price: 32990000,
    originalPrice: 35990000,
    discount: 8,
    images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800'],
    brand: 'Dell',
    category: { id: '1', name: 'Laptop', slug: 'laptop' },
    stock: 8,
    sold: 40,
    rating: 4.6,
    reviewCount: 90,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'iPad Pro 12.9 M2',
    slug: 'ipad-pro-12-9-m2',
    description: 'Tablet mạnh mẽ nhất',
    price: 24990000,
    originalPrice: 27990000,
    discount: 11,
    images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
    brand: 'Apple',
    category: { id: '3', name: 'Tablet', slug: 'tablet' },
    stock: 12,
    sold: 60,
    rating: 4.8,
    reviewCount: 150,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Asus ROG Strix G16',
    slug: 'asus-rog-strix-g16',
    description: 'Laptop gaming cao cấp',
    price: 38990000,
    originalPrice: 42990000,
    discount: 9,
    images: ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800'],
    brand: 'Asus',
    category: { id: '1', name: 'Laptop', slug: 'laptop' },
    stock: 5,
    sold: 30,
    rating: 4.5,
    reviewCount: 70,
    specifications: {},
    warranty: '12 tháng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const [filter, setFilter] = useState<ProductFilterType>({
    category: category || undefined,
  });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5); // Mock total pages

  const handleFilterChange = (newFilter: ProductFilterType) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi filter
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi sort
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            {category ? `Danh mục: ${category}` : 'Tất cả sản phẩm'}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <ProductFilter filter={filter} onChange={handleFilterChange} />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Hiển thị <span className="font-medium">{mockProducts.length}</span> sản phẩm
              </p>
              <ProductSort value={sortBy} onChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
