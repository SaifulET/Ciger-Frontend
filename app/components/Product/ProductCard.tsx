"use client";
import { Star, Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "./ProductType";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import useUserStore from "@/app/store/userStore";
import { useEffect } from "react";

interface ProductCardProps {
  product: ProductType;
  onAddCart?: (id: number) => void;
  
}

export default function ProductCard({ product, onAddCart}: ProductCardProps) {
 const { addItem, getItemQuantity } = useCartStore();
  const { user } = useUserStore();
  const userId = user || null;

  
  
  const currentQuantity = getItemQuantity(product.id.toString());
const handleAddToCart = () => {
    addItem({
      _id:product.id.toString(),
      brand: product.brandId?.name,
      name: product.name,
      price: product.currentPrice,
      available: product.available,
      image: product.image,

    }, userId);
  };




  const router = useRouter();
  const newbestSeller= product?.newBestSeller;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition">
      <Link href={`/pages/products/${product?.id}`}>
      
       <div className="flex-1 flex flex-col">
        {newbestSeller && (
          <div className="relative">
            <h1 className="px-1 md:px-3 py-1 md:py-1.5 absolute top-[-16px] left-[-16px] bg-[#cf2626] rounded-tl-[12px] rounded-br-[12px] z-[3] text-gray-100 text-xs md:text-sm font-semibold text-center">
              Best Seller
            </h1>
          </div>
        )}
        {product?.newSeller && (
          <div className="relative">
            <h1 className="px-1 md:px-3 py-1 md:py-1.5 absolute top-[-16px] right-[-16px] bg-[#6E1E2D] rounded-tr-[12px] rounded-bl-[12px] z-[3] text-gray-100 text-xs md:text-sm font-semibold text-center">
              New
            </h1>
          </div>
        )}

        <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-lg mb-4 relative mt-4 overflow-hidden">
          <img src={product?.image } alt={product?.name}  className="product Image"  />
        
        </div>

        <div className="space-y-2 flex-1">
          <p className="text-sm text-gray-500">{product?.brand}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold">{product.rating?product.rating:product.averageRating?product.averageRating:"0"}</span>
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-xs text-gray-500">({(product.available)})</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-[16px] line-clamp-2">{product?.name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-[18px] md:text-[24px] font-semibold text-gray-900">${(product?.currentPrice).toFixed(2)   }</span>
            {product?.originalPrice && <span className="text-[14px] font-semibold text-gray-400 line-through">${(product?.originalPrice).toFixed(2)   }</span>}
          </div>
        </div>
      </div>
      </Link>
     

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleAddToCart}
          className="flex-1 bg-[#C9A040] hover:bg-yellow-600 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-1 transition"
        >
          <Plus className="w-5 h-5" /> Cart
        </button>
       
      </div>
    </div>
  );
}

