"use client";
import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard from "../universalComponents/Card";
import rightArrow from "@/public/rightArrow.svg";
import Image from "next/image";
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

export default function Discount() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1, // ✅ move 1 card per click
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
  }));

  const handleAddCart = (id: number) => console.log("Add to cart:", id);
  const handleView = (id: number) => console.log("View product:", id);

  const handlePrev = () => emblaApi && emblaApi.scrollPrev();
  const handleNext = () => emblaApi && emblaApi.scrollNext();

  // 🔹 Track scroll positions for bubble updates
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
    <section className="bg-white py-10 md:mx-[32px]">
      {/* Header */}
      <div className="flex justify-between px-6 md:px-12 lg:px-32 items-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
          Discount
        </h2>
        <Link
          href={{
            pathname: "/pages/product",
            query: { discount: true },
          }}
        >
          <button className="text-gray-800 font-medium hover:text-yellow-600">
            View All
          </button>
        </Link>
      </div>

      <div className="md:max-w-7xl md:mx-auto px-2 md:px-4 relative">
        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  md:pl-4 flex-shrink-0 
                  basis-1/2        /* ✅ 2 cards per slide on mobile */
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
          className="absolute left-[-5px] md:left-[-50px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[-5px] md:right-[-50px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

        {/* Pagination Bubbles */}
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
