"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "./ProductGrid";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DashboardSquare01Icon,
  LeftToRightListBulletIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useProductStore } from "@/app/store/productStore";
import { ProductType } from "./ProductType";

interface LocalFilters {
  brand: string[];
  availability: string[];
  feature: string[];
  priceRange: [number, number];
  product: string[];
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    brand: [],
    availability: [],
    feature: [],
    priceRange: [0, 100],
    product: [],
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isList, setIsList] = useState(false);
  const [pageSize, setPageSize] = useState(6);

  const { 
    products, 
    loading, 
    error, 
    fetchProducts 
  } = useProductStore();

  // Build query parameters for fetchProducts
  const buildQueryParams = () => {
    const params: Record<string, string> = {};

    // Get all URL parameters and pass them directly
    const urlParams = [
      'sub', 'subPro', 'category', 'brand', 'new', 'discount', 'best',
      'page', 'sort', 'search'
    ];

    urlParams.forEach(param => {
      const value = searchParams.get(param);
      if (value) {
        params[param] = value;
      }
    });

    return params;
  };

  // Fetch products when URL parameters change
  useEffect(() => {
    const queryParams = buildQueryParams();
    console.log("Fetching with query params:", queryParams);
    fetchProducts(queryParams);
  }, [searchParams, fetchProducts]);

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilters, searchParams]);

  // Initialize localFilters with available values from products
  useEffect(() => {
    if (products.length > 0) {
      // Get unique brands from products
      const availableBrands = [...new Set(products.map(product => product.brand).filter(Boolean))] as string[];
      
      // Get unique categories and subcategories
      const availableCategories = [...new Set(products.flatMap(product => {
        const categories = [];
        if (product.category) {
          categories.push(product.category);
          if (product.subcategory) {
            categories.push(`${product.category}|${product.subcategory}`);
          }
        }
        return categories;
      }).filter(Boolean))] as string[];

      // Get price range from products
      const prices = products.map(product => product.currentPrice || 0).filter(price => price > 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 100;

      // Update localFilters with available values (but preserve user selections)
      setLocalFilters(prev => ({
        ...prev,
        brand: prev.brand.length > 0 ? prev.brand : availableBrands,
        product: prev.product.length > 0 ? prev.product : availableCategories,
        priceRange: prev.priceRange[0] === 0 && prev.priceRange[1] === 100 ? [minPrice, maxPrice] : prev.priceRange
      }));
    }
  }, [products]);

  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      setPageSize(width >= 1440 ? 12 : width >= 768 ? 9 : 6);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  // Client-side filtering function
  const filterProducts = (products: ProductType[], filters: LocalFilters): ProductType[] => {
    if (!products || products.length === 0) return [];

    return products.filter(product => {
      // Brand filter - if brands are selected, product must match one of them
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Feature filter
      if (filters.feature.length > 0) {
        const hasMatchingFeature = filters.feature.some(feature => {
          if (feature === "Best Seller" && product.newBestSeller) return true;
          if (feature === "New Arrival" && product.newSeller) return true;
          return false;
        });
        if (!hasMatchingFeature) return false;
      }

      // Category/Subcategory filter
      if (filters.product.length > 0) {
        const hasMatchingCategory = filters.product.some(filter => {
          const [category, subcategory] = filter.split("|");
          const matchesCategory = category ? product.category === category : true;
          const matchesSubcategory = subcategory ? product.subcategory === subcategory : true;
          return matchesCategory && matchesSubcategory;
        });
        if (!hasMatchingCategory) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const hasMatchingAvailability = filters.availability.some(availability => {
          if (availability === "In Stock" && product.inStock) return true;
          if (availability === "Out of Stock" && !product.inStock) return true;
          return false;
        });
        if (!hasMatchingAvailability) return false;
      }

      // Price range filter
      const productPrice = product.currentPrice || 0;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  };

  console.log("Products:", products);
  console.log("Local Filters:", localFilters);
  
  const filteredProducts = filterProducts(products, localFilters);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  
  console.log("Filtered Products:", filteredProducts);
  
  const paginated = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddCart = (id: number) => alert(`Add product ${id} to cart`);
  const handleView = (id: number) => router.push(`/pages/product/${id}`);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
        <button 
          onClick={() => fetchProducts(buildQueryParams())}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex relative py-[16px] md:py-0 mx-[16px] md:mx-[32px]">
      <aside className="hidden lg:block w-[320px] p-4 border-r border-gray-200 flex-shrink-0">
        <FiltersSidebar
          filters={localFilters}
          setFilters={setLocalFilters}
          products={products}
        />
      </aside>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-4/5 md:w-1/2 bg-white shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setIsSidebarOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <FiltersSidebar
              filters={localFilters}
              setFilters={setLocalFilters}
              products={products}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <main className="w-full">
        <div className="flex justify-between items-center lg:hidden w-full">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm"
          >
            Filter & Sort
            <SlidersHorizontal size={18} />
          </button>
          <div className="flex gap-3">
            <button
              className={isList ? "text-gray-500" : "text-gray-900"}
              onClick={() => setIsList(true)}
            >
              <HugeiconsIcon icon={LeftToRightListBulletIcon} />
            </button>
            <button
              className={!isList ? "text-gray-500" : "text-gray-900"}
              onClick={() => setIsList(false)}
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} />
            </button>
          </div>
        </div>

        <ProductGrid
          products={paginated}
          totalCount={filteredProducts.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          onAddCart={handleAddCart}
          onView={handleView}
          pageSize={pageSize}
          isList={isList}
        />
      </main>
    </div>
  );
}