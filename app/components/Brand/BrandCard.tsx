"use client";
import Image from "next/image";
import Link from "next/link";

export type Brand = {
  id: number;
  name: string;
  image: string;
};

export default function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div className="flex-shrink-0 basis-1/5 px-2">
      <div className="flex flex-col items-center gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition bg-white h-full">
        <Link
          href={{
            pathname: "/pages/product",
            query: { brand: "camel"},
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
