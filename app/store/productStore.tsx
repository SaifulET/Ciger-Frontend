import api from '@/lib/axios';
import { create } from 'zustand';

interface ProductType {
  id: number;
  brand: string;
  name: string;
  image: string;
  originalPrice: number;
  currentPrice: number;
  newBestSeller: boolean;
  newSeller: boolean;
  inStock: boolean;
  feature: string[];
  category: string;
  subcategory: string;
  description: string;
  discount: number;
  price: number;
  title: string;
  averageRating: number;
  available: number;
  colors: string[];
}

interface ProductFilters {
  category?: string;
  brand?: string;
  subCategory?: string;
  new?: string;
  discount?: string;
  best?: string;
  page?: string;
  sort?: string;
  search?: string;
  sub?: string;
  subPro?: string;
  keyword?: string;
}

interface ProductState {
  products: ProductType[];
  fullProducts: ProductType[];
  loading: boolean;
  error: string | null;
  fetchAllProducts: () => Promise<void>;
  fetchProductsByKeyword: (keyword: string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  fullProducts: [],
  loading: false,
  error: null,

  fetchAllProducts: async () => {
    const state = useProductStore.getState();
    if (state.fullProducts.length > 0) return;

    set({ loading: true, error: null });
    try {
      const response = await api.get('/product/getAllProduct');
      
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data?.message || 'API returned unsuccessful response');
      }

      const productsArray = data.data || [];
      
      if (!Array.isArray(productsArray)) {
        throw new Error('Invalid data format: expected an array of products');
      }
      
      const transformedProducts: ProductType[] = productsArray.map((product) => ({
        id: product._id,
        brand: product.brandId?.name || product.brand || '',
        name: product.name || '',
        image: product.images?.[0] || '/placeholder-product.png',
        originalPrice: product.discount > 0 ? ((product.price * 100) / (100-product.discount)) : 0,
        currentPrice: product.currentPrice || product.price || 0,
        newBestSeller: product.isBest || false,
        newSeller: product.isNew || false,
        inStock: product.isInStock !== undefined ? product.isInStock : true,
        feature: product.feature || [],
        category: product.category || '',
        subcategory: product.subCategory || '',
        description: product.description || '',
        discount: product.discount || 0,
        price: product.price || 0,
        title: product.title || '',
        averageRating: product.averageRating || 0,
        available: product.available || 0,
        colors: product.colors || [],
      }));

      set({ 
        fullProducts: transformedProducts,
        products: transformedProducts,
        loading: false, 
        error: null,
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: errorMessage, loading: false });
    }
  },

  fetchProductsByKeyword: async (keyword: string) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/product/filter/${keyword}`);
      
      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = response.data;
      
      if (!data.success) {
        throw new Error(data?.message || 'API returned unsuccessful response');
      }

      const productsArray = data.data || [];
      
      if (!Array.isArray(productsArray)) {
        throw new Error('Invalid data format: expected an array of products');
      }
      
      const transformedProducts: ProductType[] = productsArray.map((product) => ({
        id: product._id,
        brand: product.brandId?.name || product.brand || '',
        name: product.name || '',
        image: product.images?.[0] || '/placeholder-product.png',
        originalPrice: product.discount > 0 ? ((product.price * 100) / (100-product.discount)) : 0,
        currentPrice: product.currentPrice || product.price || 0,
        newBestSeller: product.isBest || false,
        newSeller: product.isNew || false,
        inStock: product.isInStock !== undefined ? product.isInStock : true,
        feature: product.feature || [],
        category: product.category || '',
        subcategory: product.subCategory || '',
        description: product.description || '',
        discount: product.discount || 0,
        price: product.price || 0,
        title: product.title || '',
        averageRating: product.averageRating || 0,
        available: product.available || 0,
        colors: product.colors || [],
      }));

      set({ 
        products: transformedProducts,
        loading: false, 
        error: null,
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: errorMessage, loading: false });
    }
  },
}));