// components/ShoppingCart.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useCartStore } from "@/app/store/cartStore";
import useUserStore from "@/app/store/userStore";
import api from "@/lib/axios";

// Add a fallback image (optional)
const FALLBACK_IMAGE = "";

// Update the type to include string arrays
type ImageSource = string | string[] | null | undefined;

export default function ShoppingCart() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  
  // Get cart state and actions from Zustand store
  const { 
    items, 
    isLoading,
    isSyncing,
    getCartCount, 
    getSubtotal, 
    updateQuantity, 
    getFormattedSubtotal,
    removeItem,
    clearCart,
    initializeCart,
    guestId
  } = useCartStore();
  
  // Get user state
  const { user } = useUserStore();
  const userId = user ||guestId|| null;
  const subprice = getFormattedSubtotal();

  // Initialize cart when component mounts
  useEffect(() => {
    initializeCart(userId);
  }, [userId, initializeCart]);

  // Helper function to get safe image source with proper typing
  const getSafeImageSrc = (image: ImageSource): string => {
    if (!image) return FALLBACK_IMAGE;
    
    // If image is a string and looks like a valid URL or path
    if (typeof image === 'string' && image.trim() !== '') {
      return image;
    }
    
    // If image is an array, use the first image
    if (Array.isArray(image) && image.length > 0 && typeof image[0] === 'string' && image[0].trim() !== '') {
      return image[0];
    }
    
    return FALLBACK_IMAGE;
  };

  // Helper function to handle image error with proper typing
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_IMAGE;
  };

  const toggleCheck = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const removeChecked = () => {
    checkedItems.forEach(cartItemId => {
      removeItem(cartItemId, userId);
    });
    setCheckedItems(new Set());
  };

  const handleClearCart = () => {
    clearCart(userId);
    setCheckedItems(new Set());
  };

  const handleRemoveItem = (cartItemId: string) => {
    removeItem(cartItemId, userId);
    const newChecked = new Set(checkedItems);
    newChecked.delete(cartItemId);
    setCheckedItems(newChecked);
  };
console.log("93",checkedItems,"93");
  const handleUpdateQuantity = (cartItemId: string, action: "increase" | "decrease") => {
    const item = items.find(item => item._id === cartItemId);
    if (!item) return;

    let newQuantity = item.quantity;
    if (action === "increase") {
      newQuantity = item.quantity + 1;
    } else {
      newQuantity = Math.max(1, item.quantity - 1);
    }
    
    updateQuantity(cartItemId, newQuantity, userId);
  };

  const handleCheckout =async () => {
    if (checkedItems.size === 0) {
      alert("Please select items to checkout");
      return;
    }
    
    const checkoutData = {
      selectedItemIds: Array.from(checkedItems),
      items: items.filter((item) => checkedItems.has(item._id)),
      timestamp: new Date().toISOString(),
    };
    
    console.log("Checkout Data:", checkoutData);
      const checkedId=await api.post("/cart/checkedid",{cartIds:checkoutData.selectedItemIds,userId:userId});
      if(checkedId.data){
         setTimeout(() => {
      window.location.href = "/pages/checkout";
    }, 100);
      }
   
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-lg p-[16px] md:p-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-lg p-[16px] md:p-0">
      <div className="max-w-full">
        {/* Header with title and buttons */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row gap-[16px] md:gap-[32px] justify-between items-start md:items-center">
              <h1 className="text-[28px] font-bold text-gray-900">
                Shopping Cart {isSyncing && "(Syncing...)"}
              </h1>
              <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 w-full md:w-auto">
                <button
                  onClick={removeChecked}
                  disabled={checkedItems.size === 0 || isSyncing}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Remove Checked
                </button>
                <button
                  onClick={handleClearCart}
                  disabled={items.length === 0 || isSyncing}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={checkedItems.size === 0 || isSyncing}
                  className="flex-1 md:flex-none px-4 py-2 bg-[#C9A040] text-gray-900 font-bold text-sm md:text-base rounded-md hover:bg-[#9a7b34] disabled:opacity-95 disabled:cursor-not-allowed transition-colors"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {items.length > 0 ? (
          <div className="p-[16px] md:p-[32px] space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-200 font-bold text-gray-700 text-sm">
              <div className="col-span-1">Select</div>
              <div className="col-span-1 pl-[16px]">Image</div>
              <div className="col-span-3">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Cart Items */}
            {items.map((item) => (
              <div key={item._id} className="space-y-2 md:space-y-0">
                {/* Mobile View */}
                <div className="md:hidden bg-gray-50 p-4 rounded-lg border border-gray-200">
                  {/* Top row with checkbox and delete button */}
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checkedItems.has(item._id)}
                        onChange={() => toggleCheck(item._id)}
                        className="w-5 h-5 cursor-pointer"
                        disabled={isSyncing}
                      />
                      <div className="flex items-center justify-center w-12 h-12 md:w-[70px] md:h-[70px] bg-[#F5F5F5] border border-[#B0B0B0] rounded-xl flex-shrink-0">
                        <Image
                          src={getSafeImageSrc(item.productId.image)}
                          alt={ "Blank"}
                          width={30}
                          height={30}
                          className="object-contain"
                          onError={handleImageError}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isSyncing}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content in column layout */}
                  <div className="flex flex-col text-left space-y-3">
                    <div>
                      <p className="font-semibold text-base leading-6">
                        {item.productId.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.productId.description || "Product description"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.productId.isInStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>

                    {/* Price, Quantity, Total in column */}
                    <div className="flex flex-col space-y-2">
                      <div className="flex justify-between items-center border-b pb-1">
                        <p className="text-gray-600">Price</p>
                        <p className="font-semibold text-gray-900">
                          ${(item.productId.price || 0).toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-center border-b pb-1">
                        <p className="text-gray-600">Quantity</p>
                        <div className="flex gap-0 border rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item._id, "decrease")}
                            disabled={isSyncing || item.quantity <= 1}
                            className="w-8 h-8 bg-[#C9A040] rounded-lg hover:bg-[#9b7a2f] text-sm font-bold disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-sm border-gray-300 flex justify-center items-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item._id, "increase")}
                            disabled={isSyncing}
                            className="w-8 h-8 bg-[#C9A040] hover:bg-[#a78435] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold rounded-lg"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">Total</p>
                        <p className="font-semibold text-gray-900">
                          ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-4 py-4 px-2 border-b border-gray-200 items-center hover:bg-gray-50">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item._id)}
                      onChange={() => toggleCheck(item._id)}
                      className="w-5 h-5 cursor-pointer"
                      disabled={isSyncing}
                    />
                  </div>
                  <div className="col-span-1 flex justify-start">
                    <div className="flex items-center justify-center w-12 h-12 md:w-[70px] md:h-[70px] bg-[#F5F5F5] border border-[#B0B0B0] rounded-xl flex-shrink-0">
                      <Image
                        src={getSafeImageSrc(item.productId.image)}
                        alt={item.productId.name || "Product image"}
                        width={30}
                        height={30}
                        className="object-contain"
                        onError={handleImageError}
                      />
                    </div>
                  </div>
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.productId.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      {item.productId.description || "Product description"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {item.productId.isInStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold text-gray-900">
                    ${(item.productId.price || 0).toFixed(2)}
                  </div>
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center gap-0 border border-gray-300 rounded-full font-semibold text-base text-center">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, "decrease")}
                        disabled={isSyncing || item.quantity <= 1}
                        className="w-12 h-12 bg-[#C9A040] hover:bg-[#ab8938] font-semibold text-base rounded-lg disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-base border-l border-r border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, "increase")}
                        disabled={isSyncing}
                        className="w-12 h-12 bg-[#C9A040] hover:bg-[#ab8938] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold text-gray-900">
                    ${((item.productId.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={isSyncing}
                      className="text-red-600 hover:text-red-800 disabled:opacity-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Total Summary */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Selected Items: {checkedItems.size}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Total amount for selected items
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    {subprice}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Subtotal
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-4 md:px-8 py-12 text-center">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        )}
      </div>
    </div>
  );
}