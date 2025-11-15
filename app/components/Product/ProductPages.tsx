"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "./ProductGrid";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  

  const { 
    products, 
    loading, 
    error, 
    fetchProducts 
  } = useProductStore();

  const pageSize = 6;

  // Client-side filtering function
  const filterProducts = (products: ProductType[], filters: LocalFilters): ProductType[] => {
    return products.filter(product => {
      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Feature filter
      if (filters.feature.length > 0) {
        if (filters.feature.includes("Best Seller") && !product.newBestSeller) {
          return false;
        }
        if (filters.feature.includes("New Arrival") && !product.newSeller) {
          return false;
        }
      }

      // Category/Subcategory filter
      if (filters.product.length > 0) {
        const categoryMatch = filters.product.some(filter => {
          const [category, subcategory] = filter.split("|");
          const matchesCategory = category ? product.category === category : true;
          const matchesSubcategory = subcategory ? product.subcategory === subcategory : true;
          return matchesCategory && matchesSubcategory;
        });
        
        if (!categoryMatch) {
          return false;
        }
      }

      // Availability filter
      if (filters.availability.length > 0) {
        if (filters.availability.includes("In Stock") && !product.inStock) {
          return false;
        }
        if (filters.availability.includes("Out of Stock") && product.inStock) {
          return false;
        }
      }

      // Price range filter
      const productPrice = parseFloat(product.currentPrice) || 0;
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false;
      }

      return true;
    });
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = filterProducts(products, localFilters);
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  console.log(filteredProducts,"abc")
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
          onClick={() => fetchProducts()}
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