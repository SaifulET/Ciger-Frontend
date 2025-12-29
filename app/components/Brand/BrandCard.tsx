"use client";
import Image from "next/image";
import Link from "next/link";
import { Brand } from "./types";

export default function BrandCard({ brand }: { brand: Brand }) {
  
  // Encode the brand name to handle special characters like &
  const encodedBrandName = encodeURIComponent(brand.name);

  return (
    <div className="flex-shrink-0 basis-1/3 md:basis-1/4 lg:basis-1/5 px-2">
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white h-full">
        <Link
          href={{
            pathname: "/pages/products",
            query: { brand: encodedBrandName }, // Use encoded value here
          }}
        >
          <div className="w-20 h-20 relative flex-shrink-0">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              className="object-cover rounded"
            />
          </div>
        </Link>
        <h3 className="text-sm font-semibold text-gray-900 text-center line-clamp-2">
          {brand.name}
        </h3>
      </div>
    </div>
  );
}