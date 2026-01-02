"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import rightArrow from "@/public/rightArrow.svg";
import Leftarrow from "@/public/leftArrow.svg";
import Link from "next/link";
import api from "@/lib/axios";
import ProductCard from "../Products/ProductCard";
import { ProductType } from "../Products/ProductType";

// TYPES
type ProductApiItem = {
  _id: string;
  name?: string;
  images: string[];
  title: string;
  price: number;
  discount: number;
  currentPrice: string;
  averageRating: number;
  isBest: boolean;
  isNew: boolean;
  newBestSeller: boolean;
  newSeller: boolean;
  brandId: {
    _id?: string;
    name?: string;
  };
  available: number;
  inStock: boolean;
};

type Product = {
  id: string;
  brand?: string;
  name?: string;
  image: string;
  originalPrice?: number;
  currentPrice: number;
  newBestSeller: boolean;
  newSeller: boolean;
  available?: number;
  rating?: number;
};

// CONSTANTS
const CONSTANTS = {
  DEFAULT_IMAGE: "",
  CACHE_KEY: "discount-products",
  CACHE_TIMESTAMP_KEY: "discount-products-timestamp",
  CACHE_DURATION: 5 * 60 * 1000,
} as const;

// UTILITIES
const validateImageUrl = (url: string | null | undefined): string => {
  if (!url || url === "null" || url === "undefined" || url === "") {
    return CONSTANTS.DEFAULT_IMAGE;
  }
  return url.startsWith("http") || url.startsWith("/") ? url : `/${url}`;
};

const formatProductData = (item: ProductApiItem): Product => {
  const imageUrl = item.images?.[0]
    ? validateImageUrl(item.images[0])
    : CONSTANTS.DEFAULT_IMAGE;

  const originalPrice =
    item.discount > 0 && item.price > 0
      ? (item.price * 100) / (100 - item.discount)
      : undefined;

  const currentPriceValue = item.currentPrice || item.price || 0;
  const currentPrice =
    typeof currentPriceValue === "number"
      ? currentPriceValue
      : parseFloat(currentPriceValue) || 0;

  return {
    id: item._id || `product-${Math.random().toString(36).slice(2, 11)}`,
    brand: item?.brandId?.name ?? "Unknown Brand",
    name: item?.name || item.title || "Product Name",
    image: imageUrl,
    originalPrice,
    currentPrice,
    newBestSeller: Boolean(item.newBestSeller || item.isBest),
    newSeller: Boolean(item.newSeller || item.isNew),
    available: item.available,
    rating: item.averageRating,
  };
};

// Memoized Product Card Wrapper
const MemoizedProductCard = memo(({ product }: { product: Product }) => (
  <div 
    className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
  >
    <ProductCard product={product as ProductType} />
  </div>
));
MemoizedProductCard.displayName = "MemoizedProductCard";

// Loading Skeleton Component
const LoadingSkeleton = () => (
  <section className="bg-white p-4 md:p-8 mx-4 md:mx-8 mt-4 md:mt-8 rounded-lg">
    <div className="flex pb-8 items-center">
      <h2 className="text-2xl md:text-[28px] flex-1 font-bold text-gray-900 text-center">
        Discounts
      </h2>
    </div>
    <div className="animate-pulse">
      <div className="flex gap-4 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-11px)] lg:w-[calc(25%-12px)]"
          >
            <div className="bg-gray-200 h-64 rounded-lg mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Main Component
export default function DiscountCarousel() {
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  // Fetch products from API
  useEffect(() => {
    mountedRef.current = true;

    const fetchProductsData = async () => {
      // Check cache first
      try {
        const cachedProducts = sessionStorage.getItem(CONSTANTS.CACHE_KEY);
        const cacheTimestamp = sessionStorage.getItem(CONSTANTS.CACHE_TIMESTAMP_KEY);

        if (cachedProducts && cacheTimestamp) {
          const age = Date.now() - parseInt(cacheTimestamp);
          if (age < CONSTANTS.CACHE_DURATION) {
            setProducts(JSON.parse(cachedProducts));
            setLoading(false);
            return;
          }
        }

        setLoading(true);
        setError(null);

        const response = await api.get("/product/getAllProduct?discount=true");

        if (response.status !== 200) {
          throw new Error(`HTTP ${response.status}`);
        }

        const responseData = response.data;

        if (!responseData.success) {
          throw new Error("API returned unsuccessful response");
        }

        let productsArray: ProductApiItem[] = [];

        if (Array.isArray(responseData.data)) {
          productsArray = responseData.data;
        } else if (
          responseData.data?.data &&
          Array.isArray(responseData.data.data)
        ) {
          productsArray = responseData.data.data;
        } else {
          productsArray = responseData.data || [];
        }

        const formattedProducts = productsArray
          .slice(0, 12)
          .map(formatProductData);

        if (mountedRef.current) {
          setProducts(formattedProducts);
        }

        // Cache results
        sessionStorage.setItem(CONSTANTS.CACHE_KEY, JSON.stringify(formattedProducts));
        sessionStorage.setItem(CONSTANTS.CACHE_TIMESTAMP_KEY, Date.now().toString());
      } catch (err) {
        if (!mountedRef.current) return;

        const errorMessage =
          err instanceof Error ? err.message : "Failed to load products";
        setError(errorMessage);

        // Try to use stale cache on error
        const cachedProducts = sessionStorage.getItem(CONSTANTS.CACHE_KEY);
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setError(null);
        }
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchProductsData();

    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Navigation handlers
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

  // Unified handler for mouse + touch
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

  // Thumb drag handler with touch support
  const onThumbDrag = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
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

  // Track click handler with touch support
  const onTrackClick = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
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

  // Embla event listeners
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
    return <LoadingSkeleton />;
  }

  // Error state (only if no cached data)
  if (error && products.length === 0) {
    return (
      <section className="bg-white p-4 md:p-8 mx-4 md:mx-8 mt-4 md:mt-8 rounded-lg">
        <div className="flex pb-8 items-center">
          <h2 className="text-2xl md:text-[28px] flex-1 font-bold text-gray-900 text-center">
            Discounts
          </h2>
        </div>
        <div className="flex flex-col justify-center items-center h-40 gap-2">
          <div className="text-red-500 text-center">
            Failed to load products
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(CONSTANTS.CACHE_KEY);
              sessionStorage.removeItem(CONSTANTS.CACHE_TIMESTAMP_KEY);
              window.location.reload();
            }}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <section className="bg-white p-4 md:p-8 mx-4 md:mx-8 mt-4 md:mt-8 rounded-lg">
        <div className="flex pb-8 items-center">
          <h2 className="pl-[54px] text-[24px] md:text-[28px] flex-1 font-bold text-gray-900 text-center">
            Discounts
          </h2>
          <Link
            href={{
              pathname: "/pages/products",
              query: { discount: true },
            }}
            prefetch={false}
          >
            <button className="text-gray-800 text-xs hover:text-yellow-600 transition-colors">
              View All
            </button>
          </Link>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">No discounted products available</div>
        </div>
      </section>
    );
  }

  // Main render
  return (
    <section className="bg-white p-4 md:p-8 mx-4 md:mx-8 mt-4 md:mt-8 rounded-lg">
      <div className="flex pb-8 items-center">
        <h2 className="pl-[54px] text-[24px] md:text-[28px] flex-1 font-bold text-gray-900 text-center">
          Discounts
        </h2>
        <Link
          href={{
            pathname: "/pages/products",
            query: { discount: true },
          }}
          prefetch={false}
        >
          <button className="text-gray-800 text-[12px] md:text-[14px] hover:text-yellow-600 transition-colors">
            View All
          </button>
        </Link>
      </div>

      <div className="relative md:px-16">
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
            {products.map((product) => (
              <MemoizedProductCard
                key={`${product.id}-${product.currentPrice}`}
                product={product}
              />
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10 border border-gray-200"
          aria-label="Previous products"
        >
          <Image
            src={Leftarrow}
            width={12}
            height={12}
            alt="leftArrow"
            priority
            className="w-3 h-3 md:w-auto md:h-auto"
          />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10 border border-gray-200"
          aria-label="Next products"
        >
          <Image
            src={rightArrow}
            width={12}
            height={12}
            alt="rightArrow"
            priority
            className="w-3 h-3 md:w-auto md:h-auto"
          />
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
    </section>
  );
}