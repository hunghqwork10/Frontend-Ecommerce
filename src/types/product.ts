export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  brand: string;
  category: Category;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  specifications: Record<string, string>;
  warranty: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
}

export interface ProductFilter {
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  search?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'best_selling';
  page?: number;
  pageSize?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
}