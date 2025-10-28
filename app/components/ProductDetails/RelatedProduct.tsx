"use client";
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../universalComponents/Card";
import rightArrow from "@/public/rightArrow.svg";
import Image from "next/image";
import Leftarrow from "@/public/leftArrow.svg";
import productImg from "@/public/product.svg";
import Link from "next/link";
import { RelatedProduct } from "./product";

type Product = {
  id: number;
  brand: string;
  name: string;
  image: string;
  originalPrice: string;
  currentPrice: string;
  newBestSeller?: boolean;
  newSeller?: boolean;
};
interface Props {
  relatedProducts: RelatedProduct[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAddCart: (id: number) => void; // Add this prop
}

export default function RelatedProducts({
  relatedProducts,
  currentIndex,
  setCurrentIndex,
  onAddCart, // Destructure it
}: Props) {
 const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1, // move 1 card per click
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const products: Product[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    brand: `Brand ${i + 1}`,
    name: "Good Stuff Natural Pipe Tobacco - 16 oz. Bag",
    image: productImg,
    originalPrice: "19.97",
    currentPrice: "19.97",
    newBestSeller: false,
    newSeller: true,
  }));

  const handleAddCart = (id: number) => console.log("Add to cart:", id);
  const handleView = (id: number) => console.log("View product:", id);

  const handlePrev = () => emblaApi && emblaApi.scrollPrev();
  const handleNext = () => emblaApi && emblaApi.scrollNext();

  const barRef = useRef<HTMLDivElement>(null); // ✅ declared once here
     const [isDragging, setIsDragging] = useState(false);
   const handleMouseDown = (e: React.MouseEvent) => setIsDragging(true);
  
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !barRef.current) return;
  
      const rect = barRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clampedX = Math.max(0, Math.min(x, rect.width));
      const index = Math.round(
        (clampedX / rect.width) * (scrollSnaps.length - 1)
      );
  
      if (emblaApi) emblaApi.scrollTo(index);
    };
  
    const handleMouseUp = () => setIsDragging(false);
  
    useEffect(() => {
      if (isDragging) {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      } else {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      }
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging]);

  // 🔹 track scroll positions for bubble updates
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => {
      setScrollSnaps(emblaApi.scrollSnapList());
    });
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);
  return (
    <div className="mb-12 bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Products related to this item
      </h2>
     <div className="max-w-7xl mx-auto px-4 relative">
        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  pl-4 flex-shrink-0 
                  basis-1/2        /* ✅ show 2 cards per slide on mobile */
                  sm:basis-1/2
                  md:basis-1/3     /* ✅ 3 per row on medium screens */
                  lg:basis-1/4     /* ✅ 4 per row on large screens */
                "
              >
                <ProductCard
                  product={product}
                  onAddCart={handleAddCart}
                  onView={handleView}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className=" hidden absolute left-[-5px] md:left-[-50px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-[-5px] md:right-[-50px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

        {/* Pagination Bubbles */}
             <div className="flex justify-center mt-6">
          <div
            className="flex items-center gap-0 bg-gray-300 rounded-full h-1 relative overflow-hidden"
            ref={barRef}
          >
            {scrollSnaps.map((_, i) => (
              <div
                key={i}
                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                className={`h-1 cursor-pointer transition-all duration-300
                  ${i === 0 ? "rounded-l-full" : ""}
                  ${i === scrollSnaps.length - 1 ? "rounded-r-full" : ""}
                  ${
                    i === selectedIndex
                      ? "bg-[#C9A040] w-12"
                      : "bg-transparent w-8"
                  }
                `}
              />
            ))}

            {/* draggable golden overlay */}
            <div
              className="absolute top-0 h-1 bg-[#C9A040] rounded-full cursor-grab active:cursor-grabbing transition-all duration-100"
              style={{
                width: `${100 / scrollSnaps.length}%`,
                left: `${(selectedIndex / scrollSnaps.length) * 100}%`,
              }}
              onMouseDown={handleMouseDown}
            />
          </div>
        </div>
      </div>
    </div>
  );
}