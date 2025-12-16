"use client";

import api from "@/lib/axios";
import React, { useState, useEffect } from "react";

function Advertise() {
  const [advertisingText, setAdvertisingText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisingText = async () => {
      try {
        const response = await api.get("/servicePricing/getServicePricing");
        const data = await response.data;

        if (data.success && data.data.AdvertisingText) {
          setAdvertisingText(data.data.AdvertisingText);
        }
      } catch (error) {
       
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisingText();
  }, []);

  // Show nothing while loading or if no text is available
  if (loading || !advertisingText) {
    return null;
  }

  return (
    <div className="overflow-hidden whitespace-nowrap relative w-full flex items-center py-[4px]">
      <div className="animate-marquee flex">
        {/* Duplicate the text for seamless scrolling */}
        <span className="mx-4">{advertisingText}</span>
        {/* <span className="mx-4 ">{advertisingText}</span> */}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 18s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Advertise;
