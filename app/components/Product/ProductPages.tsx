"use client";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import ProductGrid from "./ProductGrid";
import { ProductType } from "./ProductType";
import { useRouter } from "next/navigation";
import { DashboardSquare01Icon, LeftToRightListBulletIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const dummyProducts: ProductType[] = [
  {
    id: 1,
    brand: "Marlboro",
    name: "Good Stuff Natural",
    image: "/product1.png",
    originalPrice: "24.99",
    currentPrice: "19.99",
    newBestSeller: true,
    inStock: true,
    feature: ["Best Seller"],
    category: "Tobacco Product",
    subcategory: "Premium Cigars",
  },
  {
    id: 2,
    brand: "Winston",
    name: "Premium Blend",
    image: "/product2.png",
    currentPrice: "17.49",
    newSeller: true,
    inStock: false,
    feature: ["New Arrival"],
    category: "Tobacco Product",
    subcategory: "Machine-Made Cigars",
  },
  {
    id: 3,
    brand: "Winston",
    name: "Organic Tobacco Mix",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "Hokkah",
    subcategory: "Hokkah Pipes",
  },
  {
    id: 4,
    brand: "Camel",
    name: "Classic Tobacco",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "Hokkah ",
    subcategory: "Shisha Tobacco",
  },
  {
    id: 5,
    brand: "Camel",
    name: "Turkish Royal",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "Nicotine Vapes",
    subcategory: "Disponals",
  },
  {
    id: 6,
    brand: "Wistern",
    name: "Menthol Fresh",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "Smokeless",
    subcategory: "Chewing Tobacco",
  },
  {
    id: 7,
    brand: "Wistern",
    name: "Pipe Tobacco",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "General Accessories",
    subcategory: "Lighters and Torch Lighters",
  },
  {
    id: 8,
    brand: "Wistern",
    name: "Rolling Papers",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "General Accessories",
    subcategory: "Ashtrays",
  },
  {
    id: 9,
    brand: "Wistern",
    name: "Lighters",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "THC",
    subcategory: "Flowers",
  },
  {
    id: 10,
    brand: "Wistern",
    name: "Cigarette Tubes",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "THC",
    subcategory: "Pre-Rolls",
  },
  {
    id: 11,
    brand: "Camel",
    name: "Filter Tips",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "THC",
    subcategory: "Edibles",
  },
  {
    id: 12,
    brand: "Camel",
    name: "Premium Cigar",
    image: "/product3.png",
    currentPrice: "20.0",
    inStock: true,
    feature: [],
    category: "THC",
    subcategory: "Concentrates",
  },
];

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    brand: [] as string[],
    availability: [] as string[],
    feature: [] as string[],
    priceRange: [0, 100] as [number, number],
    product: [] as string[], // New product filter
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const pageSize = 6;
  const [isList,setIsList]= useState(false)

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Apply filters
  const filteredProducts = dummyProducts.filter((p) => {
    const brandOk = filters.brand.length
      ? filters.brand.includes(p.brand)
      : true;
    const availOk = filters.availability.length
      ? filters.availability.includes(p.inStock ? "In Stock" : "Out of Stock")
      : true;
    const featureOk = filters.feature.length
      ? filters.feature.every((f) =>
          f === "Best Seller"
            ? p.newBestSeller
            : f === "New Arrival"
            ? p.newSeller
            : true
        )
      : true;
    const price = parseFloat(p.currentPrice);
    const priceOk =
      price >= filters.priceRange[0] && price <= filters.priceRange[1];

    // New product filter logic
    const productOk = filters.product.length
      ? filters.product.some((selectedProduct) => {
          // Check if the selected product filter matches category or subcategory
          const [category, subcategory] = selectedProduct.split("|");
          if (subcategory) {
            // If subcategory is specified, match both category and subcategory
            return p.category === category && p.subcategory === subcategory;
          } else {
            // If only category is specified, match any product in that category
            return p.category === category;
          }
        })
      : true;

    return brandOk && availOk && featureOk && priceOk && productOk;
  });

  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const paginated = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleAddCart = (id: number) => alert(`Add product ${id} to cart`);
  const handleView = (id: number) => router.push(`/pages/product/`);

  return (
    <div className="flex w-full relative">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[220px] p-4 border-r border-gray-200 flex-shrink-0">
        <FiltersSidebar
          filters={filters}
          setFilters={setFilters}
          products={dummyProducts}
        />
      </aside>

      {/* Mobile sort button */}

      {/* Mobile drawer */}
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
              filters={filters}
              setFilters={setFilters}
              products={dummyProducts}
            />
          </div>
          <div
            className="flex-1 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
        </div>
      )}

      {/* Product grid */}
      <main className="w-full px-2 sm:px-4 md:px-8 lg:px-16 py-4 md:py-0">
        <div className="flex justify-between  items-center lg:hidden w-full px-4 py-2">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-md shadow-sm"
          >
            Filter & Sort<SlidersHorizontal size={18} /> 
          </button>
          <div className="flex gap-3">
            <button className={`${isList===true?"text-gray-500":"text-gray-900"} `} onClick={()=>{setIsList(true)}}>
            <HugeiconsIcon icon={LeftToRightListBulletIcon} />
          </button>
          <button className={`${isList===false?"text-gray-500":"text-gray-900"} `} onClick={()=>{setIsList(false)}}>
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
