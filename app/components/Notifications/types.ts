export interface Notification {
  id: string;
  userId: string;
  userName: string;
  orderId: string;
  status: 'placed' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
  message: string;
  timestamp: string;
}
