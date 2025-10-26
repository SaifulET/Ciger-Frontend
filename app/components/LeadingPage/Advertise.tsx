"use client";

import React from "react";

function Advertise() {
  return (
    <div className="overflow-hidden whitespace-nowrap relative w-full flex items-center py-[4px]">
      <div className="animate-marquee flex">
        {/* Duplicate the text for seamless scrolling */}
        <span className="mx-4">Advertising Text</span>
        <span className="mx-4">Advertising Text</span>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(600%); } 
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Advertise;
