import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import CategoryCard from '@/components/common/CategoryCard';
import ProductCard from '@/components/common/ProductCard';
import Button from '@/components/common/Button';
import { productService } from '@/services';

const categories = [
  { id: '1', name: 'Laptop', slug: 'laptop' },
  { id: '2', name: 'Điện thoại', slug: 'phone' },
  { id: '3', name: 'Tablet', slug: 'tablet' },
  { id: '4', name: 'Phụ kiện', slug: 'accessories' },
];

export default function Home() {
  const { data: bestSellers } = useQuery({
    queryKey: ['products', { sortBy: 'best_selling' }],
    queryFn: () => productService.getProducts({ sortBy: 'best_selling', pageSize: 8 }),
  });

  const { data: newProducts } = useQuery({
    queryKey: ['products', { sortBy: 'newest' }],
    queryFn: () => productService.getProducts({ sortBy: 'newest', pageSize: 8 }),
  });

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Khuyến mãi mùa hè
            </h1>
            <p className="text-xl mb-6 opacity-90">
              Giảm giá đến 30% cho các sản phẩm công nghệ
            </p>
            <Button size="lg" variant="secondary">
              Xem ngay <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Danh mục nổi bật</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm bán chạy</h2>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bestSellers?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Sản phẩm mới</h2>
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
