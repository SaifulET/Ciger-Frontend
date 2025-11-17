"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import OrderCard, { Order } from './OrderCard';
import { useOrderStore, OrderStatus } from '@/app/store/orderStore';
import useUserStore from "@/app/store/userStore";


export default function OrderHistoryPage() {
  const [searchId, setSearchId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { orders, loading, error, fetchOrders } = useOrderStore();
  const {user }  = useUserStore()

  useEffect(() => {
   
    const asb=fetchOrders(user);
    console.log(asb)

  }, [fetchOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchId.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchId, statusFilter]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen p-[16px] md:p-[32px] flex items-center justify-center">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-[16px] md:p-[32px] flex items-center justify-center">
        <div className="text-center text-red-500">Error: {error}</div>
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

        {filteredOrders.length === 0 && !loading && (
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