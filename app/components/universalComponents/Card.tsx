"use client";
import { Star, Plus } from "lucide-react";

import Image from "next/image";
import Link from "next/link";

export type Product = {
  id: number;
  brand: string;
  name: string;
  image: string;
  originalPrice?: string;
  currentPrice: string;
  newBestSeller?: boolean;
  newSeller?: boolean;
};

type ProductCardProps = {
  product: Product;
  onAddCart: (productId: number) => void;
  onView: (productId: number) => void;
};

export default function ProductCard({
  product,
  onAddCart,
  onView,
}: ProductCardProps) {
  return (
   
 <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition">

<Link href="/pages/products/123">
 <div className="flex-1 flex flex-col">
        {product.newBestSeller && (
          <div className="relative">
            <h1 className="  px-3 py-1.5   absolute top-[-15px] left-[-16px] bg-[#DD2C2C] rounded-tl-[12px] rounded-br-[12px] z-[3] text-white text-sm font-semibold text-center">
              Best Seller
            </h1>
          </div>
        )}
        {product.newSeller && (
          <div className="relative">
            <h1 className="  px-3 py-1.5   absolute top-[-15px] right-[-16px] bg-[#6E1E2D] rounded-tr-[12px] rounded-bl-[12px] z-[3] text-white text-sm font-semibold text-center">
              New
            </h1>
          </div>
        )}
        {/* Product Image */}
        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg mb-4 relative mt-4 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover" // ✅ This makes image fully cover the square
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2 flex-1">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">4.5</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-500">(245)</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              ${product.currentPrice}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
</Link>
     

      {/* Action Buttons */}
      <div className="flex gap-3 mt-4">
        <button
          onClick={() => onAddCart(product.id)}
          className="w-full bg-[#C9A040] hover:bg-yellow-600 text-white  font-normal md:font-medium py-2 rounded-lg flex items-center justify-center gap-1 transition  "
        >
          <Plus className="w-5 h-5" /> Cart
        </button>
      
      </div>
    </div>   
   
  );
}
