"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
      const { limit, location, target, offsetLocation, scrollBody, translate } =
        engine;

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

  // ✅ Type-safe unified handler for mouse + touch
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
    // @ts-expect-error - clientX exists on MouseEvent
    return event.clientX;
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

  // ✅ Fixed useEffect hooks
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

  return (
    <section className="bg-white p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
      <div className="flex pb-[32px] items-center">
        <h2 className="text-2xl flex-1 md:text-3xl font-bold text-gray-900 flex justify-center pl-[50px]">
          <span>Best Seller</span>
        </h2>
        <Link
          href={{
            pathname: "/pages/products",
            query: { best: true },
          }}
        >
          <button className="text-gray-800 text-[12px] hover:text-yellow-600">
            View All
          </button>
        </Link>
      </div>

      <div className="relative md:px-[64px]">
        {/* Carousel */}
        <div
          className="overflow-hidden cursor-grab active:cursor-grabbing"
          ref={emblaRef}
        >
          <div
            className="flex gap-4"
            style={{ touchAction: "pan-y pinch-zoom" }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
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

        {/* ✅ Custom Scrollbar */}
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
    </section>
  );
}