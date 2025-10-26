"use client";
import React, { useState, useEffect } from "react";
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
    <section className="bg-white py-10 mx-[10px] md:mx-[32px]">
      <div className="md:max-w-7xl md:mx-auto px-4 relative">
        {/* Header */}
        <div className="flex justify-center items-center mb-[76px]">
          <h2 className="text-[28px] md:text-[40px] font-bold text-gray-900 text-center">
            Featured Brand
          </h2>
        </div>

        {/* Carousel container */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex mb-[32px]">
            {products.map((product) => (
              <div
                key={product.id}
                className="
                  pl-4 flex justify-center flex-shrink-0
                  basis-1/2                
                  sm:basis-1/2
                  md:basis-1/3
                  lg:basis-1/4
                "
              >
                <Link
                  href={{
                    pathname: "/pages/product",
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
          className="absolute left-[-15px] md:left-[-50px] top-3/5 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-[-15px] md:right-[-50px] top-3/5 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
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
