"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
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
  const [canScroll, setCanScroll] = useState(false);
  const [showScrollbar, setShowScrollbar] = useState(false);

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
      if (!scrollbarRef.current || !emblaApi || !canScroll) return;

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
    [emblaApi, scrollToProgress, canScroll]
  );

  const onTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!scrollbarRef.current || !emblaApi || !canScroll) return;

      const scrollbarRect = scrollbarRef.current.getBoundingClientRect();
      const thumbWidth = scrollbarRect.width * 0.25;
      const offsetX = e.clientX - scrollbarRect.left - thumbWidth / 2;
      const maxOffset = scrollbarRect.width - thumbWidth;
      const newProgress = Math.max(0, Math.min(1, offsetX / maxOffset));

      setScrollProgress(newProgress);
      scrollToProgress(newProgress);
    },
    [emblaApi, scrollToProgress, canScroll]
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

    const onReInit = () => {
      const scrollable = emblaApi.canScrollNext() || emblaApi.canScrollPrev();
      setCanScroll(scrollable);
      setShowScrollbar(scrollable);
    };

    onScroll();
    emblaApi.on("scroll", onScroll);
    emblaApi.on("reInit", onScroll);
    emblaApi.on("settle", onScroll);
    emblaApi.on("reInit", onReInit);

    // Initial check
    const initialScrollable = emblaApi.canScrollNext() || emblaApi.canScrollPrev();
    setCanScroll(initialScrollable);
    setShowScrollbar(initialScrollable);

    return () => {
      emblaApi.off("scroll", onScroll);
      emblaApi.off("reInit", onScroll);
      emblaApi.off("settle", onScroll);
      emblaApi.off("reInit", onReInit);
    };
  }, [emblaApi, onScroll]);

  if (items.length < 1) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>

      <div className="relative md:px-[64px]">
        {/* Carousel */}
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
            {items.map((brand) => (
              <div
                key={brand.id}
                className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
              >
                <BrandCard brand={brand} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {canScroll && (
          <>
            <button
              onClick={handlePrev}
              className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} />
            </button>
            <button
              onClick={handleNext}
              className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} />
            </button>
          </>
        )}

        {/* Custom Scrollbar - Only show when there's content to scroll */}
        {showScrollbar && (
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
        )}
      </div>
    </div>
  );
}