"use client";
import api from "@/lib/axios";
import Image from "next/image";
import { useState, useEffect } from "react";

interface CarouselImage {
  _id: string;
  imageUrl: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  success: boolean;
  data: CarouselImage[];
}

export default function Slider() {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch carousel images from API
  const fetchCarouselImages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get("/carousel/getAllImages");
      const result: ApiResponse = await response.data;
      
      if (result.success && result.data) {
        const imageUrls = result.data.map((item) => item.imageUrl);
        setSlides(imageUrls);
      } else {
        setError("Failed to load carousel images");
      }
    } catch (err) {
      console.error("Error fetching carousel images:", err);
      setError("Error loading carousel images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  // Auto-slide effect - only run if there are 2 or more slides
  useEffect(() => {
    if (slides.length < 2) return;

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
    }, 3000);

    return () => clearInterval(interval);
  }, [direction, slides.length]);

  const nextSlide = () => {
    if (slides.length < 2) return;
    setDirection("forward");
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (slides.length < 2) return;
    setDirection("backward");
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Loading state
  if (loading) {
    return (
      <div className="relative w-full mx-auto overflow-hidden">
        <div className="lg:h-[600px] md:h-[450px] h-[300px] bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Loading carousel...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative w-full mx-auto overflow-hidden">
        <div className="lg:h-[600px] md:h-[450px] h-[300px] bg-gray-200 flex items-center justify-center">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  // Empty state
  if (slides.length === 0) {
    return (
      <div className="relative w-full mx-auto overflow-hidden">
        <div className="lg:h-[600px] md:h-[450px] h-[300px] bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">No carousel images available</div>
        </div>
      </div>
    );
  }

  // Single image state - no slider functionality
  if (slides.length === 1) {
    return (
      <div className="relative w-full mx-auto overflow-hidden">
        <div className="lg:h-[700px] md:h-[450px] h-[300px]  relative">
          <Image
            src={slides[0]}
            alt="Slide 1"
            fill
            className="object-fit"
            priority
          />
        </div>
      </div>
    );
  }

  // Multiple images state - with slider functionality
  return (
    <div 
      className="relative w-full mx-auto overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slider Wrapper */}
      <div
        className="flex transition-transform duration-500"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((src, index) => (
          <div
            key={index}
            className="min-w-full lg:h-[600px] md:h-[450px] h-[230px] relative"
          >
            <Image
              src={src}
              alt={`Slide ${index + 1}`}
              fill
              className=" md:object-fit "
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - Only show if there are 2 or more slides */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className={`absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-20 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 z-20 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Bubbles (Navigation) - Only show if there are 2 or more slides */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20 bg-transparent p-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`w-2 md:w-3  h-2 md:h-3 rounded-full border opacity-60 ${
                current === index ? "bg-[#C9A040]" : "bg-white"
              }`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}