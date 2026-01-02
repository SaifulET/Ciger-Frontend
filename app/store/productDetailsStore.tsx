import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Product, Review, RelatedProduct, ApiProduct, ApiReview } from '@/app/components/ProductDetails/product';
import api from '@/lib/axios';

interface ProductsState {
  // State
  products: Product[];
  currentProduct: Product | null;
  relatedProducts: RelatedProduct[];
  reviews: Review[];
  featuredProducts: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
  cartItems: number;
  
  // Loading states
  loading: {
    products: boolean;
    product: boolean;
    reviews: boolean;
    related: boolean;
    featured: boolean;
    bestSellers: boolean;
    newArrivals: boolean;
    updateProduct: boolean;
    updateReview: boolean;
  };
  
  // Error states
  errors: {
    products: string | null;
    product: string | null;
    reviews: string | null;
    related: string | null;
    updateProduct: string | null;
    updateReview: string | null;
  };

  // Actions - Products
  fetchProductById: (id: string) => Promise<void>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<void>;
  fetchFeaturedProducts: (productId: string) => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchNewArrivals: () => Promise<void>;
  
  // Actions - Reviews
  fetchProductReviews: (productId: string) => Promise<void>;
  addReview: (productId: string, review: Omit<Review, 'id' | 'author' | 'date'>) => Promise<void>;
  updateReview: (reviewId: string, reviewData: Partial<Review>) => Promise<void>;
  
  // Actions - Related Products
  fetchRelatedProducts: (category: string,_id:string) => Promise<void>;
  
  // Actions - Cart
  addToCart: (quantity: number) => void;
  setCartItems: (count: number) => void;
  
  // Utility actions
  clearCurrentProduct: () => void;
  clearErrors: () => void;
  clearLoading: () => void;
}

// Interface for API review response
interface ApiReviewResponse {
  _id: string;
  rating: number;
  review: string;
  createdAt: string;
  userId?: {
    _id: string;
    email: string;
    firstName?:string;
    lastName?:string;
    image?:string;
  };
  productId?: {
    _id: string;
  };
}

export const useProductsStore = create<ProductsState>()(
  devtools((set, get) => ({
    // Initial state
    products: [],
    currentProduct: null,
    relatedProducts: [],
    reviews: [],
    featuredProducts: [],
    bestSellers: [],
    newArrivals: [],
    cartItems: 0,
    
    loading: {
      products: false,
      product: false,
      reviews: false,
      related: false,
      featured: false,
      bestSellers: false,
      newArrivals: false,
      updateProduct: false,
      updateReview: false,
    },
    
    errors: {
      products: null,
      product: null,
      reviews: null,
      related: null,
      updateProduct: null,
      updateReview: null,
    },

    // Fetch product by ID
    fetchProductById: async (id: string) => {
      set(state => ({ 
        loading: { ...state.loading, product: true },
        errors: { ...state.errors, product: null }
      }));
      
      try {
        const response = await api.get(`/product/getProductById/${id}`);
        const result = response.data;
        
        if (result.success) {
          const apiProduct: ApiProduct = result.data;
          const product: Product = transformApiProductToProduct(apiProduct);
          
          set({ 
            currentProduct: product,
            loading: { ...get().loading, product: false }
          });
          
          get().fetchProductReviews(id);
          if (apiProduct.category) {
            get().fetchRelatedProducts(apiProduct.category,apiProduct._id);
          }
        } else {
          throw new Error(result?.message || 'Failed to fetch product');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, product: error instanceof Error ? error.message : 'Failed to fetch product' },
          loading: { ...state.loading, product: false }
        }));
      }
    },

    // Update product
    updateProduct: async (id: string, productData: Partial<Product>) => {
      set(state => ({ 
        loading: { ...state.loading, updateProduct: true },
        errors: { ...state.errors, updateProduct: null }
      }));
      
      try {
        const response = await api.put(`/product/updateProductById/${id}`, productData);
        const result = response.data;
        
        if (result.success) {
          const { currentProduct } = get();
          if (currentProduct && currentProduct.id === id) {
            set({ 
              currentProduct: { ...currentProduct, ...productData },
              loading: { ...get().loading, updateProduct: false }
            });
          }
        } else {
          throw new Error(result?.message || 'Failed to update product');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, updateProduct: error instanceof Error ? error.message : 'Failed to update product' },
          loading: { ...state.loading, updateProduct: false }
        }));
      }
    },

    // Fetch featured products
    fetchFeaturedProducts: async (productId: string) => {
      set(state => ({ 
        loading: { ...state.loading, featured: true },
        errors: { ...state.errors, products: null }
      }));
      
      try {
        const response = await api.get(`/review/getAllReview?productId=${productId}`);
        const result = response.data;
        
        if (result.success) {
          const featuredProducts: Product[] = result.data.map(transformApiProductToProduct);
          set({ 
            featuredProducts,
            loading: { ...get().loading, featured: false }
          });
        } else {
          throw new Error(result?.message || 'Failed to fetch featured products');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, products: error instanceof Error ? error.message : 'Failed to fetch featured products' },
          loading: { ...state.loading, featured: false }
        }));
      }
    },

    // Fetch best sellers
    fetchBestSellers: async () => {
      set(state => ({ 
        loading: { ...state.loading, bestSellers: true },
        errors: { ...state.errors, products: null }
      }));
      
      try {
        const response = await api.get('/product/getAllProduct', {
          params: { best: 'true' }
        });
        
        const result = response.data;
        
        if (result.success) {
          const bestSellers: Product[] = result.data.map(transformApiProductToProduct);
          set({ 
            bestSellers,
            loading: { ...get().loading, bestSellers: false }
          });
        } else {
          throw new Error(result?.message || 'Failed to fetch best sellers');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, products: error instanceof Error ? error.message : 'Failed to fetch best sellers' },
          loading: { ...state.loading, bestSellers: false }
        }));
      }
    },

    // Fetch new arrivals
    fetchNewArrivals: async () => {
      set(state => ({ 
        loading: { ...state.loading, newArrivals: true },
        errors: { ...state.errors, products: null }
      }));
      
      try {
        const response = await api.get('/product/getAllProduct', {
          params: { new: 'true' }
        });
        
        const result = response.data;
        
        if (result.success) {
          const newArrivals: Product[] = result.data.map(transformApiProductToProduct);
          set({ 
            newArrivals,
            loading: { ...get().loading, newArrivals: false }
          });
        } else {
          throw new Error(result?.message || 'Failed to fetch new arrivals');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, products: error instanceof Error ? error.message : 'Failed to fetch new arrivals' },
          loading: { ...state.loading, newArrivals: false }
        }));
      }
    },

    // Fetch reviews for a product
    fetchProductReviews: async (productId: string) => {
      set(state => ({ 
        loading: { ...state.loading, reviews: true },
        errors: { ...state.errors, reviews: null }
      }));
      
      try {
        const response = await api.get('/review/getAllReview');
        const result = response.data;
        
        if (result.success) {
          const apiReviews: ApiReviewResponse[] = result.data;
          
          const productReviews = apiReviews
            .filter((review: ApiReviewResponse) => review.productId?._id === productId)
            .map(transformApiReviewToReview);
          
          set({ 
            reviews: productReviews,
            loading: { ...get().loading, reviews: false }
          });
          
          const { currentProduct } = get();
          if (currentProduct && currentProduct.id === productId) {
            set({
              currentProduct: {
                ...currentProduct,
                reviews: productReviews,
                totalReviews: productReviews.length,
                averageRating: calculateAverageRating(productReviews),
                ratingBreakdown: calculateRatingBreakdown(productReviews),
              }
            });
          }
        } else {
          throw new Error(result?.message || 'Failed to fetch reviews');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, reviews: error instanceof Error ? error.message : 'Failed to fetch reviews' },
          loading: { ...state.loading, reviews: false }
        }));
      }
    },

    // Add a new review
    addReview: async (productId: string, reviewData: Omit<Review, 'id' | 'author' | 'date'>) => {

      try {
        const isLoggedIn = !!document.cookie.includes('token');
        if (!isLoggedIn) {
          throw new Error('Please login to add a review');
        }

        const response = await api.post('/review/createReview', {
          productId,
          ...reviewData
        });
        
        const result = response.data;
        
        if (result.success) {
          get().fetchProductReviews(productId);
        } else {
          throw new Error(result?.message || 'Failed to add review');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, reviews: error instanceof Error ? error.message : 'Failed to add review' }
        }));
      }
    },

    // Update review
    updateReview: async (reviewId: string, reviewData: Partial<Review>) => {
      set(state => ({ 
        loading: { ...state.loading, updateReview: true },
        errors: { ...state.errors, updateReview: null }
      }));
      
      try {
        const response = await api.put(`/review/updateReview/${reviewId}`, reviewData);
        const result = response.data;
        
        if (result.success) {
          const { currentProduct } = get();
          if (currentProduct) {
            get().fetchProductReviews(currentProduct.id);
          }
        } else {
          throw new Error(result?.message || 'Failed to update review');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, updateReview: error instanceof Error ? error.message : 'Failed to update review' },
          loading: { ...state.loading, updateReview: false }
        }));
      }
    },

    // Fetch related products
    fetchRelatedProducts: async (category: string,id:string) => {
      set(state => ({ 
        loading: { ...state.loading, related: true },
        errors: { ...state.errors, related: null }
      }));
      
      try {
        const response = await api.get('/product/getRelatedProduct/'+id);
        
        const result = response.data;
        console.log(result)
        
        if (result.success) {
          
          const apiProducts: ApiProduct[] = result.data;
const filteredProducts = apiProducts.filter(p => p._id !== id);

const relatedProducts: RelatedProduct[] =filteredProducts.map(apiProduct => ({
            id: apiProduct._id,
            brand: apiProduct.brand,
            name: apiProduct.name,
            image: apiProduct.images[0] || '',
            currentPrice: apiProduct.price,
            originalPrice: apiProduct.discount > 0 ? ((apiProduct.price *100)/(100-apiProduct.discount)) :0,
            newBestSeller: apiProduct.newBestSeller,
            newSeller: apiProduct.newSeller,
            available:apiProduct.available,
          }));
          
          set({ 
            relatedProducts,
            loading: { ...get().loading, related: false }
          });
        } else {
          throw new Error(result?.message || 'Failed to fetch related products');
        }
      } catch (error) {
        set(state => ({
          errors: { ...state.errors, related: error instanceof Error ? error.message : 'Failed to fetch related products' },
          loading: { ...state.loading, related: false }
        }));
      }
    },

    // Cart actions
    addToCart: (quantity: number) => {
      set(state => ({ cartItems: state.cartItems + quantity }));
    },

    setCartItems: (count: number) => {
      set({ cartItems: count });
    },

    // Utility actions
    clearCurrentProduct: () => {
      set({ currentProduct: null, reviews: [], relatedProducts: [] });
    },

    clearErrors: () => {
      set({
        errors: {
          products: null,
          product: null,
          reviews: null,
          related: null,
          updateProduct: null,
          updateReview: null,
        }
      });
    },

    clearLoading: () => {
      set({
        loading: {
          products: false,
          product: false,
          reviews: false,
          related: false,
          featured: false,
          bestSellers: false,
          newArrivals: false,
          updateProduct: false,
          updateReview: false,
        }
      });
    },
  }))
);

// Helper functions
const transformApiProductToProduct = (apiProduct: ApiProduct): Product => {
  return {
    id: apiProduct._id,
    _id: apiProduct._id,
    brand: apiProduct.brand,
    name: apiProduct.name,
    title: apiProduct.title,
    price: apiProduct.price,
    originalPrice: apiProduct.discount > 0 ? apiProduct.price : undefined,
    inStock: apiProduct.inStock || apiProduct.isInStock,
    newArrival: apiProduct.isNew,
    bestSeller: apiProduct.isBest,
    images: apiProduct.images,
    colors: apiProduct.colors,
    description: apiProduct.description,
    reviews: [],
    totalReviews: 0,
    averageRating: apiProduct.averageRating,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    category: apiProduct.category,
    subCategory:apiProduct.subCategory,
    discount: apiProduct.discount,
    currentPrice: apiProduct.currentPrice,
    available: apiProduct.available,
  };

};

const transformApiReviewToReview = (apiReview: ApiReviewResponse): Review => {
  const date = new Date(apiReview.createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffMinutes = Math.ceil(diffTime / (1000 * 60));
  
  let displayDate = '';
  if (diffMinutes < 60) {
    displayDate = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    displayDate = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffDays < 7) {
    displayDate = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else {
    displayDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  const email = apiReview.userId?.email || 'anonymous@example.com';
  const authorName = email.split('@')[0];
  
  return {
    id: apiReview._id,
    author: apiReview.userId?.firstName|| "" + apiReview.userId?.lastName ||"" ,
    rating: apiReview.rating,
    date: displayDate,
    text: apiReview.review,
    userId: apiReview.userId?._id,
    image:apiReview.userId?.image||"https://www.selectmarket.ae/wp-content/uploads/2016/05/5ed0bc59411f1356d4fdf40b_dummy-person.png",
    createdAt: apiReview.createdAt,
  };
};

const calculateAverageRating = (reviews: Review[]): number => {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / reviews.length).toFixed(1));
};

const calculateRatingBreakdown = (reviews: Review[]): Record<number, number> => {
  const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    breakdown[review.rating]++;
  });
  
  return breakdown;
};