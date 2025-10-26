"use client";
import React, { useEffect, useState } from "react";
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
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-md z-10"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition shadow-md z-10"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </button>
          </>
        )}

        {/* Pagination Bubbles */}
        {canScroll && scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi && emblaApi.scrollTo(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === selectedIndex
                    ? "bg-[#C9A040] scale-110"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
