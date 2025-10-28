import React from "react";
import { Product } from "./product";
import Link from "next/link";

interface Props {
  product: Product;
  quantity: number;
  setQuantity: (q: number) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  handleAddToCart: () => void;
}

export default function ProductInfo({ product, quantity, setQuantity, selectedColor, setSelectedColor, handleAddToCart }: Props) {
  return (
    <div className="space-y-6 bg-gray-50 p-16  rounded-lg ">
      {/* Badges */}
      <div className="font-semibold text-[16px] leading-[24px] text-[#0C0C0C] flex-none order-0 flex-grow-0">
        Category/SubCategory
      </div>
      <div className="flex gap-2 justify-end">
  {product.bestSeller && (
    <span className="px-4 py-2 bg-red-600 rounded-full text-white text-xs font-semibold">
      Best Seller
    </span>
  )}
  {product.newArrival && (
    <span className="px-4 py-2 bg-purple-900 rounded-full text-white text-xs font-semibold">
      New Arrivals
    </span>
  )}
  <span className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
    product.inStock 
      ? "text-green-700 bg-green-50" 
      : "bg-red-50 text-red-600"
  }`}>
    {product.inStock ? (
      <>
        In Stock
        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
      </>
    ) : (
      <>
        Out of Stock
        <span className="w-2 h-2 bg-red-500 rounded-full"></span>
      </>
    )}
  </span>
</div>

      <h1 className="text-[40px] font-semibold leading-[48px]">{product.title}</h1>
      <p className="text-base font-semibold leading-6">{product.name}</p>

      {/* Color Variants */}
      <div>
        <label className="block mb-2 font-bold text-gray-800">Color</label>
        <div className="flex gap-3">
          {product.colors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === color ?  "w-9 h-9" :""}`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-2 font-bold text-gray-800">Quantity</label>
        <div className="flex items-center border border-gray-300 rounded-lg  overflow-hidden w-40">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2  text-gray-600 bg-[#C9A040] hover:bg-[#b59853] ">−</button>
          <span className="flex-1 text-center font-bold">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-600 bg-[#C9A040] hover:bg-[#b59853]  ">+</button>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline justify-start gap-4">
        <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {product.originalPrice && <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>}
      </div>

      {/* Add to Cart */}
      <button onClick={handleAddToCart} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition">Add To Cart</button>
      <Link href="/pages/shoppingcart"><button  className="w-full font-bold py-3 rounded-lg transition bg-gray-200 hover:bg-gray-300">View Cart</button></Link>
    </div>
  );
}
