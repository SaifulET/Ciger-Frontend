"use client";

import { Check, X, Clock, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Notification } from './types';
import api from '@/lib/axios';
import useUserStore from '@/app/store/userStore';
  import Cookies from "js-cookie";
import {useRouter} from "next/navigation"

interface ApiNotification {
  _id: string;
  userId: string;
  userName: string;
  orderId: string;
  status: 'placed' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
  message: string;
  isRead: boolean;
  createdAt: string;
  timestamp?: string;
}

interface ApiResponse {
  success: boolean;
  data: ApiNotification[];
}

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



  const router = useRouter()
  useEffect(()=>{
    Cookies.get("token")?"":router.push("/pages")
  },[Cookies.get("token")])
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {user} = useUserStore()

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get<ApiResponse>(`/notification/getNotifications/${user}`);

        if (!response.data) {
          throw new Error('Failed to fetch notifications: No data received');
        }

        const result = response.data;
        
        if (result.success && Array.isArray(result.data)) {
          const transformedNotifications: Notification[] = result.data.map((item: ApiNotification) => ({
            id: item._id,
            userId: item.userId,
            userName: item.userName,
            orderId: item.orderId,
            status: item.status,
            message: item.message,
            timestamp: new Date(item.createdAt || item.timestamp || '').toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            isRead: item.isRead
          }));
          
          setNotifications(transformedNotifications);
        } else {
          setNotifications([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user]);

  if (loading) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <h1 className="font-montserrat font-semibold text-[28px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal bg-white text-center rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Notifications
        </h1>
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-gray-600">No notifications found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-[16px] md:p-[32px]">
      <div className="">
        <h1 className="font-montserrat font-semibold text-[28px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal bg-white text-center rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Notifications
        </h1>

        <div className="space-y-4 bg-white rounded-lg p-[16px] md:p-[32px]">
          {notifications.map((notification) => {
            const { icon, bgColor, iconColor } = getIconAndColors(notification.status);

            return (
              <div
                key={notification.id}
                className={`bg-white border ${
                  notification.isRead ? 'border-gray-200' : 'border-blue-300 bg-blue-50'
                } p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg`}
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
                  {!notification.isRead && (
                    <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}