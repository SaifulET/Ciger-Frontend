"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "./ProductGrid";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DashboardSquare01Icon,
  LeftToRightListBulletIcon,
  PlusSignIcon,
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
  allProducts: boolean; // New filter field
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Initialize localFilters with proper default values
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    brand: [],
    availability: [],
    feature: [],
    priceRange: [0, 100],
    product: [],
    allProducts: false, // Default to false
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
      'page', 'sort', 'search','keyword'
    ];

    urlParams.forEach(param => {
      console.log(urlParams,"61")
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


    console.log("Fetching with query params:", queryParams,"76");
    fetchProducts(queryParams);
    
    // Reset local filters when URL parameters change
    setLocalFilters({
      brand: [],
      availability: [],
      feature: [],
      priceRange: [0, 100],
      product: [],
      allProducts: false,
    });
  }, [searchParams, fetchProducts]);

  // Handle All Products filter
  useEffect(() => {
    if (localFilters.allProducts) {
      // Reset all other filters and fetch all products
      fetchProducts();
      setLocalFilters(prev => ({
        brand: [],
        availability: [],
        feature: [],
        priceRange: [0, 1000],
        product: [],
        allProducts: true,
      }));
    }
  }, [localFilters.allProducts, fetchProducts]);

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
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

      // Update localFilters with available values
      setLocalFilters(prev => {
        // Only update if the available values are different from current state
        // This prevents unnecessary re-renders
        const shouldUpdate = 
          JSON.stringify(prev.brand) !== JSON.stringify(availableBrands) ||
          JSON.stringify(prev.product) !== JSON.stringify(availableCategories) ||
          prev.priceRange[0] !== minPrice ||
          prev.priceRange[1] !== maxPrice;

        if (!shouldUpdate) return prev;

        return {
          brand: availableBrands,
          availability: [],
          feature: [],
          priceRange: [minPrice, maxPrice],
          product: availableCategories,
          allProducts: prev.allProducts, // Preserve allProducts state
        };
      });
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

    // If All Products is checked, return all products without filtering
    if (filters.allProducts) {
      return products;
    }

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

  const filteredProducts = filterProducts(products, localFilters);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  
  const paginated = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddCart = (id: number) => alert(`Add product ${id} to cart`);
  const handleView = (id: number) => router.push(`/pages/product/${id}`);

  if (loading) {
    return (
      <div className="flex relative py-[16px] md:py-0 mx-[16px] md:mx-[32px]">

      <aside className="hidden lg:block w-[320px] p-4 border-r border-gray-200 flex-shrink-0">
         <div className="space-y-3 w-full">
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">All Products</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">Product</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">Brand</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">Availability</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">Feature</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>
          <div className="pb-2">
              <button
            className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
          >
             <span className="font-sans text-base font-semibold leading-6">Price</span><HugeiconsIcon icon={PlusSignIcon} />
        </button>
          </div>

         </div>
      </aside>
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