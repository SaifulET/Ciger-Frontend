// stores/cartStore.ts
import api from '@/lib/axios';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Helper function to parse price strings
const parsePrice = (price: string | number): number => {
  if (typeof price === 'number') return price;
  
  const cleaned = price.replace(/[^\d.]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Types based on your API response
export interface Product {
  _id?: string ;
  name: string;
  image: string | string[];
  price: number;
  discount?: number;
  description?: string;
  isInStock?: boolean;
  brand?:string;
  brandId?:{
    name:string;
  };
  available?: number;
  images?: string|string[];
}

export interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  isSelected: boolean;
  createdAt: string;
  updatedAt: string;
  total: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSyncing: boolean;
  
  // Actions
  initializeCart: (userId: string | null) => Promise<void>;
  addItem: (product: Product, userId: string |null) => Promise<void>;
  updateQuantity: (cartItemId: string, newQuantity: number, userId: string | null) => Promise<void>;
  removeItem: (cartItemId: string, userId: string | null) => Promise<void>;
  clearCart: (userId: string | null) => Promise<void>;
  syncGuestCartToUser: (userId: string) => Promise<void>;
  
  // Computed
  getCartCount: () => number;
  getSubtotal: () => number;
  getFormattedSubtotal: () => string;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSyncing: false,

      // Initialize cart based on auth status
      initializeCart: async (userId: string | null) => {
        set({ isLoading: true });
        try {
          if (userId) {
            const response = await api.get(`/cart/getUserCart/${userId}`);
            const result = await response.data;
            if (result.success) {
              const backendItems: CartItem[] = result.data.map((item: CartItem) => {
                const price = (item.productId?.price);
                const quantity = Number(item.quantity) || 1;
                const total = price * quantity;
                
                return {
                  _id: item._id,
                  userId: item.userId,
                  productId: {
                    ...item.productId,
                    price: price,
                    image: item.productId?.image || item.productId?.images?.[0] || '',
                  },
                  
                  quantity: quantity,
                  isSelected: item.isSelected !== undefined ? item.isSelected : true,
                  createdAt: item.createdAt,
                  updatedAt: item.updatedAt,
                  total: total
                };
              });
              
              set({ items: backendItems });
            }
          }
        } catch (error) {
          console.error('Failed to initialize cart:', error);
        } finally {
          set({ isLoading: false });
        }
      },

      // Add item to cart
      addItem: async (product: Product, userId: string | null) => {
        
        const { items, getItemQuantity } = get();
        
        
        if (userId) {
          set({ isSyncing: true });
          try {
            const response = await api.post('/cart/createCart', {
              userId: userId,
              productId: product._id,
              quantity:  1
            });
            
            const result = await response.data;
            
            if (result.success) {
              await get().initializeCart(userId);
            }
          } catch (error) {
            console.error('Failed to add item:', error);
          } finally {
            set({ isSyncing: false });
          }
        } else {
          const existingItem = items.find(item => item.productId._id === product._id);
          const price = (product.price);
          
          if (existingItem) {
            const newQuantity = existingItem.quantity + 1;
            const updatedItems = items.map(item =>
              item.productId._id === product._id
                ? {
                    ...item,
                    quantity: newQuantity,
                    total: price * newQuantity
                  }
                : item
            );
            set({ items: updatedItems });
          } else {
            const newItem: CartItem = {
              _id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              userId: 'guest',
              productId: {
                ...product,
                price: price,
                image: product?.image || ''
              },
              quantity: 1,
              isSelected: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              total: price
            };
            set({ items: [...items, newItem] });
          }
        }
      },

      // Update item quantity - FIXED THIS FUNCTION
      updateQuantity: async (cartItemId: string, newQuantity: number, userId: string | null) => {
       
        
        const { items } = get();
        
        if (userId) {
          set({ isSyncing: true });
          try {
            console.log('Making API call to update quantity...');
            // FIX: Use proper axios syntax
            const response = await api.put(`/cart/updateCart/${cartItemId}`, 
              { quantity: newQuantity }, // Request data
              { headers: { 'Content-Type': 'application/json' } } // Config
            );
            
            console.log('API response:', response.data);
            
            if (response.data) {
              await get().initializeCart(userId);
            }
          } catch (error) {
            console.error('Failed to update quantity:', error);
          } finally {
            set({ isSyncing: false });
          }
        } else {
          console.log('Updating local cart quantity...');
          const updatedItems = items.map(item => {
            if (item._id === cartItemId) {
              const price = (item.productId.price);
              const quantity = Number(newQuantity) || 1;
              const updatedItem = {
                ...item,
                quantity: quantity,
                total: price * quantity,
                updatedAt: new Date().toISOString()
              };
              console.log('Updated item:', updatedItem);
              return updatedItem;
            }
            return item;
          });
          set({ items: updatedItems });
          console.log('Local cart updated with items:', updatedItems);
        }
      },

      // Remove item from cart
      removeItem: async (cartItemId: string, userId: string | null) => {
        if (userId) {
          set({ isSyncing: true });
          try {
            const response = await api.delete(`/cart/deleteCart/${cartItemId}`);
            
            if (response.data) {
              await get().initializeCart(userId);
            }
          } catch (error) {
            console.error('Failed to remove item:', error);
          } finally {
            set({ isSyncing: false });
          }
        } else {
          const { items } = get();
          const updatedItems = items.filter(item => item._id !== cartItemId);
          set({ items: updatedItems });
        }
      },

      // Clear entire cart
      clearCart: async (userId: string | null) => {
        if (userId) {
          const { items } = get();
          set({ isSyncing: true });
          
          try {
            await Promise.all(
              items.map(item => 
                api.delete(`/cart/deleteCart/${item._id}`)
              )
            );
            set({ items: [] });
          } catch (error) {
            console.error('Failed to clear cart:', error);
          } finally {
            set({ isSyncing: false });
          }
        } else {
          set({ items: [] });
        }
      },

      // Sync guest cart to user when they login
      syncGuestCartToUser: async (userId: string) => {
        const { items } = get();
        set({ isSyncing: true });
        
        try {
          await Promise.all(
            items.map(item =>
              api.post('/cart/createCart', {
                userId: userId,
                productId: item.productId._id,
                quantity: item.quantity
              })
            )
          );
          await get().initializeCart(userId);
        } catch (error) {
          console.error('Failed to sync guest cart:', error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Computed values
      getCartCount: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.quantity || 0), 0);
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.total || 0), 0);
      },

      getFormattedSubtotal: () => {
        const { items } = get();
        const subtotal = items.reduce((total, item) => total + (item.total || 0), 0);
        return `$${subtotal.toFixed(2)}`;
      },

      getItemQuantity: (productId: string) => {
        const { items } = get();
        const item = items.find(item => item.productId._id === productId);
        return item ? (item.quantity || 0) : 0;
      }
    }),
    {
      name: 'cart-storage',
      skipHydration: false
    }
  )
);