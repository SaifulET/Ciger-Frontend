"use client";
import React, { useState, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg"
import Image, { StaticImageData } from "next/image";
import Leftarrow from "@/public/leftArrow.svg"
import BlogCard from "../universalComponents/BlogCard";
import blogImg from "@/public/blog.jpg"
type Product = {
  id: number;
  description: string;
  title: string;
  image: StaticImageData;
 link:string;
};

export default function BlogCarousal() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1, // ✅ move 1 card per click
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const products: Product[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    title: `Brand ${i + 1}`,
    description: "Good Stuff Natural Pipe Tobacco - 16 oz. Bag",
    image:blogImg, // Placeholder image URL
    link:"/pages/blog/123"
  }));

  

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
    <section className="bg-white  p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg ">
      <div className="  relative ">
        {/* Header */}
        <div className="flex justify-center items-center pb-[32px]">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Blog Preview</h2>
        
        </div>

        {/* Carousel container */}
        <div className="overflow-hidden md:mx-[62px] " ref={emblaRef}>
          <div className="flex ">
            {products.map((product) => (
              <div
                key={product.id}
                className="md:pl-5 basis-full sm:basis-full md:basis-1/2 lg:basis-1/3 xl:basis-1/3 flex-shrink-0"
              >
                <BlogCard
                  product={product}
                  
                  
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden absolute left-0  top-1/2 -translate-y-1/2 bg-white  w-12 h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100  transition"
        >
          <Image src={Leftarrow} width={12}height={12}alt="rightArrow"/>
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white  w-12 h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100  transition"
        >
          <Image src={rightArrow} width={12}height={12}alt="rightArrow"/>
        </button>

        {/* 🔸 Pagination Bubbles */}
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
 