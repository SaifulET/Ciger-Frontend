"use client"
import React, { useState } from 'react';
import { CheckCircle, ChevronRight } from 'lucide-react';

const OrderConfirmation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const orderData = {
    orderNumber: 'TP-1158',
    orderDate: 'September 25',
    deliveryAddress: '43, Moakhali, Dhaka 1212, Bangladesh',
    finalAmount: '$ 450',
    email: 'example@gmail.com',
    password: '123456'
  };

  const handleOrderHistory = () => {
    window.location.href = '/pages/orderhistory';
  };

  const handleWebsite = () => {
    window.location.href = '/pages';
  };

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 lg:my-16">
        <div className=" bg-white rounded-lg shadow-sm p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              Your order is confirmed!
            </h1>
            <p className="text-gray-600">Thank you for choosing Smokenza</p>
          </div>

          {/* Booking Details */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Order number</span>
                <span className="font-medium text-gray-900">{orderData.orderNumber}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Order date</span>
                <span className="font-medium text-gray-900">{orderData.orderDate}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Delivery address</span>
                <span className="font-medium text-gray-900 text-right">{orderData.deliveryAddress}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-gray-600">Final paid amount</span>
                <span className="font-medium text-gray-900">{orderData.finalAmount}</span>
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Note:</span> You can cancel your order when the status pill is still on processing, after status pill change into shipped you can not cancel the order. If your order has been shipped then you can not cancel / After cancellation please do contact our team via email or you can call to our support number. We will guide you how to get your money back.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleOrderHistory}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Order History
            </button>
            <button
              onClick={handleWebsite}
              className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not Logged In View
  return (
    <div className="min-h-screen bg-gray-50 py-8  px-4 sm:px-6 lg:px-8">
      <div className=" bg-white rounded-lg shadow-sm p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            Your order is confirmed!
          </h1>
          <p className="text-gray-600">Thank you for choosing Smokenza</p>
        </div>

        {/* Booking Details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Order number</span>
              <span className="font-medium text-gray-900">{orderData.orderNumber}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Order date</span>
              <span className="font-medium text-gray-900">{orderData.orderDate}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600">Delivery address</span>
              <span className="font-medium text-gray-900 text-right">{orderData.deliveryAddress}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600">Final paid amount</span>
              <span className="font-medium text-gray-900">{orderData.finalAmount}</span>
            </div>
          </div>
        </div>

        {/* Login Information */}
        <div className="mb-8 bg-gray-50 rounded-lg p-4 sm:p-6">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="text-red-500 mr-2">*</span> Login Information
          </h3>
          <p className="text-sm text-gray-700">
            Since you have not sign up to our website but purchase our product. We will sign up for you, your email is same as you provided{' '}
            <span className="font-semibold">{orderData.email}</span>, and the password is{' '}
            <span className="font-semibold">{orderData.password}</span>. Now you can login to our system and check your order history, track your product etc.
          </p>
        </div>

        {/* Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> You can cancel your order when the status pill is still on processing, after status pill change into shipped you can not cancel the order. If your order has been shipped then you can not cancel / After cancellation please do contact our team via email or you can call to our support number. We will guide you how to get your money back.
          </p>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleOrderHistory}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Go to Order History
          </button>
          <button
            onClick={handleWebsite}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold py-3 px-4 rounded-lg transition duration-200"
          >
            Website
          </button>
        </div>
      </div>

      {/* Demo Toggle Button */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <button
          onClick={() => setIsLoggedIn(!isLoggedIn)}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-900 text-white font-semibold rounded-lg transition duration-200"
        >
          Toggle {isLoggedIn ? 'Not Logged In' : 'Logged In'} View
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;