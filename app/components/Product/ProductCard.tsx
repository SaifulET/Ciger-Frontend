"use client";
import { Star, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "./ProductType";

interface ProductCardProps {
  product: ProductType;
  onAddCart: (id: number) => void;
  
}

export default function ProductCard({ product, onAddCart}: ProductCardProps) {
  const router = useRouter();
  const newbestSeller= product?.newBestSeller;
  console.log("aa",newbestSeller);


  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition">
      <div className="flex-1 flex flex-col">
        {newbestSeller && (
          <div className="relative">
            <h1 className="px-3 py-1.5 absolute top-[-15px] left-[-16px] bg-[#DD2C2C] rounded-tl-[12px] rounded-br-[12px] z-[3] text-white text-sm font-semibold text-center">
              Best Seller
            </h1>
          </div>
        )}
        {product?.newSeller && (
          <div className="relative">
            <h1 className="px-3 py-1.5 absolute top-[-15px] right-[-16px] bg-[#6E1E2D] rounded-tl-[12px] rounded-br-[12px] z-[3] text-white text-sm font-semibold text-center">
              New
            </h1>
          </div>
        )}

        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg mb-4 relative mt-4 overflow-hidden">
          <img src={product?.image } alt={product?.name}  className=""  />
        
        </div>

        <div className="space-y-2 flex-1">
          <p className="text-sm text-gray-500">{product?.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">4.5</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-500">(245)</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-base line-clamp-2">{product?.name}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">${product?.currentPrice}</span>
            {product?.originalPrice && <span className="text-lg text-gray-400 line-through">${product?.originalPrice}</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          // onClick={() => onAddCart(product.id)}
          className="flex-1 bg-[#C9A040] hover:bg-yellow-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-5 h-5" /> Cart
        </button>
        <button
          // onClick={() => router.push(`/pages/product/${product.id}`)}
          onClick={() => router.push(`/pages/product/12`)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 rounded-lg transition"
        >
          View
        </button>
      </div>
    </div>
  );
}
