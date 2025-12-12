// components/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/app/store/cartStore";
import useUserStore from "@/app/store/userStore";
import productImage from "@/public/product2.jpg"

// Add a fallback image
const FALLBACK_IMAGE = "";

// Define proper type for image source
type ImageSource = string | string[] | null | undefined;

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const router = useRouter();
  
  // Get cart state and actions
  const { 
    items: cartItems, 
    isLoading,
    isSyncing,
    getCartCount, 
    getFormattedSubtotal, 
    updateQuantity, 
    removeItem,
    clearCart,
    initializeCart,
    guestId,
  } = useCartStore();
  // Get user state
  const { user } = useUserStore();
 

  const userId = user ||guestId|| null;

  const cartCount = getCartCount();
  const subtotal = getFormattedSubtotal();

  // Initialize cart when component mounts or user changes
  useEffect(() => {
    
    initializeCart(userId);
  }, [userId, initializeCart]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleQuantityChange = async (cartItemId: string, type: "inc" | "dec") => {
    const item = cartItems.find(item => item._id === cartItemId);
    if (!item) return;

    const newQuantity = type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);
    
    // Debug logging
    console.log('Quantity change:', {
      cartItemId,
      currentQuantity: item.quantity,
      newQuantity,
      type
    });
    
    try {
      await updateQuantity(cartItemId, newQuantity, userId);
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeItem(cartItemId, userId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(userId);
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  // Handle animation
  useEffect(() => {
    if (isOpen) setShowDrawer(true);
  }, [isOpen]);

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      {/* Cart Button */}
      <button onClick={() => setIsOpen(true)} disabled={isLoading}>
        <div className="relative flex items-center justify-center gap-2 text-sm md:text-base font-semibold leading-6 px-4 md:px-6 py-3 md:py-5 rounded-lg md:bg-[#F5F5F5] hover:bg-gray-400 transition text-[#0C0C0C] flex-shrink-0">
          <HugeiconsIcon icon={ShoppingCart02Icon} />
          {(cartCount > 0 || isLoading) && (
            <span className="absolute -top-2 md:-top-1 -right-1 bg-[#C9A040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount === 0 ? "" : cartCount}
            </span>
          )}
        </div>
      </button>

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            onClick={closeDrawer}
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              showDrawer ? "opacity-50" : "opacity-0"
            }`}
          ></div>

          <div
            className={`relative h-full w-full bg-[#F9F9F9] shadow-2xl flex flex-col overflow-y-auto transform transition-all duration-300 ease-in-out ${
              isMobile
                ? `fixed bottom-0 left-0 right-0 max-h-[100vh] ${
                    showDrawer ? "translate-y-0" : "translate-y-full"
                  }`
                : `ml-auto w-full sm:w-[500px] md:w-[700px] lg:w-[800px] ${
                    showDrawer ? "translate-x-0" : "translate-x-full"
                  }`
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 md:p-8 bg-white border-b border-gray-200 sticky top-0 z-10">
              <div>
                <h2 className="text-[28px] md:text-[28px] font-semibold text-[#0C0C0C] font-montserrat">
                  Your Cart 
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {isSyncing ? "Updating..." : `${cartCount} items`}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={closeDrawer} className="p-2 rounded-full bg-gray-200 flex justify-center items-center md:rounded-xl">
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {router.push("/pages/shoppingcart");setIsOpen(false)}}
                  className="text-[14px] text-[#0C0C0C] font-openSans cursor-pointer text-left"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-4 md:p-8 gap-4 md:gap-6 overflow-y-auto">
              {/* Subtotal */}
              <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-white rounded-xl w-full">
                <div className="flex justify-between items-center">
                  <p className="text-[14px] md:text-[16px] font-semibold text-[#0C0C0C] font-openSans">
                    Subtotal
                  </p>
                  <p className="text-[14px] md:text-[16px] font-semibold text-[#0C0C0C] font-openSans">
                    {subtotal}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 border border-[#B0B0B0] rounded-md bg-[#F5F5F5]"
                  />
                  <label className="text-[14px] text-[#0C0C0C] font-openSans">
                    I agree to the terms and refund policy
                  </label>
                </div>
              </div>

              {/* Product List */}
              <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-white rounded-xl w-full">
                <div className="flex justify-between items-start">
                  <p className="text-[16px] md:text-[18px] font-semibold text-[#0C0C0C] font-montserrat">
                    Products
                  </p>
                  <p className="text-[16px] md:text-[18px] font-semibold text-[#0C0C0C] font-montserrat">
                    Qty
                  </p>
                  <p className="text-[16px] md:text-[18px] font-semibold text-[#0C0C0C] font-montserrat">
                    Total
                  </p>
                </div>

                {cartItems.map((item) => {
                  const safeImageSrc = getSafeImageSrc(item.productId.image);
                  const productName = item.productId.name || "Product Name";
                  const brandName = item?.productId?.brandId?.name;
                  const unitPrice = item.productId.price || 0;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={item._id}
                      className="flex justify-between items-center border-t border-gray-200 pt-4"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => handleRemove(item._id)}
                          disabled={isSyncing}
                          className="flex justify-center items-center w-6 h-6 md:w-8 md:h-8 bg-[#DD2C2C] rounded-xl flex-shrink-0 disabled:opacity-50"
                        >
                          <X className="text-white w-3 h-3 md:w-4 md:h-4" />
                        </button>

                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="flex items-center justify-center w-12 h-12 md:w-[70px] md:h-[70px] bg-[#F5F5F5] border border-[#B0B0B0] rounded-xl flex-shrink-0">
                           {safeImageSrc && <Image
                              src={safeImageSrc}
                              alt={productName}
                              width={isMobile ? 30 : 50}
                              height={isMobile ? 30 : 50}
                              className="object-contain"
                              onError={handleImageError}
                            />}
                           {!safeImageSrc &&<Image
                              src={productImage}
                              alt={productName}
                              width={isMobile ? 30 : 50}
                              height={isMobile ? 30 : 50}
                              className="object-contain"
                              onError={handleImageError}
                            />}

                          </div>

                          <div className="flex flex-col gap-1 min-w-0 flex-1">
                            <p className="font-semibold text-[12px] md:text-[14px] font-openSans text-[#0C0C0C] truncate">
                              {brandName}
                            </p>
                            <p className="text-[12px] md:text-[14px] text-[#0C0C0C] font-openSans truncate">
                              {productName}
                            </p>
                            <div className="flex items-center gap-1 flex-wrap">
                              <p className="text-[12px] md:text-[14px] font-semibold font-openSans">
                                ${unitPrice.toFixed(2)}
                              </p>
                              <p className="text-[10px] md:text-[12px] font-openSans text-gray-500">
                                {item.productId.isInStock ? "In Stock" : "Out of Stock"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center gap-2 mx-2">
                        <div className="flex items-center justify-between bg-[#F5F5F5] border border-[#C9A040] rounded-xl">
                          <button
                            onClick={() => handleQuantityChange(item._id, "dec")}
                            disabled={isSyncing || item.quantity <= 1}
                            className="flex justify-center items-center w-8 h-8 md:w-[36px] md:h-[36px] bg-[#C9A040] rounded-xl disabled:opacity-50"
                          >
                            <Minus className="text-[#0C0C0C] w-3 h-3" />
                          </button>
                          <span className="text-[12px] md:text-[14px] font-semibold font-openSans w-6 md:w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item._id, "inc")}
                            disabled={isSyncing}
                            className="flex justify-center items-center w-8 h-8 md:w-[36px] md:h-[36px] bg-[#C9A040] rounded-xl disabled:opacity-50"
                          >
                            <Plus className="text-[#0C0C0C] w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <p className="text-[12px] md:text-[14px] font-openSans w-12 md:w-[60px] text-right truncate">
                        ${itemTotal.toFixed(2)}
                      </p>
                    </div>
                  );
                })}

                {cartItems.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full mt-4 md:mt-6">
                <button
                  onClick={handleClearCart}
                  disabled={cartItems.length === 0 || isSyncing}
                  className="w-full bg-white rounded-xl py-3 text-[14px] md:text-[16px] font-semibold font-openSans border border-gray-300 disabled:opacity-50"
                >
                  {isSyncing ? "Clearing..." : "Clear Cart"}
                </button>
                <Link href="/pages/checkout" className="w-full">
                  <button
                    onClick={closeDrawer}
                    disabled={cartItems.length === 0 || !agree || isSyncing}
                    className="w-full bg-[#C9A040] rounded-xl py-3 text-[14px] md:text-[16px] font-semibold font-openSans text-white disabled:opacity-50"
                  >
                    {isSyncing ? "Processing..." : "Checkout"}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}