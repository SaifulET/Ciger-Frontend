"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import rightArrow from "@/public/rightArrow.svg";
import Leftarrow from "@/public/leftArrow.svg";
import Link from "next/link";
import api from "@/lib/axios";
import Image from "next/image";

interface Brand {
  _id: string;
  name: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  feature?:boolean;
  __v?: number;
}

interface ApiResponse {
  success: boolean;
  count?: number;
  data: Brand[];
}

export default function ProductCarousel() {
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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await api.get("/brand/getAllBrands");
        
        if (!response.data) {
          throw new Error(`Failed to fetch brands: ${response.status}`);
        }
        
        const data: ApiResponse = await response.data;
        
        
        if (data.success) {
          setBrands(data.data.filter(item => item.feature === true));
        } else {
          throw new Error("API returned unsuccessful response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load brands");
        console.error("Error fetching brands:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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

  // ✅ Updated onThumbDrag with touch support
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

  // ✅ Updated onTrackClick with touch support
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

  // Loading state
  if (loading) {
    return (
      <section className="bg-white mt-[16px] md:mt-[32px] mx-[16px] md:mx-[32px] rounded-lg">
        <div className="p-[16px] md:p-[32px] relative">
          <div className="flex pb-[32px]">
            <h2 className="text-[28px] font-bold text-gray-900 flex-1 flex justify-center text-center pl-[48px] md:pl-[32px]">
              Brands
            </h2>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">Loading brands...</div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="bg-white mt-[16px] md:mt-[32px] mx-[16px] md:mx-[32px] rounded-lg">
        <div className="p-[16px] md:p-[32px] relative">
          <div className="flex pb-[32px]">
            <h2 className="text-[28px] font-bold text-gray-900 flex-1 flex justify-center text-center pl-[48px] md:pl-[32px]">
              Brands
            </h2>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="text-red-500">Error: {error}</div>
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (brands.length === 0) {
    return (
      <section className="bg-white mt-[16px] md:mt-[32px] mx-[16px] md:mx-[32px] rounded-lg">
        <div className="p-[16px] md:p-[32px] relative">
          <div className="flex pb-[32px]">
            <h2 className="text-[28px] font-bold text-gray-900 flex-1 flex justify-center text-center pl-[48px] md:pl-[32px]">
              Brands
            </h2>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="text-gray-500">No brands available</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white mt-[16px] md:mt-[32px] mx-[16px] md:mx-[32px] rounded-lg">
      <div className=" p-[16px] md:p-[32px] relative">
        {/* Header */}
        <div className="flex pb-[32px]">
          <h2 className="text-[28px] font-bold text-gray-900 flex-1 flex justify-center text-center pl-[48px] md:pl-[32px]">
            Brands
          </h2>

          <Link
            href={{
              pathname: "/pages/brand",
            }}
          >
            <button className="text-gray-800 font-medium text-[12px] hover:text-yellow-600">
              View All
            </button>
          </Link>
        </div>
        
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
              {brands.map((brand) => (
                <div
                  key={brand._id}
                  className="flex-shrink-0 w-[calc(50%-16px)] sm:w-[calc(50%-16px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-16px)] px-2 flex justify-center"
                >
                  <Link
                    href={{
                      pathname: "/pages/products",
                      query: { brand: brand.name },
                    }}
                    className="block bg-white duration-300"
                  >
                    <div className="mb-[16px] ">
                     {
                      brand.image && ( <Image
                        src={brand.image}
                        alt={brand.name}
                        width={256}
                        height={180}
                        className="object-contain"
                      />)
                     }
                    </div>
                    <div className="flex justify-center text-center font-montserrat text-[18px] font-semibold leading-[28px] md:leading-[36px]">
                      {brand.name}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="hidden absolute left-[32px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-[32px] top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full lg:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

        {/* ✅ Updated Custom Scrollbar with touch support */}
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