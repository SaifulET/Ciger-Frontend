"use client";
import { Star, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ProductType } from "./ProductType";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import useUserStore from "@/app/store/userStore";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/slugify";

interface ProductCardProps {
  product: ProductType;
  onAddCart?: (id: number) => void;
}

export default function ProductCard({ product, onAddCart }: ProductCardProps) {
  const { addItem, getItemQuantity, guestId } = useCartStore();
  const { user } = useUserStore();
  const userId = user || guestId || null;
  const [isAdding, setIsAdding] = useState(false);
  
  const currentQuantity = getItemQuantity(product.id.toString());
  
  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    
    try {
      console.log(product.available, product.name, product.inStock, "27");
      addItem({
        _id: product.id.toString(),
        brand: product.brandId?.name,
        name: product.name,
        price: product.currentPrice,
        available: product.available || 0,
        image: product.image,
      }, userId, 1);
      
      // Optional: Call the onAddCart prop if provided
      if (onAddCart) {
        onAddCart(Number(product.id));
      }
    } catch (error) {
      
    } finally {
      // Keep the loading state for 1 second for better UX
      setTimeout(() => {
        setIsAdding(false);
      }, 1000);
    }
  };

  const router = useRouter();
  const newbestSeller = product?.newBestSeller;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col h-full shadow-sm hover:shadow-md transition">
      <Link href={`/products/${product?.id}-${slugify(product?.name)}`}>
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
            <img
              src={product?.image}
              alt={product?.name}
              className="product Image"
            />
            
            {/* Out of Stock Overlay for Image */}
            {product.available === 0 && (
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center rounded-lg">
                <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-md mx-4 md:mx-0">
                  <span className="text-red-600 font-bold text-md md:text-lg">Out of Stock</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <p className="text-sm text-gray-500">{product?.brand}</p>
            
            <div className={`flex items-center ${product.averageRating ? "gap-2" : ""}`}>
              <span className="text-xs font-semibold">
                {product.rating ? product.rating : product.averageRating ? product.averageRating : ""}
              </span>
              {product.averageRating ? <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> : ""}
            </div>
            <h3 className="font-semibold text-gray-900 text-[16px] overflow-hidden h-[104px] md:h-[96px] xl:h-[64px]">
              {product?.name}
            </h3>
            <div className="flex-col md:flex-row flex items-baseline gap-0 md:gap-1">
              <span className="text-[24px] font-semibold text-gray-900">
                ${(product?.currentPrice).toFixed(2)}
              </span>
              {product?.originalPrice !== undefined && product.originalPrice > 0 && (
                <span className="text-[14px] font-semibold text-gray-400 line-through">
                  ${(product?.originalPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <div className="flex gap-3 mt-4">
        {product.available ? (
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-1 ${
              isAdding 
                ? 'bg-yellow-600' 
                : 'bg-[#C9A040] hover:bg-yellow-600'
            } text-white font-medium h-[44px] lg:h-[52px] rounded-lg flex items-center justify-center gap-1 transition disabled:opacity-80`}
          >
            {isAdding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Cart</span>
              </>
            )}
          </button>
        ) : (
          <button
            disabled
            className="flex-1 bg-gray-200 text-gray-400 font-medium h-[44px] lg:h-[52px] rounded-lg flex items-center justify-center gap-1 transition cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Cart
          </button>
        )}
      </div>
    </div>
  );
}