"use client";
import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg"
import Image from "next/image";
import Leftarrow from "@/public/leftArrow.svg"
import BlogCard from "../universalComponents/BlogCard";
import blogImg from "@/public/blog.svg"
type Product = {
  id: number;
  description: string;
  title: string;
  image: string;
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
    <section className="bg-white py-10 md:mx-[32px]">
      <div className="md:max-w-7xl md:mx-auto px-4 relative">
        {/* Header */}
        <div className="flex justify-center items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Blog Preview</h2>
        
        </div>

        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="pl-4 basis-1/2 sm:basis-1/2 lg:basis-1/3 xl:basis-1/3 flex-shrink-0"
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
          className="absolute left-[-5px] md:left-[-50px] top-1/2 -translate-y-1/2 bg-white  w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100  transition"
        >
          <Image src={Leftarrow} width={12}height={12}alt="rightArrow"/>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[-5px] md:right-[-50px] top-1/2 -translate-y-1/2 bg-white  w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-100  transition"
        >
          <Image src={rightArrow} width={12}height={12}alt="rightArrow"/>
        </button>

        {/* 🔸 Pagination Bubbles */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi && emblaApi.scrollTo(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === selectedIndex
                  ? "bg-[#C9A040] scale-110"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
 