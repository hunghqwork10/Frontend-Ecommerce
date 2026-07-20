import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ImageGallery from '@/components/common/ImageGallery';
import ProductInfo from '@/components/common/ProductInfo';
import ProductReviews from '@/components/common/ProductReviews';
import ProductCard from '@/components/common/ProductCard';
import { productService, cartService } from '@/services';
import { ProductDetailSkeleton } from '@/components/common/Skeleton';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getProductById(id!),
        enabled: !!id,
    });

    const { data: relatedProducts } = useQuery({
        queryKey: ['relatedProducts', id, product?.category?.slug],
        queryFn: () => productService.getRelatedProducts(id!, product!.category.slug),
        enabled: !!id && !!product?.category?.slug,
    });

    const addToCartMutation = useMutation({
        mutationFn: cartService.addToCart,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart'] });
        },
    });

    const handleAddToCart = (productId: string, quantity: number) => {
        addToCartMutation.mutate({ productId, quantity });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b">
                    <div className="container mx-auto px-4 py-4">
                        <div className="h-5 bg-gray-200 rounded w-64 animate-shimmer" />
                    </div>
                </div>
                <div className="container mx-auto px-4 py-8">
                    <ProductDetailSkeleton />
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Sản phẩm không tồn tại</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-4">
                    <nav className="text-sm text-gray-600">
                        <a href="/" className="hover:text-blue-600">Trang chủ</a>
                        <span className="mx-2">/</span>
                        <a href={`/${product.category.slug}`} className="hover:text-blue-600">{product.category.name}</a>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {/* Product Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <ImageGallery images={product.images} alt={product.name} />
                    <ProductInfo product={product} onAddToCart={handleAddToCart} />
                </div>

                {/* Description */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Mô tả sản phẩm</h2>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                {/* Specifications */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-2xl font-bold mb-4">Thông số kỹ thuật</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(product.specifications).map(([key, value]) => (
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
                        reviews={[]}
                        averageRating={product.rating}
                        reviewCount={product.reviewCount}
                    />
                </div>

                {/* Related Products */}
                {relatedProducts && relatedProducts.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
