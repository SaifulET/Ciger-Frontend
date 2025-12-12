"use client";

import { Check, X, Clock, Truck } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { Notification } from './types';
import api from '@/lib/axios';
import useUserStore from '@/app/store/userStore';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { AxiosError } from 'axios';

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

interface ApiErrorResponse {
  message?: string;
  error?: string;
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

// Debug component for mobile testing
const MobileDebugPanel = () => {
  const { user, isLoggedIn, userInfo } = useUserStore();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 text-xs z-50 border-t border-gray-700">
      <div className="grid grid-cols-2 gap-1">
        <div>User ID: <span className={user ? "text-green-400" : "text-red-400"}>{user || "empty"}</span></div>
        <div>Logged In: <span className={isLoggedIn ? "text-green-400" : "text-red-400"}>{isLoggedIn ? "yes" : "no"}</span></div>
        <div>Token: <span className={Cookies.get("token") ? "text-green-400" : "text-red-400"}>{Cookies.get("token") ? "present" : "missing"}</span></div>
        <div>User Info: <span className={userInfo ? "text-green-400" : "text-red-400"}>{userInfo ? "loaded" : "null"}</span></div>
      </div>
    </div>
  );
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRehydrated, setIsRehydrated] = useState(false);
  
  const { user, isLoggedIn } = useUserStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Listen for Zustand rehydration completion
  useEffect(() => {
    const unsubscribe = useUserStore.persist.onFinishHydration(() => {
      console.log("Zustand rehydration complete");
      setIsRehydrated(true);
    });
    
    // Also set rehydrated if already hydrated
    if (useUserStore.persist.hasHydrated()) {
      setIsRehydrated(true);
    }
    
    return () => unsubscribe();
  }, []);

  // Check authentication after rehydration
  useEffect(() => {
    if (isRehydrated) {
      const token = Cookies.get("token");
      console.log("Auth check:", { token, isLoggedIn, user, isRehydrated });
      
      if (!token || !isLoggedIn) {
        console.log("Redirecting to login - no token or not logged in");
        router.push("/pages");
      }
    }
  }, [isRehydrated, isLoggedIn, user, router]);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      // Wait for Zustand to rehydrate
      if (!isRehydrated) {
        console.log("Waiting for Zustand rehydration...");
        return;
      }

      // Check if user is available
      if (!user) {
        console.error("User ID not available after rehydration");
        setError("User session not found. Please login again.");
        setLoading(false);
        
        // Try to redirect after a delay
        setTimeout(() => {
          if (!Cookies.get("token")) {
            router.push("/pages");
          }
        }, 2000);
        return;
      }

      // Check network connectivity
      if (!navigator.onLine) {
        setError("You are offline. Please check your internet connection.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching notifications for user ID:", user);
        
        // Create abort controller for timeout
        abortControllerRef.current = new AbortController();
        const timeoutId = setTimeout(() => {
          if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
        }, 15000); // 15 second timeout for mobile
        
        const response = await api.get<ApiResponse>(
          `/notification/getNotifications/${user}`,
          { signal: abortControllerRef.current.signal }
        );
        
        clearTimeout(timeoutId);

        console.log("API Response received:", response.status);
        
        if (!response.data) {
          throw new Error('Failed to fetch notifications: No data received');
        }

        const result = response.data;
        console.log("API Data:", result);
        
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
          console.log("Notifications loaded:", transformedNotifications.length);
        } else {
          console.warn("Unexpected API response format:", result);
          setNotifications([]);
        }
      } catch (err: unknown) {
        // Clear any pending timeout
        if (err instanceof Error && err.name === 'AbortError') {
          console.log("Request aborted due to timeout");
        }
        
        console.error("Full fetch error:", {
          error: err,
          user: user,
          endpoint: `/notification/getNotifications/${user}`,
          timestamp: new Date().toISOString(),
          online: navigator.onLine
        });
        
        let errorMessage = 'An error occurred while fetching notifications';
        
        if (err instanceof DOMException && err.name === 'AbortError') {
          errorMessage = 'Request timeout. Please check your internet connection and try again.';
        } else if (err instanceof AxiosError) {
          // Axios error (HTTP error)
          const axiosError = err as AxiosError<ApiErrorResponse>;
          if (axiosError.response) {
            errorMessage = axiosError.response.data?.message || 
                          axiosError.response.data?.error || 
                          `Server error: ${axiosError.response.status}`;
          } else if (axiosError.request) {
            errorMessage = 'Network error. Please check your connection.';
          } else {
            errorMessage = axiosError.message || errorMessage;
          }
        } else if (err instanceof Error) {
          // Generic JavaScript error
          errorMessage = err.message;
        }
        
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user, isRehydrated, router]);

  // Show loading while waiting for rehydration
  if (!isRehydrated) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading notifications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-[16px] md:p-[32px]">
        <h1 className="font-montserrat font-semibold text-[28px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal bg-white text-center rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Notifications
        </h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-600 font-medium mb-2">Error loading notifications</p>
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <button 
              onClick={() => router.push("/pages")}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
        {/* Uncomment for debugging: */}
        {/* <MobileDebugPanel /> */}
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
          <div className="text-gray-400 mb-4">
            <Truck className="w-16 h-16 mx-auto opacity-50" />
          </div>
          <p className="text-gray-600 text-lg mb-2">No notifications yet</p>
          <p className="text-gray-400 text-sm">When you have order updates, they'll appear here</p>
        </div>
        {/* Uncomment for debugging: */}
        {/* <MobileDebugPanel /> */}
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
                } p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg transition-all hover:shadow-md`}
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
      {/* Uncomment for debugging: */}
      {/* <MobileDebugPanel /> */}
    </div>
  );
}