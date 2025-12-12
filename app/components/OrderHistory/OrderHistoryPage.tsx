"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import OrderCard, { Order } from './OrderCard';
import { useOrderStore } from '@/app/store/orderStore';
import useUserStore from "@/app/store/userStore";
import Cookies from "js-cookie";
import {useRouter} from "next/navigation"
export default function OrderHistoryPage() {
  const router = useRouter()
  useEffect(()=>{
    Cookies.get("token")?"":router.push("/pages")
  },[Cookies.get("token")])
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { orders, ordersLoading, ordersError, fetchAllOrders,fetchOrderByUserId } = useOrderStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user) {
      fetchOrderByUserId(user);
    }
  }, [fetchAllOrders, user]);

  // Transform store data to component format
  const transformedOrders: Order[] = useMemo(() => {
    console.log(orders,ordersLoading,"dk")
    if (!orders || orders.length === 0) return [];
    
    return orders.map((apiOrder) => ({
      id: apiOrder._id,
      orderid: apiOrder.orderid,
      status: apiOrder.state,
      placedDate: new Date(apiOrder.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      trackingNo: apiOrder.trackingNo,
      items: apiOrder.carts.map((cartItem, index) => ({
        id: cartItem._id || `item-${index}`,
        name: cartItem.productId.name,
        unitPrice: cartItem.productId.price,
        quantity: cartItem.quantity,
        image: cartItem.productId.images?.[0] || "/api/placeholder/50/50"
      })),
      tax: apiOrder.tax,
      discount: apiOrder.discount,
      shippingCost: apiOrder.shippingCost,
      subTotal: apiOrder.subtotal,
      paymentAmount: apiOrder.total,
      paid: true // Assuming all orders from store are paid
    }));
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return transformedOrders.filter((order) => {
      const matchesSearch = order.orderid.toLowerCase().includes(searchId.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [transformedOrders, searchId, statusFilter]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (ordersLoading) {
    return (
      <div className="min-h-screen p-[16px] md:p-[32px] flex items-center justify-center">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (ordersError) {
    return (
      <div className="min-h-screen p-[16px] md:p-[32px] flex items-center justify-center">
        <div className="text-center text-red-500">Error: {ordersError}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
      <div className="">
        <h1 className="bg-white rounded-lg font-montserrat font-semibold text-[28px] leading-[48px] tracking-normal text-center mb-[16px] md:mb-[32px] p-[16px] md:p-[32px]">
          Order History
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:gap-4 gap-[16px] p-[16px] md:p-[32px] bg-white rounded-lg">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded text-sm"
            />
          </div>

          <div className="w-full md:w-64 relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none w-full px-4 py-2 pr-10 bg-gray-100 border border-gray-300 rounded text-sm cursor-pointer"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 text-gray-400 pointer-events-none" size={18} />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6 mt-[16px] md:mt-[32px]">
          {paginatedOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <OrderCard order={order} />
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && !ordersLoading && (
          <div className="text-center text-gray-600 mt-8">
            <p>No orders found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-[16px] md:mt-[32px]">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'<'}
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded text-sm font-medium ${
                  currentPage === page
                    ? 'bg-amber-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {'>'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}