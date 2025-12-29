"use client";
import { useState, useEffect } from "react";

interface DualRangeBarProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

export default function DualRangeBar({ min, max, value, onChange }: DualRangeBarProps) {
  const [minVal, setMinVal] = useState(value[0]);
  const [maxVal, setMaxVal] = useState(value[1]);

  useEffect(() => {
    setMinVal(value[0]);
    setMaxVal(value[1]);
  }, [value]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (newVal <= maxVal - 1) {
      setMinVal(newVal);
      onChange([newVal, maxVal]);
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(e.target.value);
    if (newVal >= minVal + 1) {
      setMaxVal(newVal);
      onChange([minVal, newVal]);
    }
  };

  const getPercent = (value: number) => ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full py-4 px-1 sm:px-2">
      <div className="relative w-full">
        {/* Track */}
        <div
          className="relative h-[6px] bg-gray-200 rounded-md mb-6"
          style={{
            position: "relative",
          }}
        >
          <div
            className="absolute top-0 h-[6px] bg-[#C9A040] rounded-md"
            style={{
              left: `${getPercent(minVal)}%`,
              right: `${100 - getPercent(maxVal)}%`,
            }}
          />
        </div>

        {/* Min Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full h-8 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C9A040]
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{ zIndex: minVal > max - (max - min) / 2 ? 6 : 5 }}
        />

        {/* Max Thumb */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full h-8 top-1/2 -translate-y-1/2 appearance-none bg-transparent pointer-events-none
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[#C9A040]
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:pointer-events-auto"
          style={{ zIndex: maxVal < min + (max - min) / 2 ? 5 : 6 }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-700">
        <span className="font-medium">${Math.round(minVal)}</span>
        <span className="font-medium">${Math.round(maxVal)}</span>
      </div>
    </div>
  );
}
