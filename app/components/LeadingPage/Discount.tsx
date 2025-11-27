"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import rightArrow from "@/public/rightArrow.svg";
import Leftarrow from "@/public/leftArrow.svg";
import Link from "next/link";
import api from "@/lib/axios";
import ProductCard from "../Product/ProductCard";
import { ProductType } from "../Product/ProductType";
import { ConsoleIcon } from "@hugeicons/core-free-icons";

type ProductApiItem = {
  _id: string;
  name: string;
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
    _id: string;
    name: string;
    // Add other brand properties if they exist in the API response
  };
  available: number;
  inStock: boolean;
 
};

type ApiResponseData = {
  success: boolean;
  status: number;
  count: number;
  data: ProductApiItem[];
};

type ApiResponseWrapper = {
  data: ApiResponseData;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    baseURL?: string;
    timeout?: number;
  };
};

type Product = {
  id: string;
  brand: string;
  name: string;
  image: string;
  originalPrice?: number;
  currentPrice: number;
  newBestSeller: boolean;
  newSeller: boolean;
   inStock?: boolean;
  feature?: string;
  category?: string;
  subcategory?: string;
};

type NestedApiResponse = {
  data: ProductApiItem[];
  success?: boolean;
  status?: number;
  count?: number;
};

const validateImageUrl = (url: string | null | undefined): string => {
  if (!url || url === 'null' || url === 'undefined' || url === '' || url.startsWith('null')) {
    return "/default-product.png";
  }
  
  if (url.startsWith('http') || url.startsWith('/')) {
    return url;
  }
  
  return `/${url}`;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response: ApiResponseWrapper = await api.get("/product/getAllProduct?discount=true");
      console.log("Full API Response:", response);
      
      if (response.status !== 200) {
        throw new Error(`Failed to fetch products: HTTP ${response.status}`);
      }

      const responseData = response.data;
      
      if (!responseData.success) {
        throw new Error("API returned unsuccessful response");
      }

      let productsArray: ProductApiItem[] = [];

      if (Array.isArray(responseData.data)) {
        productsArray = responseData.data;
      } else if (responseData.data && Array.isArray((responseData.data as NestedApiResponse).data)) {
        productsArray = (responseData.data as NestedApiResponse).data;
      } else {
        console.warn("Unexpected API response structure:", responseData);
        throw new Error("Unexpected API response format");
      }
      
      if (productsArray.length === 0) {
        console.warn("No products found in response");
        setProducts([]);
        return;
      }

     const formattedProducts: Product[] = productsArray.map((item: ProductApiItem) => {
  const imageUrl = item.images && Array.isArray(item.images) && item.images.length > 0 
    ? validateImageUrl(item.images[0])
    : "/default-product.png";

  // Keep as numbers for calculations
  const originalPrice = item.discount > 0 && item.price > 0 
    ? Math.round(item.price*100/item.discount)
    : undefined;

  const currentPriceValue = item.currentPrice || item.price || 0;
  const currentPrice = typeof currentPriceValue === 'number' 
    ? currentPriceValue 
    : parseFloat(currentPriceValue) || 0;

  return {
    id: item._id || `product-${Math.random().toString(36).substr(2, 9)}`,
    brand: item.brandId.name || "Unknown Brand",
    name: item.name || item.title || "Product Name",
    image: imageUrl,
    originalPrice, // number | undefined
    currentPrice,  // number
    newBestSeller: Boolean(item.newBestSeller || item.isBest),
    newSeller: Boolean(item.newSeller || item.isNew),
     available:item.available,
     rating:item.averageRating
  };
});

// Then format for display when needed
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

// Usage in components:
// formatPrice(product.currentPrice)
// product.originalPrice ? formatPrice(product.originalPrice) : undefined
      
      console.log("Formatted products:", formattedProducts);
      setProducts(formattedProducts);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, []);

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
      
      setTimeout(() => {
        scrollBody.useDuration(25);
        scrollBody.useFriction(0.68);
      }, 0);
    },
    [emblaApi]
  );

  const getClientX = (
    event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
  ): number => {
    if ("touches" in event && event.touches.length > 0) {
      return event.touches[0].clientX;
    }
    if ("clientX" in event) {
      return event.clientX;
    }
    return 0;
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  if (loading) {
    return (
      <section className="bg-white p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
        <div className="flex pb-[32px] items-center">
          <h2 className="text-[28px] flex-1 font-bold text-gray-900 flex justify-center pl-[50px]">
            <span>Discounts</span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
        <div className="flex pb-[32px] items-center">
          <h2 className="text-[28px] flex-1 font-bold text-gray-900 flex justify-center pl-[50px]">
            <span>Discounts</span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-white p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
        <div className="flex pb-[32px] items-center">
          <h2 className="text-[28px] flex-1 font-bold text-gray-900 flex justify-center pl-[50px]">
            <span>Discounts</span>
          </h2>
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="text-gray-500">No products found</div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] rounded-lg">
      <div className="flex pb-[32px] items-center">
        <h2 className="text-[28px] flex-1  font-bold text-gray-900 flex justify-center pl-[50px]">
          <span>Discounts</span>
        </h2>
        <Link
          href={{
            pathname: "/pages/products",
            query: { discount: true },
          }}
        >
          <button className="text-gray-800 text-[12px] hover:text-yellow-600">
            View All
          </button>
        </Link>
      </div>

      <div className="relative md:px-[64px]">
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
               <ProductCard product={product as ProductType} />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="hidden absolute left-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
          aria-label="Previous products"
        >
          <Image src={Leftarrow} width={12} height={12} alt="leftArrow" />
        </button>
        <button
          onClick={handleNext}
          className="hidden absolute right-0 top-1/2 -translate-y-1/2 bg-white w-10 h-10 md:w-12 md:h-12 rounded-full md:flex items-center justify-center hover:bg-gray-100 transition shadow-lg z-10"
          aria-label="Next products"
        >
          <Image src={rightArrow} width={12} height={12} alt="rightArrow" />
        </button>

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