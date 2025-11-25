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
  sub?:string;
  subPro?:string;
}

interface ProductState {
  products: ProductType[];
  loading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  loading: false,
  error: null,

fetchProducts: async (filters = {}) => {
  set({ loading: true, error: null });
  
  try {
    // Build query parameters - only include defined filters
    const params: Record<string, string> = {};
    
    // Handle URL query parameters mapping
    // Map 'sub' to 'category' and 'subPro' to 'subCategory'
    if (filters.sub) params.category = filters.sub;
    if (filters.subPro) params.subCategory = filters.subPro;
    
    // Add exclusive filters (keep your existing logic)
    if (filters.category) params.category = filters.category;
    if (filters.brand) params.brand = filters.brand;
    if (filters.subCategory) params.subCategory = filters.subCategory;
    if (filters.new) params.new = filters.new;
    if (filters.discount) params.discount = filters.discount;
    if (filters.best) params.best = filters.best;
    
    // Add other parameters
    if (filters.page) params.page = filters.page;
    if (filters.sort) params.sort = filters.sort;
    if (filters.search) params.search = filters.search;
    
    console.log("Fetching products with params:", params);
    const response = await api.get('/product/getAllProduct', { params });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    const data = response.data;
    console.log(response.data,"85")
    
    if (!data) {
      throw new Error('No data received from server');
    }

    if (!data.success) {
      throw new Error(data?.message || 'API returned unsuccessful response');
    }

    const productsArray = data.data || [];
    
    if (!Array.isArray(productsArray)) {
      throw new Error('Invalid data format: expected an array of products');
    }
    console.log(productsArray,"kdkdk")
    
    const transformedProducts: ProductType[] = productsArray.map((product) => ({
      id: product._id,
      brand: product.brandId?.name || product.brand || '',
      name: product.name || '',
      image: product.images?.[0] || '/placeholder-product.png',
      originalPrice: product.discount>0 ?((product.price*100)/product.discount):0  || 0,
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
    
    set({ 
      error: errorMessage,
      loading: false
    });
  }
},
}));