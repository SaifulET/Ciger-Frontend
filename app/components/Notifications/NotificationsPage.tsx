"use client";

import { Check, X, Clock, Truck } from 'lucide-react';
import { notificationsData } from './data';
import { Notification } from './types';

const getIconAndColors = (
  status: Notification['status']
): { icon: React.ReactNode; bgColor: string; iconColor: string } => {
  switch (status) {
    case 'placed':
      return { icon: <Clock className="w-6 h-6" />, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' };
    case 'shipped':
      return { icon: <Truck className="w-6 h-6" />, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' };
    case 'delivered':
      return { icon: <Check className="w-6 h-6" />, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
    case 'refunded':
      return { icon: <Check className="w-6 h-6" />, bgColor: 'bg-green-100', iconColor: 'text-green-600' };
    case 'cancelled':
      return { icon: <X className="w-6 h-6" />, bgColor: 'bg-red-100', iconColor: 'text-red-600' };
    default:
      return { icon: <Clock className="w-6 h-6" />, bgColor: 'bg-gray-100', iconColor: 'text-gray-600' };
  }
};

export default function NotificationsPage() {
  return (
    <div className="  p-[16px] md:p-[32px] ">
      <div className="">
        <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl md:text-[40px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal  bg-white text-center rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Notifications
        </h1>

        <div className="space-y-4 bg-white rounded-lg p-[16px] md:p-[32px]">
          {notificationsData.map((notification) => {
            const { icon, bgColor, iconColor } = getIconAndColors(notification.status);

            return (
              <div
                key={notification.id}
                className="bg-white border border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg"
              >
                <div className={`${bgColor} rounded-full p-3 flex-shrink-0`}>
                  <div className={iconColor}>{icon}</div>
                </div>

                <div className="flex-grow">
                  <p className="text-sm font-medium text-gray-900">{notification.userName}</p>
                  <p className="text-sm text-gray-600">
                    Order ID: {notification.orderId} | {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
