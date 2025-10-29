import React from 'react';
import OrderItemsTable, { OrderItem } from './OrderItemsTable';

type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

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

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; dotColor: string }> = {
  processing: { label: 'Processing', color: 'text-yellow-500', dotColor: 'bg-yellow-500' },
  shipped: { label: 'Shipped', color: 'text-gray-500', dotColor: 'bg-gray-500' },
  delivered: { label: 'Delivered', color: 'text-green-500', dotColor: 'bg-green-500' },
  cancelled: { label: 'Cancelled', color: 'text-red-500', dotColor: 'bg-red-500' },
};

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const statusConfig = STATUS_CONFIG[order.status];

  return (
    <div className="bg-white p-[16px] md:p-[32px]">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Order #{order.id}</h2>
          <p className="text-sm text-gray-600">Placed on {order.placedDate}</p>
        </div>
        <div className="text-right">
          <div  className={`flex justify-center items-center gap-2 font-medium text-sm p-2 rounded-lg 
    ${statusConfig.color}  ${
      statusConfig.color === 'text-yellow-500'
        ? 'bg-yellow-50'
        : statusConfig.color === 'text-red-500'
        ? 'bg-red-50'
        : statusConfig.color === 'text-green-500'
        ? 'bg-green-100'
        : 'bg-gray-100'
    }`}>
            <span>{statusConfig.label}</span>
            <div className={`w-2 h-2 rounded-full ${statusConfig.dotColor}`}></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">Tracking no: {order.trackingNo}</p>
        </div>
      </div>

      {/* Items Table */}
      <OrderItemsTable {...order} />

      {/* Cancel Button */}
      {order.status === 'processing' && (
        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded">
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
