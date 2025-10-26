import { TrackingData } from './types';

export const mockData: { [key: string]: TrackingData } = {
  '32232423': {
    trackingNumber: '32232423',
    orderId: '232423',
    status: 'Shipped',
  },
  '45678901': {
    trackingNumber: '45678901',
    orderId: '456789',
    status: 'Delivered',
  },
  '12345678': {
    trackingNumber: '12345678',
    orderId: '123456',
    status: 'In Transit',
  },
};
