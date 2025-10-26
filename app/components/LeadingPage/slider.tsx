"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

const slides = [
  "/slider.png",
  "/slider.png",
  "/slider.png",
  "/slider.png",
];

export default function Slider() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        if (direction === "forward") {
          if (prev === slides.length - 1) {
            setDirection("backward");
            return prev - 1;
          }
          return prev + 1;
        } else {
          if (prev === 0) {
            setDirection("forward");
            return prev + 1;
          }
          return prev - 1;
        }
      });
    }, 3000); // 2 seconds

    return () => clearInterval(interval);
  }, [direction]);

  return (
    <div className="relative w-full mx-auto overflow-hidden rounded-lg">
      {/* Slider Wrapper */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div
            key={index}
            className="min-w-full lg:h-[600px] md:h-[450px] h-[300px] relative"
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}
      </div>

      {/* Bubbles (Navigation) */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-transparent p-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full border ${
              current === index ? "bg-[#C9A040]" : "bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
