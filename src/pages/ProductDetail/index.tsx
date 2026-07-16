import { useParams } from 'react-router-dom';
import ImageGallery from '@/components/common/ImageGallery';
import ProductInfo from '@/components/common/ProductInfo';
import ProductReviews from '@/components/common/ProductReviews';
import ProductCard from '@/components/common/ProductCard';
import type { Product } from '@/types';

// Mock data - sẽ thay bằng API call sau
const mockProduct: Product = {
    id: '1',
    name: 'MacBook Pro 14 M3',
    slug: 'macbook-pro-14-m3',
    description: 'Laptop mạnh mẽ với chip M3 Pro, màn hình Liquid Retina XDR 14.2 inch, RAM 18GB, SSD 512GB.',
    price: 34990000,
    originalPrice: 39990000,
    discount: 13,
    images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
    ],
    brand: 'Apple',
    category: { id: '1', name: 'Laptop', slug: 'laptop' },
    stock: 10,
    sold: 50,
    rating: 4.8,
    reviewCount: 120,
    specifications: {
        'CPU': 'Apple M3 Pro',
        'RAM': '18GB',
        'Storage': '512GB SSD',
        'Display': '14.2 inch Liquid Retina XDR',
        'GPU': '14-core GPU',
        'Battery': '70Wh',
        'Weight': '1.6kg',
    },
    warranty: '12 tháng chính hãng',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
};

const mockRelatedProducts: Product[] = [
    // Mock related products...
];

const mockReviews = [
    {
        id: '1',
        user: 'Nguyễn Văn A',
        rating: 5,
        comment: 'Sản phẩm tuyệt vời, ship nhanh, đóng gói kỹ!',
        date: '2024-01-15',
    },
    {
        id: '2',
        user: 'Trần Thị B',
        rating: 4,
        comment: 'Laptop chạy mượt, pin trâu, giá hợp lý.',
        date: '2024-01-10',
    },
];

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();

    const handleAddToCart = (productId: string, quantity: number) => {
        console.log('Add to cart:', productId, quantity);
        // TODO: Call cart service
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm text-gray-600">
                        <a href="/" className="hover:text-blue-600">Trang chủ</a>
                        <span className="mx-2">/</span>
                        <a href="/laptop" className="hover:text-blue-600">Laptop</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{mockProduct.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Product Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <ImageGallery images={mockProduct.images} alt={mockProduct.name} />
                    <ProductInfo product={mockProduct} onAddToCart={handleAddToCart} />
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-600 leading-relaxed">{mockProduct.description}</p>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(mockProduct.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between py-2 border-b">
                                <span className="text-gray-600">{key}</span>
                                <span className="font-medium">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Đánh giá khách hàng</h2>
                    <ProductReviews
                        reviews={mockReviews}
                        averageRating={mockProduct.rating}
                        reviewCount={mockProduct.reviewCount}
                    />
                </div>

                {/* Related Products */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockRelatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}