"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
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
  allProducts: boolean;
}

// Define type for URL parameters
type URLParams = {
  keyword?: string;
  sub?: string;
  subPro?: string;
  category?: string;
  brand?: string;
  new?: string;
  best?: string;
  discount?: string;
  search?: string;
};

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [localFilters, setLocalFilters] = useState<LocalFilters>({
    brand: [],
    availability: [],
    feature: [],
    priceRange: [0, 1000],
    product: [],
    allProducts: true,
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isList, setIsList] = useState(false);
  const [pageSize, setPageSize] = useState(6);
  const [isActiveFiltersOpen, setIsActiveFiltersOpen] = useState(false);

  const { 
    products, 
    fullProducts,
    loading, 
    error, 
    fetchAllProducts,
    fetchProductsByKeyword
  } = useProductStore();

  // Fetch all products on initial load
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Extract URL parameters with proper typing
  const urlParams = useMemo((): URLParams => {
    const params: URLParams = {};
    const paramKeys: (keyof URLParams)[] = [
      'keyword', 'sub', 'subPro', 'category', 'brand', 'new', 'discount', 'best', 'search'
    ];
    
    paramKeys.forEach(key => {
      const value = searchParams.get(key);
      if (value) {
        params[key] = value;
      }
    });

    return params;
  }, [searchParams]);

  // Handle URL params - keyword uses API, others use client-side filtering
  useEffect(() => {
    const { keyword, ...otherParams } = urlParams;

    // If keyword exists, use API call
    if (keyword) {
      fetchProductsByKeyword(keyword);
      
      // Convert URL params to local filters for keyword search results
      const newFilters: LocalFilters = {
        brand: [],
        availability: [],
        feature: [],
        priceRange: [0, 1000],
        product: [],
        allProducts: false, // Don't show all products when keyword searching
      };

      // Handle category/subcategory from URL
      if (otherParams.sub || otherParams.category) {
        const category = otherParams.sub || otherParams.category;
        if (otherParams.subPro) {
          newFilters.product.push(`${category}|${otherParams.subPro}`);
        } else {
          newFilters.product.push(category || '');
        }
      }

      // Handle brand from URL
      if (otherParams.brand) {
        newFilters.brand.push(otherParams.brand);
      }

      // Handle feature filters from URL
      if (otherParams.best === 'true') {
        newFilters.feature.push('Best Seller');
      }
      if (otherParams.new === 'true') {
        newFilters.feature.push('New Arrival');
      }

      setLocalFilters(newFilters);
    } else {
      // No keyword - use client-side filtering with full products
      const { fullProducts } = useProductStore.getState();
      useProductStore.setState({ products: fullProducts });

      // Convert URL params to local filters
      const newFilters: LocalFilters = {
        brand: [],
        availability: [],
        feature: [],
        priceRange: [0, 1000],
        product: [],
        allProducts: Object.keys(otherParams).length === 0,
      };

      // Handle category/subcategory from URL
      if (otherParams.sub || otherParams.category) {
        const category = otherParams.sub || otherParams.category;
        if (otherParams.subPro) {
          newFilters.product.push(`${category}|${otherParams.subPro}`);
        } else {
          newFilters.product.push(category || '');
        }
      }

      // Handle brand from URL
      if (otherParams.brand) {
        newFilters.brand.push(otherParams.brand);
      }

      // Handle feature filters from URL
      if (otherParams.best === 'true') {
        newFilters.feature.push('Best Seller');
      }
      if (otherParams.new === 'true') {
        newFilters.feature.push('New Arrival');
      }

      setLocalFilters(newFilters);
    }
  }, [urlParams, fetchProductsByKeyword]);

  // Safe category comparison function
  const compareCategory = useCallback((productCategory: string | undefined, filterCategory: string): boolean => {
    if (!productCategory) return false;
    return productCategory.toLowerCase() === filterCategory.toLowerCase();
  }, []);

  // Safe subcategory comparison function
  const compareSubcategory = useCallback((productSubcategory: string | undefined, filterSubcategory: string): boolean => {
    if (!productSubcategory) return false;
    return productSubcategory.toLowerCase() === filterSubcategory.toLowerCase();
  }, []);

  // Client-side filtering function
  const filterProducts = useCallback((products: ProductType[], filters: LocalFilters): ProductType[] => {
    if (!products || products.length === 0) return [];
    if (filters.allProducts) return products;

    return products.filter(product => {
      // Type-safe product access
      const productBrand = product.brand || '';
      const productCategory = product.category || '';
      const productSubcategory = product.subcategory || '';
      const productPrice = product.currentPrice || 0;
      const productInStock = Boolean(product.inStock);
      const productNewBestSeller = Boolean(product.newBestSeller);
      const productNewSeller = Boolean(product.newSeller);

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(productBrand)) {
        return false;
      }

      // Feature filter
      if (filters.feature.length > 0) {
        const hasMatchingFeature = filters.feature.some(feature => {
          if (feature === "Best Seller" && productNewBestSeller) return true;
          if (feature === "New Arrival" && productNewSeller) return true;
          return false;
        });
        if (!hasMatchingFeature) return false;
      }

      // Category/Subcategory filter - allow multiple selections
      if (filters.product.length > 0) {
        const hasMatchingCategory = filters.product.some(filter => {
          const [category, subcategory] = filter.split("|");
          
          if (subcategory) {
            // If filter has both category and subcategory
            return compareCategory(productCategory, category) && 
                   compareSubcategory(productSubcategory, subcategory);
          } else {
            // If filter has only category
            return compareCategory(productCategory, category);
          }
        });
        if (!hasMatchingCategory) return false;
      }

      // Availability filter
      if (filters.availability.length > 0) {
        const hasMatchingAvailability = filters.availability.some(availability => {
          if (availability === "In Stock" && productInStock) return true;
          if (availability === "Out of Stock" && !productInStock) return true;
          return false;
        });
        if (!hasMatchingAvailability) return false;
      }

      // Price range filter
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  }, [compareCategory, compareSubcategory]);

  // Determine which products to use for filtering
  const productsToFilter = useMemo(() => {
    const { keyword } = urlParams;
    if (keyword) {
      // When keyword search is active, filter the API results
      return products;
    } else {
      // When no keyword, use full products for client-side filtering
      return fullProducts;
    }
  }, [urlParams, products, fullProducts]);

  // Apply client-side filters
  const filteredProducts = useMemo(() => 
    filterProducts(productsToFilter, localFilters),
    [productsToFilter, localFilters, filterProducts]
  );

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginated = useMemo(() => 
    filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredProducts, currentPage, pageSize]
  );

  // Reset current page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [localFilters, urlParams]);

  // Update price range based on available products
  useEffect(() => {
    const { keyword } = urlParams;
    const productsForPriceRange = keyword ? products : fullProducts;
    if (productsForPriceRange.length > 0) {
      const prices = productsForPriceRange
        .map(product => product.currentPrice || 0)
        .filter(price => price > 0);
      const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

      setLocalFilters(prev => ({
        ...prev,
        priceRange: [minPrice, maxPrice]
      }));
    }
  }, [fullProducts, products, urlParams]);

  // Page size responsive handler
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      setPageSize(width >= 1440 ? 12 : width >= 768 ? 9 : 6);
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  const handleAddCart = (id: number) => alert(`Add product ${id} to cart`);
  const handleView = (id: number) => router.push(`/pages/product/${id}`);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return localFilters.brand.length > 0 ||
           localFilters.availability.length > 0 ||
           localFilters.feature.length > 0 ||
           localFilters.product.length > 0 ||
           !localFilters.allProducts ||
           localFilters.priceRange[0] > 0 || 
           localFilters.priceRange[1] < 1000;
  }, [localFilters]);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setLocalFilters({
      brand: [],
      availability: [],
      feature: [],
      priceRange: [0, 1000],
      product: [],
      allProducts: true,
    });
  }, []);

  // Toggle active filters section
  const toggleActiveFilters = useCallback(() => {
    setIsActiveFiltersOpen(prev => !prev);
  }, []);

  // Check if we're in keyword search mode
  const isKeywordSearch = !!urlParams.keyword;

  if (loading && fullProducts.length === 0) {
    return (
      <div className="flex relative py-[16px] md:py-0 mx-[16px] md:mx-[32px]">
        <aside className="hidden lg:block w-[320px] p-4 border-r border-gray-200 flex-shrink-0">
          <div className="space-y-3 w-full">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="pb-2">
                <div className="w-full flex justify-between items-center bg-gray-50 px-4 py-3 rounded-md animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-4"></div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        <div className="flex-1 flex justify-center items-center min-h-64">
          <div className="text-lg">Loading products...</div>
        </div>
      </div>
    );
  }

  if (error && fullProducts.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">Error: {error}</div>
        <button 
          onClick={() => fetchAllProducts()}
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
        {/* Selected Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-3">
              <button 
                onClick={toggleActiveFilters}
                className="flex items-center gap-2 font-semibold text-lg hover:text-gray-700 transition-colors"
              >
                Active Filters
                {isActiveFiltersOpen ? (
                  <ChevronUp size={18} className="text-gray-600" />
                ) : (
                  <ChevronDown size={18} className="text-gray-600" />
                )}
              </button>
              <button 
                onClick={clearAllFilters}
                className="text-sm text-gray-800 hover:text-gray-900 font-medium"
              >
                Clear All
              </button>
            </div>
            
            {isActiveFiltersOpen && (
              <div className="space-y-2 animate-fadeIn">
                {localFilters.brand.map(brand => (
                  <div key={brand} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                    <span className="text-sm">Brand: {brand}</span>
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        brand: prev.brand.filter(b => b !== brand)
                      }))}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {localFilters.product.map(product => {
                  const [category, subcategory] = product.split("|");
                  const displayName = subcategory ? `${category} - ${subcategory}` : category;
                  return (
                    <div key={product} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                      <span className="text-sm">Category: {displayName}</span>
                      <button 
                        onClick={() => setLocalFilters(prev => ({
                          ...prev,
                          product: prev.product.filter(p => p !== product)
                        }))}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
                {localFilters.availability.map(availability => (
                  <div key={availability} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                    <span className="text-sm">Availability: {availability}</span>
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        availability: prev.availability.filter(a => a !== availability)
                      }))}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {localFilters.feature.map(feature => (
                  <div key={feature} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                    <span className="text-sm">Feature: {feature}</span>
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        feature: prev.feature.filter(f => f !== feature)
                      }))}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {(localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 1000) && (
                  <div className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                    <span className="text-sm">
                      Price: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                    </span>
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        priceRange: [0, 1000]
                      }))}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                )}
                {isKeywordSearch && urlParams.keyword && (
                  <div className="flex justify-between items-center bg-blue-50 px-3 py-2 rounded border">
                    <span className="text-sm text-blue-700">
                      Search: &ldquo;{urlParams.keyword}&rdquo;
                    </span>
                    <button 
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete('keyword');
                        router.push(`?${newSearchParams.toString()}`);
                      }}
                      className="text-red-500 hover:text-red-700 text-lg"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <FiltersSidebar
          filters={localFilters}
          setFilters={setLocalFilters}
          products={isKeywordSearch ? products : fullProducts}
        />
      </aside>

      {/* Mobile sidebar overlay */}
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
              products={isKeywordSearch ? products : fullProducts}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      <main className="flex-1 lg:pl-6">
        <div className="flex justify-between items-center lg:hidden w-full mb-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm border"
          >
            Filter & Sort
            <SlidersHorizontal size={18} />
          </button>
          <div className="flex gap-3">
            <button
              className={isList ? "text-gray-900" : "text-gray-500"}
              onClick={() => setIsList(true)}
            >
              <HugeiconsIcon icon={LeftToRightListBulletIcon} />
            </button>
            <button
              className={!isList ? "text-gray-900" : "text-gray-500"}
              onClick={() => setIsList(false)}
            >
              <HugeiconsIcon icon={DashboardSquare01Icon} />
            </button>
          </div>
        </div>

        {/* Mobile Active Filters */}
        {hasActiveFilters && (
          <div className="lg:hidden mb-4 p-3 bg-white rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <button 
                onClick={toggleActiveFilters}
                className="flex items-center gap-2 font-semibold hover:text-gray-700 transition-colors"
              >
                Active Filters
                {isActiveFiltersOpen ? (
                  <ChevronUp size={16} className="text-gray-600" />
                ) : (
                  <ChevronDown size={16} className="text-gray-600" />
                )}
              </button>
              <button 
                onClick={clearAllFilters}
                className="text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear All
              </button>
            </div>
            
            {isActiveFiltersOpen && (
              <div className="flex flex-wrap gap-2 animate-fadeIn">
                {localFilters.brand.map(brand => (
                  <span key={brand} className="inline-flex items-center bg-white px-2 py-1 rounded border text-sm">
                    {brand}
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        brand: prev.brand.filter(b => b !== brand)
                      }))}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {localFilters.product.map(product => {
                  const [category, subcategory] = product.split("|");
                  const displayName = subcategory ? `${category} - ${subcategory}` : category;
                  return (
                    <span key={product} className="inline-flex items-center bg-white px-2 py-1 rounded border text-sm">
                      {displayName}
                      <button 
                        onClick={() => setLocalFilters(prev => ({
                          ...prev,
                          product: prev.product.filter(p => p !== product)
                        }))}
                        className="ml-1 text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
                {localFilters.availability.map(availability => (
                  <span key={availability} className="inline-flex items-center bg-white px-2 py-1 rounded border text-sm">
                    {availability}
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        availability: prev.availability.filter(a => a !== availability)
                      }))}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {localFilters.feature.map(feature => (
                  <span key={feature} className="inline-flex items-center bg-white px-2 py-1 rounded border text-sm">
                    {feature}
                    <button 
                      onClick={() => setLocalFilters(prev => ({
                        ...prev,
                        feature: prev.feature.filter(f => f !== feature)
                      }))}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {isKeywordSearch && urlParams.keyword && (
                  <span className="inline-flex items-center bg-blue-50 px-2 py-1 rounded border text-sm text-blue-700">
                    Search: {urlParams.keyword}
                    <button 
                      onClick={() => {
                        const newSearchParams = new URLSearchParams(searchParams);
                        newSearchParams.delete('keyword');
                        router.push(`?${newSearchParams.toString()}`);
                      }}
                      className="ml-1 text-red-500"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        )}

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
      <style jsx>
        {
          `
         
  
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.4s ease-out  forwards;
}

          `
        
        }

      </style>
    </div>
  );
}
`

`