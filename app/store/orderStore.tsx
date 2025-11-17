import api from '@/lib/axios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  placedDate: string;
  trackingNo: string;
  items: OrderItem[];
  tax: number;
  discount: number;
  shippingCost: number;
  subTotal: number;
  paymentAmount: number;
  paid: boolean;
}

// API Response Interfaces
interface ApiOrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ApiOrder {
  _id: string;
  orderId: string;
  state: string;
  trackingNo: string;
  date: string;
  carts: ApiOrderItem[];
}

interface ApiResponse {
  success: boolean;
  data: ApiOrder[] | string | ApiOrder ;
  message?: string;
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: (userId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
}

// Transform API state to our OrderStatus type
const mapApiStateToStatus = (state: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'processing': 'processing',
    'shipped': 'shipped',
    'delivered': 'delivered',
    'cancelled': 'cancelled'
  };
  return statusMap[state] || 'processing';
};

// Transform API date to our format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Type guard to check if value is ApiOrder
const isApiOrder = (value: unknown): value is ApiOrder => {
  return (
    typeof value === 'object' &&
    value !== null &&
    'orderId' in value &&
    'state' in value &&
    'date' in value
  );
};

// Type guard to check if value is ApiOrder array
const isApiOrderArray = (value: unknown): value is ApiOrder[] => {
  return Array.isArray(value) && value.every(isApiOrder);
};

// Helper function to safely parse and normalize data
const normalizeOrdersData = (data: ApiOrder[] | string | ApiOrder | null): ApiOrder[] => {
  // If it's already an array of ApiOrder, return it
  if (isApiOrderArray(data)) {
    return data;
  }

  // If it's a string, try to parse it
  if (typeof data === 'string') {
    const trimmed = data.trim();
    
    // If it's a non-JSON message like "No orders", return empty array
    if (!trimmed.startsWith('[') && !trimmed.startsWith('{')) {
      return [];
    }
    
    try {
      const parsed = JSON.parse(trimmed);
      if (isApiOrderArray(parsed)) {
        return parsed;
      }
      if (isApiOrder(parsed)) {
        return [parsed];
      }
      return [];
    } catch {
      return [];
    }
  }

  // If it's a single ApiOrder object, wrap in array
  if (isApiOrder(data)) {
    return [data];
  }

  // For null, undefined, or other unknown types
  return [];
};

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,

      fetchOrders: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/order/userOrder/${userId}`);
          const data: ApiResponse = response.data;

          console.log('API Response:', data);

          if (data.success) {
            // Normalize the data to always be an array of ApiOrder
            const ordersData = normalizeOrdersData(data.data);

            console.log('Normalized orders data:', ordersData);

            // Transform API data to match our Order interface
            const transformedOrders: Order[] = ordersData.map((apiOrder: ApiOrder) => {
              // Ensure carts is always an array
              const cartItems = Array.isArray(apiOrder.carts) ? apiOrder.carts : [];
              
              // Transform cart items to our OrderItem format
              const items: OrderItem[] = cartItems.map((cartItem, index) => ({
                id: cartItem._id || `item-${index}`,
                name: cartItem.name || 'Unknown Product',
                unitPrice: typeof cartItem.price === 'number' ? cartItem.price : 0,
                quantity: typeof cartItem.quantity === 'number' ? cartItem.quantity : 0,
                image: cartItem.image || 'https://via.placeholder.com/60x60?text=Product'
              }));

              // Calculate totals based on cart items
              const subTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
              const tax = 5;
              const discount = 5;
              const shippingCost = 10;
              const taxAmount = (subTotal * tax) / 100;
              const discountAmount = (subTotal * discount) / 100;
              const paymentAmount = subTotal + taxAmount - discountAmount + shippingCost;

              return {
                id: apiOrder.orderId || apiOrder._id || `order-${Date.now()}`,
                status: mapApiStateToStatus(apiOrder.state || 'processing'),
                placedDate: formatDate(apiOrder.date || new Date().toISOString()),
                trackingNo: apiOrder.trackingNo || '',
                items,
                tax,
                discount,
                shippingCost,
                subTotal,
                paymentAmount,
                paid: true
              };
            });

            set({ 
              orders: transformedOrders, 
              loading: false,
              error: null
            });
          } else {
            // Handle error case
            const errorMessage = data.message || 
                               (typeof data.data === 'string' ? data.data : 'Failed to fetch orders');
            
            set({ 
              error: errorMessage, 
              loading: false,
              orders: []
            });
          }
        } catch (error) {
          console.error('Fetch orders error:', error);
          set({ 
            error: 'Network error occurred', 
            loading: false 
          });
        }
      },

      cancelOrder: async (orderId: string) => {
        try {
          set(state => ({
            orders: state.orders.map(order =>
              order.id === orderId 
                ? { ...order, status: 'cancelled' as OrderStatus }
                : order
            )
          }));
        } catch (error) {
          set({ error: 'Failed to cancel order' });
        }
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({ orders: state.orders })
    }
  )
);