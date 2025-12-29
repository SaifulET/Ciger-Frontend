"use client";
import { useEffect,useState } from "react";
import ProductCard from "./ProductCard";
import { ProductType } from "./ProductType";
import Pagination from "./Pagination";

interface ProductGridProps {
  products: ProductType[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddCart: (id: number) => void;
  onView: (id: number) => void;
  pageSize: number;
  isList:boolean,
}

export default function ProductGrid({
  products,
  totalCount,
  currentPage,
  totalPages,
  onPageChange,
  onAddCart,
  onView,
  pageSize,
  isList,
}: ProductGridProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  

  return (
    <div className="w-full  lg:ml-[32px]">
      <div className="text-sm mb-4 text-gray-600 mt-[16px] ">
        Showing {Math.min(currentPage * pageSize, totalCount)} of {totalCount} products
      </div>

      <div className={`grid ${isList===true?"grid-cols-1":"grid-cols-2"} sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px] sm:gap-6 lg:gap-[32px] `}>
        {products.map((item) => (
          <ProductCard key={item.id} product={item} onAddCart={onAddCart} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 mb-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}