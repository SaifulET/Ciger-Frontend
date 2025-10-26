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
      <div className="flex gap-2">
        {product.bestSeller && <span className=" p-4  bg-[#ad2a2a] rounded-lg  z-[3] text-white text-sm font-semibold text-center">BEST SELLER</span>}
        {product.newArrival && <span className=" p-4  bg-[#6E1E2D]  z-[3] text-white text-sm font-semibold text-center">NEW ARRIVAL</span>}
        <span className={`p-3 rounded-lg  z-[3]  text-sm font-semibold text-center  ${product.inStock ? "text-green-900 bg-[#EAFAF3]" : "bg-[#FCEAEA] text-red-500"}`}>
          {product.inStock ? "IN STOCK" : "OUT OF STOCK"}
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
      <div className="flex items-baseline justify-end gap-4">
        <span className="text-4xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
        {product.originalPrice && <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>}
      </div>

      {/* Add to Cart */}
      <button onClick={handleAddToCart} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded transition">Add To Cart</button>
      <Link href="/pages/shoppingcart"><button  className="w-full font-bold py-3 rounded transition bg-gray-200 hover:bg-gray-300">View Cart</button></Link>
    </div>
  );
}
