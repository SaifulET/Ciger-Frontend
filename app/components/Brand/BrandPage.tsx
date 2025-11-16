"use client";
import React, { useEffect, useState } from "react";
import { getBrandsData } from "./brandsData";
import { Brand } from "./types";
import Link from "next/link";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBrands() {
      try {
        setLoading(true);
        const result = await getBrandsData();
        if (result.success) {
          setBrands(result.data);
        } else {
          setError('Failed to load brands');
        }
      } catch (err) {
        setError('Error fetching brands');
      } finally {
        setLoading(false);
      }
    }

    fetchBrands();
  }, []);

  // Group brands by first letter
  const groupedBrands = new Map<string, Brand[]>();
  brands.forEach((brand: Brand) => {
    const firstChar = brand.name.charAt(0);
    let key = firstChar;

    // Check if the first character is a number
    if (/^\d/.test(firstChar)) {
      key = "#";
    } else if (/^[A-Za-z]$/.test(firstChar)) {
      key = firstChar.toUpperCase();
    } else {
      return; // Skip if it's neither letter nor number
    }

    if (!groupedBrands.has(key)) groupedBrands.set(key, []);
    groupedBrands.get(key)?.push(brand);
  });

  const sortedKeys = Array.from(groupedBrands.keys()).sort((a, b) => {
    if (a === "#") return -1; // "#" comes first
    if (b === "#") return 1;
    return a.localeCompare(b);
  });

  if (loading) {
    return (
      <section className="bg-white p-[16px] md:p-[32px] rounded-lg">
        <div className="flex justify-center items-center h-32">
          <p className="text-gray-600">Loading brands...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white p-[16px] md:p-[32px] rounded-lg">
        <div className="flex justify-center items-center h-32">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white p-[16px] md:p-[32px] rounded-lg">
      <div className="">
        <h1 className=" bg-white rounded-lg  text-[28px] font-semibold leading-[48px] text-gray-900 text-center    mb-[16px] md:mb-[32px] ">
          Our Brands
        </h1>

        {/* Responsive CSS Columns - Natural flow without break prevention */}
        <div className="columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12">
          {sortedKeys.map((key) => (
            <div key={key} className="mb-8">
              {/* Letter Header */}
              <h2 className="text-[16px] font-semibold text-gray-900 mb-4 border-b-2 border-gray-300 pb-2">
                {key}
              </h2>

              {/* Brand List */}
              <div className="space-y-2">
                {groupedBrands
                  .get(key)
                  ?.sort((a, b) => a.name.localeCompare(b.name))
                  .map((brand: Brand) => (
                    <div 
                      key={brand._id} 
                      className="text-gray-700 text-[14px] hover:text-[#C9A040] cursor-pointer transition-colors py-1"
                    >
                      <Link href={`/pages/products?brand=${brand.name}`}>{brand.name}</Link>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}