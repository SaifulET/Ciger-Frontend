"use client";
import React from "react";
import DualRangeBar from "./Pricerange";

interface FilterPriceRangeProps {
  minPrice: number;
  maxPrice: number;
  priceRange: [number, number];
  onChange: (val: [number, number]) => void;
  open: boolean;
  toggleOpen: () => void;
}

const FilterPriceRange: React.FC<FilterPriceRangeProps> = ({
  minPrice,
  maxPrice,
  priceRange,
  onChange,
  open,
  toggleOpen,
}) => {
  return (
    <div className="pb-2">
      <button
        onClick={toggleOpen}
        className="w-full flex justify-between items-center bg-gray-100 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
      >
        <span className="font-sans text-base font-semibold leading-6">
          Price: ${priceRange[0]} – ${priceRange[1]}
        </span>
        <span className="text-xl">{open ? "-" : "+"}</span>
      </button>

      {/* The range bar only visible when expanded */}
      {open && (
        <div className=" mt-2 px-4">
          <DualRangeBar
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};

export default FilterPriceRange;
