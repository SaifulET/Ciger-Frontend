"use client";
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../universalComponents/Card";
import Image from "next/image";
import rightArrow from "@/public/rightArrow.svg";
import Leftarrow from "@/public/leftArrow.svg";
import productImg from "@/public/product.svg";
import Link from "next/link";

type Product = {
  id: number;
  brand: string;
  name: string;
  image: string;
  originalPrice: string;
  currentPrice: string;
  newBestSeller?: boolean;
};

export default function BestSeller() {
  const [slidesToScroll, setSlidesToScroll] = useState(1);

  // 🔹 Detect screen width for responsive slidesToScroll
  useEffect(() => {
    const updateSlidesToScroll = () => {
      if (window.innerWidth < 640) setSlidesToScroll(2); // mobile → 2 per swipe
      else setSlidesToScroll(1); // tablet/desktop → 1 per swipe
    };
    updateSlidesToScroll();
    window.addEventListener("resize", updateSlidesToScroll);
    return () => window.removeEventListener("resize", updateSlidesToScroll);
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: slidesToScroll,
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
    newBestSeller: true,
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
    emblaApi.on("reInit", () => setScrollSnaps(emblaApi.scrollSnapList()));
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-white p-[16px] md:p-[32px]  mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
      <div className="flex justify-between pb-[32px] items-center ">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Best Seller
        </h2>
        <Link
          href={{
            pathname: "/pages/products",
            query: { best: true },
          }}
        >
          <button className="text-gray-800 font-medium hover:text-yellow-600">
            View All
          </button>
        </Link>
      </div>

      <div className="  relative md:px-[64px]">
        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex ">
            {products.map((product) => (
              <div
                key={product.id}
                className="pl-4 basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex-shrink-0"
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
          className=" hidden absolute left-[0px] top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-[0px] top-1/2 -translate-y-1/2 bg-white w-12 h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

        {/* Pagination Dots */}
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
    </section>
  );
}
