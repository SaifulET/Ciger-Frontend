"use client";
import React, { useState } from "react";
import brandsData from "@/public/brand.json";
import BrandCarousel from "./BrandCarousal";
import { Brand } from "./BrandCard";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

// Define the type for the JSON data structure
interface BrandsData {
  brands: Array<{
    id: number;
    name: string;
    image: string;
  }>;
}

// Type assertion for the imported JSON data
const typedBrandsData = brandsData as BrandsData;

const brands: Brand[] = typedBrandsData.brands.map((b) => ({
  id: b.id,
  name: b.name,
  image: b.image,
}));

// Group brands by first letter
const groupedBrands = new Map<string, Brand[]>();
brands.forEach((brand) => {
  const firstChar = brand.name.charAt(0);
  let key = firstChar;

  if (/^\d/.test(firstChar)) key = "#";
  else if (/^[A-Za-z]$/.test(firstChar)) key = firstChar.toUpperCase();
  else return;

  if (!groupedBrands.has(key)) groupedBrands.set(key, []);
  groupedBrands.get(key)?.push(brand);
});

const sortedKeys = Array.from(groupedBrands.keys()).sort((a, b) => {
  if (a === "#") return -1;
  if (b === "#") return 1;
  return a.localeCompare(b);
});

const itemsPerPage = 5;
const totalPages = Math.ceil(sortedKeys.length / itemsPerPage);

export default function BrandsPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const startIdx = currentPage * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentSections = sortedKeys.slice(startIdx, endIdx);

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <section className="bg-white py-16 px-4 md:px-8 lg:px-16 rounded-lg">
      <div className="max-w-full mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          Our Brands
        </h1>

        {currentSections.map((key) => (
          <BrandCarousel key={key} items={groupedBrands.get(key) || []} title={key} />
        ))}

        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-6 mt-12">
            <div className="text-sm text-gray-600">
              Page {currentPage + 1} of {totalPages}
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              {/* Previous button - hidden on small screens */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="hidden md:flex w-10 h-10 rounded-full bg-white border border-gray-300 items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} />
              </button>

              <div className="flex gap-2 items-center flex-wrap">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setCurrentPage(i);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentPage
                        ? "bg-[#C9A040] scale-110"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Next button - hidden on small screens */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="hidden md:flex w-10 h-10 rounded-full bg-white border border-gray-300 items-center justify-center hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <HugeiconsIcon icon={ArrowRight01Icon} />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}