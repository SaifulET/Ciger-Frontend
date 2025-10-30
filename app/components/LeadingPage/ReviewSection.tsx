"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg";
import Image from "next/image";
import Leftarrow from "@/public/leftArrow.svg";
import profile from "@/public/profile.svg";
import ReviewCard from "../universalComponents/ReviewCard";

type Review = {
  id: number;
  name: string;
  rating: number;
  location: string;
  review: string;
  image: string;
};

export default function ReviewSection() {
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

  const reviews: Review[] = Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `name ${i + 1}`,
    review: `"The team was professional, quick, and very careful with my furniture. They even reassembled my wardrobe perfectly. Highly recommend!"`,
    location: `location ${i + 1}`,
    rating: 4.5,
    image: profile,
    link: "#",
  }));

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

      // Calculate target position based on progress
      const targetPosition = limit.max + (limit.min - limit.max) * progress;

      // Disable animation duration and friction for instant movement
      scrollBody.useDuration(0);
      scrollBody.useFriction(0);

      // Update all position trackers
      offsetLocation.set(targetPosition);
      location.set(targetPosition);
      target.set(targetPosition);

      // Apply the translation (this updates the visual position)
      translate.to(targetPosition);
      translate.toggleActive(true);
    },
    [emblaApi]
  );

  const onThumbDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
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

      const onMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        updateProgress(moveEvent.clientX);
      };

      const onMouseUp = () => {
        setIsDraggingThumb(false);

        // Reset animation settings to defaults after drag
        if (emblaApi) {
          const engine = emblaApi.internalEngine();
          engine.scrollBody.useDuration(25);
          engine.scrollBody.useFriction(0.68);
        }

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      updateProgress(e.clientX);
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [emblaApi, scrollToProgress]
  );

  const onTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!scrollbarRef.current || !emblaApi) return;

      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const thumbWidth = scrollbarRect.width * 0.25;
      const offsetX = e.clientX - scrollbarRect.left - thumbWidth / 2;
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

    const onSettle = () => {
      setIsUsingButtons(false);
    };

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
      <div className="relative">
        {/* Header */}
        <div className="flex justify-center items-center pb-[32px]">
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Words of praise from others about our products
          </h2>
        </div>

        {/* Carousel container */}
        <div className="md:mx-[64px]">
          <div
            className="overflow-hidden cursor-grab active:cursor-grabbing"
            ref={emblaRef}
          >
            <div
              className="flex mb-[32px] gap-4"
              style={{
                touchAction: "pan-y pinch-zoom",
              }}
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-full md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
                >
                  <ReviewCard Review={review} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

        {/* Custom Scrollbar - Same as Discount component */}
        <div className="flex justify-center mt-6">
          <div
            ref={scrollbarRef}
            className="relative w-64 h-1 bg-gray-300 rounded-full overflow-visible cursor-pointer select-none"
            onClick={onTrackClick}
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
            />
          </div>
        </div>
      </div>
    </section>
  );
}