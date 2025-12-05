import React, { useState } from "react";
import { Product } from "./product";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore"; // Import from cartStore
import useUserStore from "@/app/store/userStore"; // Import userStore to get userId




interface Props {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
}

export default function ProductInfo({ product, selectedColor, setSelectedColor }: Props) {
  const { user } = useUserStore();
  const [count,setCount] = useState(1)
  const [msg,setMsg] = useState("")
  const userId = user || null;
  
  // Get cart state and actions from cartStore
  const { 
    items: cartItems, 
    getItemQuantity, 
    addItem, 
    updateQuantity, 
    removeItem,
    getCartCount,
    isLoading,
    isSyncing
  } = useCartStore();

  // Get current quantity of this product in cart
  const currentQuantity = getItemQuantity(product._id);

  // Generate color styles dynamically
  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'red': 'bg-red-500',
      'black': 'bg-black',
      'brown': 'bg-amber-900',
      'blue': 'bg-blue-500',
      'silver': 'bg-gray-300',
      'white': 'bg-white border border-gray-300'
    };
    
    return colorMap[color.toLowerCase()] || 'bg-gray-200';
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!product.available) return;
    if(product.available>count){

      for(let i=1;i<=count;i++){
         try {
      await addItem(
        {
          _id: product._id ,
          name: product.name,
          image: product.images,
          price: product.currentPrice || product.price,
          discount: product.discount,
          description: product.description,
          isInStock: product.inStock,
          brand: product.brand,
          available: product.available
        },
        userId
      );
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
      }

    }
    
   
  };

  // Handle quantity increase
  const handleIncreaseQuantity = async () => {
    const cartItem = cartItems.find(item => item.productId._id === product._id);
    if (cartItem) {
      try {
        await updateQuantity(cartItem._id, currentQuantity + 1, userId);
      } catch (error) {
        console.error('Failed to increase quantity:', error);
      }
    } else {
      // If item not in cart, add it
      await handleAddToCart();
    }
  };

  // Handle quantity decrease
  const handleDecreaseQuantity = async () => {
    const cartItem = cartItems.find(item => item.productId._id === product._id);
    if (!cartItem) return;

    if (currentQuantity > 1) {
      try {
        await updateQuantity(cartItem._id, currentQuantity - 1, userId);
      } catch (error) {
        console.error('Failed to decrease quantity:', error);
      }
    } else {
      // If quantity is 1, remove the item from cart
      try {
        await removeItem(cartItem._id, userId);
      } catch (error) {
        console.error('Failed to remove item:', error);
      }
    }
  };

  // Check if this product is in cart
  const isInCart = currentQuantity > 0;

  return (
    <div className="space-y-6 bg-white p-[16px] md:p-[32px] rounded-lg shadow-sm ">
      {/* Badges */}
      
      

      <h1 className="text-[40px] font-semibold leading-[48px]">{product.title}</h1>
      <p className="text-[40px] font-semibold leading-[48px]">{product.name}</p>

      {/* Color Variants */}
      {product.colors && product.colors.length > 0 && (
        <div>
          <label className="block mb-2 font-bold text-gray-800">Color</label>
          <div className="flex gap-3">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition ${selectedColor === color ? "border-yellow-600 w-9 h-9" : "border-gray-300"}`}
              >
                <div className={`w-full h-full rounded-full ${getColorStyle(color)}`} />
              </button>
            ))}
          </div>
        </div>
      )}


<div className="flex gap-2 justify-start">
        {product.bestSeller && (
          <span className="flex justify-center items-center px-4 py-2 bg-[#cf2626] rounded-full text-white text-xs font-semibold">
            Best Seller
          </span>
        )}
        {product.newArrival && (
          <span className="flex justify-center items-center px-4 py-2 bg-[#6E1E2D]  rounded-[24px] text-white text-xs font-semibold">
            New Arrivals
          </span>
        )}
        <span className={`flex justify-center items-center px-4 py-2 rounded-full text-xs font-semibold gap-1.5 ${
          product.inStock 
            ? "text-green-700 bg-green-50 border-2 border-green-200" 
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
      {/* Quantity */}
      <div>
        <label className="block mb-2 font-bold text-gray-800">Quantity</label>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-40">
          <button 
            onClick={()=>{if(count>1 ){setCount(count-1)}}}
            disabled={!product.available}
            className="px-4 py-2 text-gray-600 bg-[#C9A040] hover:bg-[#b59853] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="flex-1 text-center font-bold">
            {count}
          </span>
          <button 
            onClick={()=>setCount(count+1)}
            disabled={!product.available}
            className="px-4 py-2 text-gray-600 bg-[#C9A040] hover:bg-[#b59853] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            +
          </button>
        </div>
        {/* {isInCart && (
          <p className="text-sm text-green-600 mt-1">
            {currentQuantity} in cart
          </p>
        )} */}
      </div>

      {/* Price */}
      <div className="flex items-baseline justify-start gap-1">
        <span className="text-[28px] font-bold text-gray-900">
          ${(product.currentPrice || product.price).toFixed(2) }
        </span>
        {/* {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-xl text-gray-500 line-through">
            ${product.originalPrice}
          </span>
        )} */}
        {product.discount!=undefined && product.discount > 0 && (
          <span className="text-[18px] font-semibold text-gray-600 line-through">
             ${(product.price *100/product.discount).toFixed(2)}
          </span>
        )}
        
      </div>

      {/* Add to Cart / Cart Actions */}
     
        <button 
          onClick={handleAddToCart} 
          disabled={!product.inStock || isSyncing}
          className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"
        >
          {isSyncing ? "Adding..." : product.inStock ? "Add To Cart" : "Out of Stock"}
        </button>
     
      
      <Link href="/pages/shoppingcart">
        <button className="w-full font-bold py-3 rounded-lg transition bg-gray-200 hover:bg-gray-300">
          View Cart ({getCartCount()})
        </button>
      </Link>
    </div>
  );
}