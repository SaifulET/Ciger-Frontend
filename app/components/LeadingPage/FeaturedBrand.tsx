"use client";
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg";
import Image from "next/image";
import Leftarrow from "@/public/leftArrow.svg";
import brandImage from "@/public/brand.png";
import Link from "next/link";

export default function ProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const products = [
    { id: 1, image: brandImage, name: "brand1" },
    { id: 2, image: brandImage, name: "brand2" },
    { id: 3, image: brandImage, name: "brand3" },
    { id: 4, image: brandImage, name: "brand4" },
    { id: 5, image: brandImage, name: "brand5" },
    { id: 6, image: brandImage, name: "brand6" },
    { id: 7, image: brandImage, name: "brand7" },
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

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

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", () => setScrollSnaps(emblaApi.scrollSnapList()));
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <section className="bg-white mt-[16px] md:mt-[32px]   mx-[16px] md:mx-[32px] rounded-lg">
      <div className="p-[32px] relative">
        {/* Header */}
        <div className="flex justify-center items-center pb-[32px]">
          <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900 text-center">
            Featured Brand
          </h2>
        </div>

        {/* Carousel container */}
        <div className="overflow-hidden " ref={emblaRef}>
          <div className="flex mb-[32px]">
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  px-2 flex justify-center flex-shrink-0
                  basis-1/2                
                  sm:basis-1/2
                  md:basis-1/3
                  lg:basis-1/4
                "
              >
                <Link
                  href={{
                    pathname: "/pages/products",
                    query: { brand: "Camel" },
                  }}
                  className="block bg-white duration-300"
                >
                  <div className="mb-16">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={256}
                      height={180}
                    />
                  </div>
                  <div className="flex justify-center text-center font-montserrat text-[20px] md:text-[28px] font-semibold leading-[28px] md:leading-[36px]">
                    {product.name}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden absolute left-[-15px] md:left-[32px] top-3/5 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-[-15px] md:right-[32px] top-3/5 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition"
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
                      : "bg-transparent w-12"
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
