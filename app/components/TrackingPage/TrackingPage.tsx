"use client";

import { useState, useEffect } from 'react';
import { TrackingData } from './types';
import useUserStore from '@/app/store/userStore';
import api from '@/lib/axios';
  import Cookies from "js-cookie";
import {useRouter} from "next/navigation"


interface ApiOrder {
  _id: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  orderId: string;
  orderid: string;
  trackingNo: string;
  state: string;
  userId: string;
  isNextUsePayment: boolean;
 
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: ApiOrder[];
}

export default function TrackingPage() {
   const router = useRouter()
  useEffect(()=>{
    Cookies.get("token")?"":router.push("/pages")
  },[Cookies.get("token")])
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(null);
  const [userOrders, setUserOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user from your user store (replace with your actual implementation)
  const { user } = useUserStore();
  // const user = { _id: "6910d2b9dd62bf34bc36652b" }; // Mock user for demonstration

  // Fetch user orders when component mounts
  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/order/userOrder/${user}`);
        const result: ApiResponse = await response.data;
        
        if (result.success && result.data) {
          console.log(result)
          setUserOrders(result.data);
        } else {
          setError('Failed to fetch orders');
        }
      } catch (err) {
        setError('Error fetching orders');
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const handleSearch = () => {
    if (trackingInput.trim()) {
      // Search in the API data for matching orderId or trackingNo
      const foundOrder = userOrders.find(order => 
        order.orderid === trackingInput.trim() || 
        order.trackingNo === trackingInput.trim()
      );

      if (foundOrder) {
        // Map API data to TrackingData type
        const mappedResult: TrackingData = {
          orderId: foundOrder.orderId,
          trackingNumber: foundOrder.trackingNo,
          status: mapOrderStateToStatus(foundOrder.state)
        };
        setTrackingResult(mappedResult);
      } else {
        setTrackingResult(null);
        setError('No order found with the provided tracking number or order ID');
      }
    } else {
      setTrackingResult(null);
      setError('Please enter a tracking number or order ID');
    }
  };

  // Helper function to map API state to your status
  const mapOrderStateToStatus = (state: string): string => {
    const statusMap: { [key: string]: string } = {
      'processing': 'Processing',
      'shipped': 'Shipped',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'pending': 'Pending'
    };
    
    return statusMap[state] || state;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
      <div className="">
        {/* Header */}
        <h1 className="font-montserrat font-semibold text-[28px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal p-[16px] md:p-[32px] mb-[16px] md:mb-[32px] bg-white text-center rounded-lg">
          Tracking Number
        </h1>

        {/* Search Card */}
        <div className="bg-gray-50 rounded-lg p-[16px] md:p-[32px]">
          <label className="block font-semibold text-base leading-6 mb-3">
            Tracking Number or Order ID
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter tracking number or order ID"
                value={trackingInput}
                onChange={(e) => {
                  setTrackingInput(e.target.value);
                  setError(null); // Clear error when user starts typing
                }}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#C9A040] hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-8 transition rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Get'}
            </button>
          </div>
          
          {/* Error Message */}
          {error && (
            <div className="mt-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p>Loading your orders...</p>
          </div>
        )}

        {/* Result Card */}
        {trackingResult && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 mt-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-8">
              <div>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px] mb-8">
                  Order ID: {trackingResult.orderId}
                </p>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px]">
                  Order Status: {trackingResult.status}
                </p>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px]">
                  Tracking Number: {trackingResult.trackingNumber || 'Not assigned yet'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}