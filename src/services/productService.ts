import api from './api';
import type { Product, ProductFilter, ProductListResponse } from '@/types';

export const productService = {
  // Lấy danh sách sản phẩm
  getProducts: async (filter: ProductFilter = {}) => {
    const params = new URLSearchParams();
    
    if (filter.category) params.append('category', filter.category);
    if (filter.brand) filter.brand.forEach(b => params.append('brand', b));
    if (filter.minPrice) params.append('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params.append('maxPrice', filter.maxPrice.toString());
    if (filter.minRating) params.append('minRating', filter.minRating.toString());
    if (filter.search) params.append('search', filter.search);
    if (filter.sortBy) params.append('sortBy', filter.sortBy);
    
    const response = await api.get<ProductListResponse>(`/products?${params}`);
    return response.data;
  },

  // Lấy chi tiết sản phẩm
  getProductById: async (id: string) => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Lấy sản phẩm liên quan
  getRelatedProducts: async (productId: string, category: string) => {
    const response = await api.get<Product[]>(`/products/${productId}/related`, {
      params: { category }
    });
    return response.data;
  },
};