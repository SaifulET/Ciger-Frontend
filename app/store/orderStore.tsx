import api from '@/lib/axios';
import { create } from 'zustand';

// Interfaces based on API responses
interface Brand {
  _id: string;
  name: string;
  feature?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface Product {
  _id: string;
  name: string;
  images: string[];
  price: number;
  discount: number;
  averageRating: number;
  available: number;
  quantity: string;
  isBest: boolean;
  isNew: boolean;
  isInStock: boolean;
  brandId: Brand;
  category: string;
  subCategory: string;
  colors: string[];
  description: string;
  updatedAt: string;
  __v: number;
}

interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  total: number;
  isSelected: boolean;
  isOrdered: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  email: string;
}

export interface ApiOrder {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  orderid: string;
  date: string;
  trackingNo: string;
  state: "processing" | "shipped" | "delivered" | "cancelled" | "refunded";
  tax: number;
  discount: number;
  shippingCost: number;
  subtotal: number;
  total: number;
  userId: User;
  isNextUsePayment: boolean;
  carts: CartItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface OrderStore {
  // Orders list state
  orders: ApiOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
  
  // Single order state
  currentOrder: ApiOrder | null;
  orderLoading: boolean;
  orderError: string | null;
  
  // Update order state
  updateLoading: boolean;
  updateError: string | null;
  
  // Actions
  fetchAllOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<void>;
  fetchOrderByUserId: (orderId: string) => Promise<void>;

  updateOrder: (orderId: string, updates: { trackingNo?: string; state?: string }) => Promise<void>;
  clearOrders: () => void;
  clearCurrentOrder: () => void;
  clearErrors: () => void;
}

// Helper function to extract error message
const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message) {
        return axiosError.response.data.message;
      }
    }
    if ('message' in error && typeof (error as { message: string }).message === 'string') {
      return (error as { message: string }).message;
    }
  }
  
  return 'An unexpected error occurred';
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  // Initial state
  orders: [],
  ordersLoading: false,
  ordersError: null,
  currentOrder: null,
  orderLoading: false,
  orderError: null,
  updateLoading: false,
  updateError: null,

  // Fetch all orders
  fetchAllOrders: async () => {
    set({ ordersLoading: true, ordersError: null });
    try {
      const response = await api.get('/order/getAllOrder');
      const data = response.data;
      
      if (data.success) {
        set({ orders: data.data || [], ordersLoading: false });
      } else {
        set({ ordersError: data.message || 'Failed to fetch orders', ordersLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching orders:", error);
      set({ ordersError: errorMessage, ordersLoading: false });
    }
  },

  // Fetch order by ID
  fetchOrderById: async (orderId: string) => {
    set({ orderLoading: true, orderError: null });
    try {
      const response = await api.get(`/order/getOrderById/${orderId}`);
      const data = response.data;
      
      if (data.success) {
        set({ currentOrder: data.data, orderLoading: false });
      } else {
        set({ orderError: data.message || 'Failed to fetch order', orderLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching order:", error);
      set({ orderError: errorMessage, orderLoading: false });
    }
  },
  fetchOrderByUserId: async (userId: string) => {
    set({ orderLoading: true, orderError: null });
    try {
      const response = await api.get(`/order/userOrder/${userId}`);
      const data = response.data;
      console.log(response.data.data,"180")
      
      if (data.success) {
        set({ currentOrder: data.data, orderLoading: false, orders: data.data });
      } else {
        set({ orderError: data.message || 'Failed to fetch order', orderLoading: false });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error fetching order:", error);
      set({ orderError: errorMessage, orderLoading: false });
    }
  },

  // Update order (status and/or tracking number) - WORKING VERSION
  updateOrder: async (orderId: string, updates: { trackingNo?: string; state?: string }) => {
    set({ updateLoading: true, updateError: null });
    try {
      console.log(orderId,updates, "ddkkd")
      const id = orderId;
      const response = await api.put(`/order/updateOrderById/${id}`, updates);
      
      const data = response.data;
      console.log(data,"201")
      if (data.success) {
        // Get current state
        const state = get();
        
        // Update current order if it matches
        const updatedCurrentOrder = state.currentOrder?._id === orderId 
          ? { ...state.currentOrder, ...updates }
          : state.currentOrder;

        // Update orders list
        const updatedOrders = state.orders.map(order =>
          order._id === orderId ? { ...order, ...updates } : order
        );

        // Set all updates at once using direct object assignment
        set({
          currentOrder: updatedCurrentOrder,
          orders: updatedOrders,
          updateLoading: false
        } as OrderStore);
      } else {
        set({ 
          updateError: data.message || 'Failed to update order', 
          updateLoading: false 
        });
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      console.log("Error updating order:", error);
      set({ 
        updateError: errorMessage, 
        updateLoading: false 
      });
    }
  },

  clearOrders: () => set({ orders: [], ordersError: null }),
  clearCurrentOrder: () => set({ currentOrder: null, orderError: null }),
  clearErrors: () => set({ ordersError: null, orderError: null, updateError: null }),
}));