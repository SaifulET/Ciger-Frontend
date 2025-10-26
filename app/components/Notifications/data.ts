import { Notification } from './types';

export const notificationsData: Notification[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'John Doe',
    orderId: '#125123',
    status: 'placed',
    message: 'New Order has been placed',
    timestamp: '10 min ago',
  },
  {
    id: '2',
    userId: 'user1',
    userName: 'John Doe',
    orderId: '#125123',
    status: 'delivered',
    message: 'Order has been delivered',
    timestamp: '10 min ago',
  },
  {
    id: '3',
    userId: 'user1',
    userName: 'John Doe',
    orderId: '#125123',
    status: 'refunded',
    message: 'Your cancel order has been marked as Refunded',
    timestamp: '10 min ago',
  },
  {
    id: '4',
    userId: 'user1',
    userName: 'John Doe',
    orderId: '#125123',
    status: 'shipped',
    message: 'Order has been shipped',
    timestamp: '10 min ago',
  },
  {
    id: '5',
    userId: 'user1',
    userName: 'John Doe',
    orderId: '#125123',
    status: 'cancelled',
    message: 'Order has been cancelled',
    timestamp: '10 min ago',
  },
];
