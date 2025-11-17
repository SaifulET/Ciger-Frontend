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
  // Add other fields from API if needed
}

interface ApiResponse {
  success: boolean;
  data: ApiOrder[];
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

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      loading: false,
      error: null,

      fetchOrders: async (userId: string) => {
        set({ loading: true, error: null });
        try {
          const response = await api.get(`/api/order/userOrder/${userId}`);
          const data: ApiResponse = await response.data;

          if (data.success) {
            // Transform API data to match our Order interface
            const transformedOrders: Order[] = data.data.map((apiOrder: ApiOrder) => {
              // Transform cart items to our OrderItem format
              const items: OrderItem[] = apiOrder.carts.map((cartItem, index) => ({
                id: cartItem._id || `item-${index}`,
                name: cartItem.name,
                unitPrice: cartItem.price,
                quantity: cartItem.quantity,
                image: cartItem.image || 'https://via.placeholder.com/60x60?text=Product'
              }));

              // Calculate totals based on cart items
              const subTotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
              const tax = 5; // Default tax percentage
              const discount = 5; // Default discount percentage
              const shippingCost = 10; // Default shipping cost
              const taxAmount = (subTotal * tax) / 100;
              const discountAmount = (subTotal * discount) / 100;
              const paymentAmount = subTotal + taxAmount - discountAmount + shippingCost;

              return {
                id: apiOrder.orderId,
                status: mapApiStateToStatus(apiOrder.state),
                placedDate: formatDate(apiOrder.date),
                trackingNo: apiOrder.trackingNo,
                items,
                tax,
                discount,
                shippingCost,
                subTotal,
                paymentAmount,
                paid: true // Assuming all orders from API are paid based on your data
              };
            });

            set({ 
              orders: transformedOrders, 
              loading: false 
            });
          } else {
            set({ 
              error: 'Failed to fetch orders', 
              loading: false 
            });
          }
        } catch (error) {
          set({ 
            error: 'Network error occurred', 
            loading: false 
          });
        }
      },

      cancelOrder: async (orderId: string) => {
        try {
          // API call to cancel order would go here
          // For now, we'll update local state
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