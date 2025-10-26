"use client";

import { useState } from 'react';
import { mockData } from './data';
import { TrackingData } from './types';

export default function TrackingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResult, setTrackingResult] = useState<TrackingData | null>(null);

  const handleSearch = () => {
    if (trackingInput.trim()) {
      const result = mockData[trackingInput];
      setTrackingResult(result || null);
    } else {
      setTrackingResult(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="min-h-screen  py-8 px-4">
      <div className="">
        {/* Header */}
        <h1 className="font-montserrat font-semibold text-2xl sm:text-3xl md:text-[40px] leading-8 sm:leading-10 md:leading-[48px] tracking-normal mb-4 md:mb-8 bg-white text-center rounded-lg py-2 sm:py-3 md:py-4">Tracking Number</h1>

        {/* Search Card */}
        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <label className="block font-semibold text-base leading-6 mb-3">
            Tracking Number
          </label>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Enter number"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded text-gray-900 placeholder-gray-500 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-8 rounded transition"
            >
              Get
            </button>
          </div>
        </div>

        {/* Result Card */}
        {trackingResult && (
          <div className="bg-white border border-gray-200 rounded-lg p-8">
            <div className="flex flex-col  md:flex-row md:justify-between gap-8">
              <div className=''>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px] mb-8">
                  Order ID: {trackingResult.orderId}
                </p>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px]">
                  Order Status: {trackingResult.status}
                </p>
              </div>
              <div>
                <p className="font-montserrat font-semibold text-[18px] leading-[26px]">
                  Tracking Number: {trackingResult.trackingNumber}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
