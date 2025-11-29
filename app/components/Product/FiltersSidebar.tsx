"use client";
import { useState, useEffect } from "react";
import DualRangeBar from "./Pricerange";
import FilterSection from "./FilterSection";
import { ProductType } from "./ProductType";
import { HugeiconsIcon } from "@hugeicons/react";
import { MinusSignIcon, PlusSignIcon } from "@hugeicons/core-free-icons";

interface FiltersSidebarProps {
  filters: {
    brand: string[];
    availability: string[];
    feature: string[];
    priceRange: [number, number];
    product: string[];
    allProducts: boolean; // New filter field
  };
  setFilters: (
    fn: (prev: {
      brand: string[];
      availability: string[];
      feature: string[];
      priceRange: [number, number];
      product: string[];
      allProducts: boolean;
    }) => {
      brand: string[];
      availability: string[];
      feature: string[];
      priceRange: [number, number];
      product: string[];
      allProducts: boolean;
    }
  ) => void;
  products: ProductType[];
}

export default function FiltersSidebar({
  filters,
  setFilters,
  products,
}: FiltersSidebarProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [openSubcategories, setOpenSubcategories] = useState<{[key: string]: boolean}>({});
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Reset brand filters to empty array on initial load only
  useEffect(() => {
    if (!isInitialized) {
      setFilters(prev => ({ ...prev, brand: [] }));
      setIsInitialized(true);
    }
  }, [isInitialized, setFilters]);

  const toggleSection = (title: string) =>
    setOpenSection(openSection === title ? null : title);

  const toggleSubcategory = (category: string) => {
    setOpenSubcategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // dynamic data
  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const availability = ["In Stock", "Out of Stock"];
  const features = ["Best Seller", "New Arrival"];
  const prices = products.map((p) => (p.currentPrice));
  const minPrice = 0;
  const maxPrice = 100;

  // New: Get categories and subcategories (filter out undefined values)
  const categories = Array.from(new Set(
    products
      .map(p => p.category)
      .filter((category): category is string => category !== undefined)
  ));
  
  const subcategoriesByCategory: {[key: string]: string[]} = {};
  
  categories.forEach(category => {
    subcategoriesByCategory[category] = Array.from(
      new Set(
        products
          .filter(p => p.category === category)
          .map(p => p.subcategory)
          .filter((subcategory): subcategory is string => subcategory !== undefined)
      )
    );
  });

  const countItems = (type: "brand" | "availability" | "feature" | "product") => {
    const counts: Record<string, number> = {};
    
    if (type === "product") {
      // Count for categories
      categories.forEach(category => {
        counts[category] = products.filter(p => p.category === category).length;
        
        // Count for subcategories
        subcategoriesByCategory[category]?.forEach(subcategory => {
          const key = `${category}|${subcategory}`;
          counts[key] = products.filter(p => 
            p.category === category && p.subcategory === subcategory
          ).length;
        });
      });
    } else {
      const items = type === "brand" ? brands : type === "availability" ? availability : features;

      items.forEach((item) => {
        counts[item] =
          type === "brand"
            ? products.filter((p) => p.brand === item).length
            : type === "availability"
            ? products.filter((p) => (item === "In Stock" ? p.inStock : !p.inStock)).length
            : products.filter((p) =>
                item === "Best Seller" ? p.newBestSeller : p.newSeller
              ).length;
      });
    }

    return counts;
  };

  const toggleValue = (type: "brand" | "availability" | "feature" | "product" | "allProducts", value: string | boolean) => {
    setFilters((prev) => {
      if (type === "allProducts") {
        // When All Products is checked, reset all other filters
        if (value === true) {
          return {
            brand: [],
            availability: [],
            feature: [],
            priceRange: [0, 100],
            product: [],
            allProducts: true,
          };
        } else {
          return { ...prev, allProducts: false };
        }
      }
      
      // For product filters (radio buttons), replace the entire array with the new selection
      if (type === "product") {
        // Extract category from the value to handle radio button group behavior
        const category = (value as string).split('|')[0];
        
        // Remove any existing selections for the same category
        const filtered = prev[type].filter(item => !item.startsWith(category + '|') && item !== category);
        
        // Add the new selection
        return { ...prev, [type]: [...filtered, value as string], allProducts: false };
      } else {
        // For other filter types (checkboxes), use the existing toggle logic
        const list = prev[type].includes(value as string)
          ? prev[type].filter((v) => v !== value)
          : [...prev[type], value as string];
        return { ...prev, [type]: list, allProducts: false };
      }
    });
  };

  const handlePriceChange = (val: [number, number]) => {
    setFilters((prev) => ({ ...prev, priceRange: val, allProducts: false }));
  };

  const productCounts = countItems("product");

  return (
    <div className="space-y-3 w-full">
      {/* All Products Filter Section */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection("All Products")}
          className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
        >
          <span className="font-sans text-base font-semibold leading-6">All Products</span>
          {openSection === "All Products" ? <HugeiconsIcon icon={MinusSignIcon} />: <HugeiconsIcon icon={PlusSignIcon} />}
        </button>

        {openSection === "All Products" && (
          <div className="mt-4 space-y-1 py-2">
            <label className="flex justify-between text-sm items-center cursor-pointer">
              <div className="flex items-center gap-2 font-sans text-base font-normal leading-6 pl-[12px]">
                <input
                  type="checkbox"
                  checked={filters.allProducts}
                  onChange={(e) => toggleValue("allProducts", e.target.checked)}
                  className="w-4 h-4 accent-[#C9A040]"
                />
                Show All Products
              </div>
              <span className="text-gray-500 font-sans text-base font-normal leading-6 pr-4">
                ({products.length})
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Existing Product Filter Section */}
      <div className="pb-2">
        <button
          onClick={() => toggleSection("Product")}
          className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-4 py-3 rounded-md font-medium text-gray-800 transition"
        >
          <span className="font-sans text-base font-semibold leading-6">Product</span>
          {openSection === "Product" ? <HugeiconsIcon icon={MinusSignIcon} />: <HugeiconsIcon icon={PlusSignIcon} />}
        </button>

        {openSection === "Product" && (
          <div className="mt-4 space-y-2  py-2 ">
            {categories.map(category => (
              <div key={category} className="border rounded-lg">
                <button
                  onClick={() => toggleSubcategory(category)}
                  className="w-full flex justify-between items-center bg-gray-50 hover:bg-gray-200 px-3 py-3 rounded-md font-medium text-gray-800 transition "
                >
                  <span>{category}</span>
                  <span className="flex items-center gap-2">
                    ({productCounts[category] || 0})
                    {openSubcategories[category] ? <HugeiconsIcon icon={MinusSignIcon} /> : <HugeiconsIcon icon={PlusSignIcon} />}
                  </span>
                </button>
                
                {openSubcategories[category] && (
                  <div className=" pb-2 space-y-1">
                    {/* Category level radio option */}
                    <label className="flex justify-center text-sm items-center cursor-pointer py-1">
                      <div className="flex items-center gap-2 font-sans text-base font-normal leading-6">
                        <input
                          type="checkbox"
                          name={`category-${category}`}
                          checked={filters.product.includes(category)}
                          onChange={() => toggleValue("product", category)}
                          className="w-4 h-4 accent-[#C9A040]"
                        />
                        All {category}
                      </div>
                    </label>

                    {/* Subcategory radio options */}
                    {subcategoriesByCategory[category]?.map(subcategory => {
                      const key = `${category}|${subcategory}`;
                      return (
                        <label key={key} className="flex justify-between text-sm items-center cursor-pointer py-1">
                          <div className="flex items-center gap-2 font-sans text-base font-normal leading-6">
                            <input
                              type="checkbox"
                              name={`category-${category}`}
                              checked={filters.product.includes(key)}
                              onChange={() => toggleValue("product", key)}
                              className="w-4 h-4 accent-[#C9A040]"
                            />
                            {subcategory}
                          </div>
                          <span className="text-gray-500 font-sans text-base font-normal leading-6 pr-2">
                            ({productCounts[key] || 0})
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <FilterSection
        title="Brand"
        items={showAllBrands ? brands : brands.slice(0, 10)}
        selectedItems={filters.brand}
        onToggleItem={(v) => toggleValue("brand", v)}
        open={openSection === "Brand"}
        onToggleOpen={() => toggleSection("Brand")}
        counts={countItems("brand")}
        showAllBrands={showAllBrands}
        onShowAllBrands={() => setShowAllBrands(true)}
        hasMoreBrands={brands.length > 10}
      />

      <FilterSection
        title="Availability"
        items={availability}
        selectedItems={filters.availability}
        onToggleItem={(v) => toggleValue("availability", v)}
        open={openSection === "Availability"}
        onToggleOpen={() => toggleSection("Availability")}
        counts={countItems("availability")}
      />

      <FilterSection
        title="Feature"
        items={features}
        selectedItems={filters.feature}
        onToggleItem={(v) => toggleValue("feature", v)}
        open={openSection === "Feature"}
        onToggleOpen={() => toggleSection("Feature")}
        counts={countItems("feature")}
      />

      {/* Price Range */}
      <FilterSection
        title="Price"
        open={openSection === "Price"}
        onToggleOpen={() => toggleSection("Price")}
      >
        <div className="overflow-hidden">
          <DualRangeBar
            min={minPrice}
            max={maxPrice}
            value={filters.priceRange}
            onChange={handlePriceChange}
          />
        </div>
      </FilterSection>
    </div>
  );
}