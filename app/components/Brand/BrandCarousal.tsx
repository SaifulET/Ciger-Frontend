"use client";
import React, { useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import BrandCard, { Brand } from "./BrandCard";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function BrandCarousel({
  items,
  title,
}: {
  items: Brand[];
  title: string;
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScroll, setCanScroll] = useState(false);
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

  const handlePrev = () => emblaApi && emblaApi.scrollPrev();
  const handleNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList());
      setCanScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    setCanScroll(emblaApi.canScrollNext() || emblaApi.canScrollPrev());

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onReInit);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi]);

  if (items.length < 1) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="relative">
        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-2">
            {items.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {canScroll && (
          <>
            <button
              onClick={handlePrev}
              className="hidden absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white w-10 h-10 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-md z-10"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </button>
            <button
              onClick={handleNext}
              className="hidden absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white w-10 h-10 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-md z-10"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </button>
          </>
        )}

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
