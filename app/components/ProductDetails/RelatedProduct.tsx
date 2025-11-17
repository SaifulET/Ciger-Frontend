"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg";
import Image from "next/image";
import Leftarrow from "@/public/leftArrow.svg";
import { RelatedProduct } from "./product";
import { useProductsStore } from "../../store/productDetailsStore";
import ProductCard from "../Product/ProductCard";

interface Props {
  relatedProducts: RelatedProduct[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
 

}

export default function RelatedProducts({
  relatedProducts,
  currentIndex,
  setCurrentIndex,

}: Props) {
  const { loading } = useProductsStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
    watchDrag: true,
    skipSnaps: true,
  });

  const scrollbarRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [isDraggingCarousel, setIsDraggingCarousel] = useState(false);
  const [isUsingButtons, setIsUsingButtons] = useState(false);

  const handleAddCart = (id: string) => {
    console.log("Add to cart:", id);
  
  };

  const handleView = (id: string) => {
    console.log("View product:", id);
    // You can implement navigation to product detail page
  };

  const handlePrev = useCallback(() => {
    if (emblaApi) {
      setIsUsingButtons(true);
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) {
      setIsUsingButtons(true);
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const onScroll = useCallback(() => {
    if (!emblaApi || isDraggingThumb) return;
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()));
    setScrollProgress(progress);
  }, [emblaApi, isDraggingThumb]);

  const scrollToProgress = useCallback(
    (progress: number) => {
      if (!emblaApi) return;

      const engine = emblaApi.internalEngine();
      const { limit, location, target, offsetLocation, scrollBody, translate } = engine;

      const targetPosition = limit.max + (limit.min - limit.max) * progress;

      scrollBody.useDuration(0);
      scrollBody.useFriction(0);

      offsetLocation.set(targetPosition);
      location.set(targetPosition);
      target.set(targetPosition);
      translate.to(targetPosition);
      translate.toggleActive(true);
    },
    [emblaApi]
  );

  const getClientX = (
    event:
      | MouseEvent
      | TouchEvent
      | React.MouseEvent<HTMLDivElement>
      | React.TouchEvent<HTMLDivElement>
  ): number => {
    if ("touches" in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    return (event as MouseEvent).clientX;
  };

  const onThumbDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!scrollbarRef.current || !emblaApi) return;

      e.preventDefault();
      e.stopPropagation();
      setIsDraggingThumb(true);

      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const thumbWidth = scrollbarRect.width * 0.25;

      const updateProgress = (clientX: number) => {
        const offsetX = clientX - scrollbarRect.left - thumbWidth / 2;
        const maxOffset = scrollbarRect.width - thumbWidth;
        const newProgress = Math.max(0, Math.min(1, offsetX / maxOffset));

        setScrollProgress(newProgress);
        scrollToProgress(newProgress);
      };

      const onMove = (moveEvent: MouseEvent | TouchEvent) => {
        moveEvent.preventDefault();
        updateProgress(getClientX(moveEvent));
      };

      const onUp = () => {
        setIsDraggingThumb(false);

        if (emblaApi) {
          const engine = emblaApi.internalEngine();
          engine.scrollBody.useDuration(25);
          engine.scrollBody.useFriction(0.68);
        }

        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      };

      updateProgress(getClientX(e));

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onUp);
    },
    [emblaApi, scrollToProgress]
  );

  const onTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
      if (!scrollbarRef.current || !emblaApi) return;

      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const thumbWidth = scrollbarRect.width * 0.25;
      const clientX = getClientX(e);
      const offsetX = clientX - scrollbarRect.left - thumbWidth / 2;
      const maxOffset = scrollbarRect.width - thumbWidth;
      const newProgress = Math.max(0, Math.min(1, offsetX / maxOffset));

      setScrollProgress(newProgress);
      scrollToProgress(newProgress);
    },
    [emblaApi, scrollToProgress]
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onPointerDown = () => setIsDraggingCarousel(true);
    const onPointerUp = () => setIsDraggingCarousel(false);

    emblaApi.on("pointerDown", onPointerDown);
    emblaApi.on("pointerUp", onPointerUp);

    return () => {
      emblaApi.off("pointerDown", onPointerDown);
      emblaApi.off("pointerUp", onPointerUp);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSettle = () => setIsUsingButtons(false);
    emblaApi.on("settle", onSettle);
    
    return () => {
      emblaApi.off("settle", onSettle);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("settle", onScroll);

    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("settle", onScroll);
    };
  }, [emblaApi, onScroll]);

  if (loading.related && relatedProducts.length === 0) {
    return (
      <div className="pb-[16px] md:pb-[32px]">
        <div className="bg-white p-[16px] md:p-[32px] mt-[16px] md:mt-[32px] rounded-lg">
          <h2 className="text-[28px] font-semibold text-gray-900 pb-[16px] md:pb-[32px]">
            Products related to this item
          </h2>
          <div className="flex justify-center py-8">
            <div className="text-gray-500">Loading related products...</div>
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="pb-[16px] md:pb-[32px]">
      <div className="bg-white p-[16px] md:p-[32px] mt-[16px] md:mt-[32px] rounded-lg">
        <h2 className="text-[28px] font-semibold text-gray-900 pb-[16px] md:pb-[32px]">
          Products related to this item
        </h2>
        
        <div className="relative md:px-[64px]">
          {/* Carousel container */}
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            ref={emblaRef}
          >
            <div
              className="flex gap-4"
              style={{
                touchAction: "pan-y pinch-zoom",
              }}
            >
              {relatedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                >
                  <ProductCard
                    product={product}
                   
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
          >
            <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
          </button>
          <button
            onClick={handleNext}
            className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
          >
            <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
          </button>

          {/* Custom Scrollbar */}
          <div className="flex justify-center mt-6">
            <div
              ref={scrollbarRef}
              className="relative w-64 h-2 bg-gray-300 rounded-full overflow-visible cursor-pointer select-none"
              onClick={onTrackClick}
              onTouchStart={onTrackClick}
            >
              <div
                className={`absolute top-0 h-full bg-[#C9A040] rounded-full ${
                  isDraggingThumb ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{
                  width: "25%",
                  left: `${scrollProgress * 75}%`,
                  transition:
                    isDraggingThumb || isDraggingCarousel || isUsingButtons
                      ? "none"
                      : "left 100ms ease-out",
                }}
                onMouseDown={onThumbDrag}
                onTouchStart={onThumbDrag}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}