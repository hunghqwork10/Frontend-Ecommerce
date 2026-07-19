import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ProductCard from '@/components/common/ProductCard';
import ProductFilter from '@/components/common/ProductFilter';
import ProductSort from '@/components/common/ProductSort';
import Pagination from '@/components/common/Pagination';
import { productService } from '@/services';
import type { ProductFilter as ProductFilterType } from '@/types';

export default function ProductList() {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');

  const [filter, setFilter] = useState<ProductFilterType>({
    category: category || undefined,
    search: search || undefined,
  });
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['products', filter, sortBy, currentPage],
    queryFn: () =>
      productService.getProducts({
        ...filter,
        sortBy: sortBy as ProductFilterType['sortBy'],
        page: currentPage,
      }),
  });

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  const handleFilterChange = (newFilter: ProductFilterType) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">
            {search
              ? `Kết quả tìm kiếm: "${search}"`
              : category
                ? `Danh mục: ${category}`
                : 'Tất cả sản phẩm'}
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
                Hiển thị <span className="font-medium">{data?.total ?? 0}</span> sản phẩm
              </p>
              <ProductSort value={sortBy} onChange={handleSortChange} />
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="text-center py-12 text-gray-500">Đang tải...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
