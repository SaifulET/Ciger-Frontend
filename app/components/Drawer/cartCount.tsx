// components/CartDrawer.tsx
"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus, ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02FreeIcons, ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/store/cartStore";
import useUserStore from "@/app/store/userStore";
import productImage from "@/public/product2.jpg";
import api from "@/lib/axios";

// Add a fallback image
const FALLBACK_IMAGE = "";

// Define proper type for image source
type ImageSource = string | string[] | null | undefined;

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showExceededMessage, setShowExceededMessage] = useState<string | null>(
    null
  );

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

  const userId = user || guestId || null;

  const cartCount = getCartCount();
  const subtotal = getFormattedSubtotal();

  // Initialize cart when component mounts or user changes
  useEffect(() => {
    initializeCart(userId);
  }, [userId, initializeCart]);

  // Mobile detection with better breakpoints
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768); // Mobile: < 768px
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Hide exceeded message after 3 seconds
  useEffect(() => {
    if (showExceededMessage) {
      const timer = setTimeout(() => {
        setShowExceededMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showExceededMessage]);

  // Helper function to get safe image source with proper typing
  const getSafeImageSrc = (image: ImageSource): string => {
    if (!image) return FALLBACK_IMAGE;

    // If image is a string and looks like a valid URL or path
    if (typeof image === "string" && image.trim() !== "") {
      return image;
    }

    // If image is an array, use the first image
    if (
      Array.isArray(image) &&
      image.length > 0 &&
      typeof image[0] === "string" &&
      image[0].trim() !== ""
    ) {
      return image[0];
    }

    return FALLBACK_IMAGE;
  };

  // Helper function to handle image error with proper typing
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_IMAGE;
  };

  const handleQuantityChange = async (
    cartItemId: string,
    type: "inc" | "dec"
  ) => {
    const item = cartItems.find((item) => item._id === cartItemId);
    if (!item) return;

    const newQuantity =
      type === "inc" ? item.quantity + 1 : Math.max(1, item.quantity - 1);

    // Check if trying to exceed available stock
    if (type === "inc" && newQuantity > item.productId.available) {
      setShowExceededMessage(
        `Only ${item.productId.available} items available in stock`
      );
      return;
    }

    try {
      await updateQuantity(cartItemId, newQuantity, userId);
    } catch (error) {
      
      setShowExceededMessage("Failed to update quantity. Please try again.");
    }
  };

  const handleRemove = async (cartItemId: string) => {
    try {
      await removeItem(cartItemId, userId);
    } catch (error) {
      setShowExceededMessage("Failed to remove item. Please try again.");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart(userId);
    } catch (error) {

      setShowExceededMessage("Failed to clear cart. Please try again.");
    }
  };

  // Handle animation
  useEffect(() => {
    if (isOpen) {
      setShowDrawer(true);
    }
  }, [isOpen]);

  const checked = async () => {
    try {
      const res = await api.get("/cart/allCheckout/" + userId);
      
      closeDrawer();
    } catch (error) {
      
      setShowExceededMessage("Checkout failed. Please try again.");
    }
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  // Check if product is out of stock
  const isProductOutOfStock = (item: any) => {
    return !item.productId.isInStock || item.productId.available <= 0;
  };

  const hasExceededStockItems = () => {
    return cartItems.some(
      (item) => !isProductOutOfStock(item) && hasExceededStock(item)
    );
  };
  // Check if quantity exceeds available stock
  const hasExceededStock = (item: any) => {
    return item.quantity > item.productId.available;
  };

  return (
    <>
      {/* Cart Button */}
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="relative"
        aria-label="Open cart"
      >
        <div className="relative flex items-center justify-center gap-2 text-sm md:text-base font-semibold leading-6 px-3 md:px-6 py-2 md:py-3 rounded-lg lg:bg-[#F5F5F5] hover:bg-gray-400 transition text-[#0C0C0C] flex-shrink-0">
          <HugeiconsIcon 
            icon={ShoppingCart02Icon} 
            className="w-6 h-6 md:w-6 md:h-6 lg:w-8 lg:md:h-8"
          />
          {(cartCount > 0 || isLoading) && (
            <span className="absolute -top-1.5 md:-top-1 -right-1 bg-[#C9A040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount === 0 ? "" : cartCount}
            </span>
          )}
        </div>
      </button>

      {/* Exceeded Stock Message - Mobile Optimized */}
      {showExceededMessage && (
        <div className="fixed top-4 left-4 right-4 z-[100] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg animate-fade-in md:left-1/2 md:transform md:-translate-x-1/2 md:max-w-md">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm md:text-base break-words">{showExceededMessage}</span>
          </div>
        </div>
      )}

      {/* Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            onClick={closeDrawer}
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              showDrawer ? "opacity-50" : "opacity-0"
            }`}
            aria-hidden="true"
          ></div>

          {/* Drawer Content - Full Screen on Mobile */}
          <div
            className={`relative h-full w-full bg-[#F9F9F9] shadow-2xl flex flex-col overflow-hidden transform transition-all duration-300 ease-in-out ${
              isMobile
                ? `fixed inset-0 ${
                    showDrawer ? "translate-y-0" : "translate-y-full"
                  }`
                : `ml-auto w-full sm:w-[500px] md:w-[700px] lg:w-[800px] ${
                    showDrawer ? "translate-x-0" : "translate-x-full"
                  }`
            }`}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Mobile Header with Close Button */}
            {isMobile && (
              <div className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white border-b border-gray-200 flex-shrink-0">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-[#0C0C0C] font-montserrat">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isSyncing ? "Updating..." : `${cartCount} items`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      router.push("/pages/shoppingcart");
                      closeDrawer();
                    }}
                    className="flex items-center text-sm text-[#0C0C0C] font-openSans cursor-pointer hover:text-[#C9A040] transition-colors"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <button
                    onClick={closeDrawer}
                    className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 flex justify-center items-center transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Header */}
            {!isMobile && (
              <div className="flex justify-between items-center p-6 lg:p-8 bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
                <div className="flex-1">
                  <h2 className="text-2xl lg:text-[28px] font-semibold text-[#0C0C0C] font-montserrat">
                    Your Cart
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {isSyncing ? "Updating..." : `${cartCount} items`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      router.push("/pages/shoppingcart");
                      closeDrawer();
                    }}
                    className="flex items-center text-sm text-[#0C0C0C] font-openSans cursor-pointer hover:text-[#C9A040] transition-colors"
                  >
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <button
                    onClick={closeDrawer}
                    className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 flex justify-center items-center transition-colors"
                    aria-label="Close cart"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Scrollable Content Area - Fixed height calculation */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col p-4 md:p-6 lg:p-8 gap-4 md:gap-6 min-h-full">
                {/* Subtotal */}
                <div className="flex flex-col p-4 md:p-6 gap-3 md:gap-4 bg-white rounded-xl w-full shadow-sm">
                  <div className="flex justify-between items-center">
                    <p className="text-sm md:text-base font-semibold text-[#0C0C0C] font-openSans">
                      Subtotal
                    </p>
                    <p className="text-sm md:text-base font-semibold text-[#0C0C0C] font-openSans">
                      {subtotal}
                    </p>
                  </div>

                  <div className="flex items-start gap-2 md:gap-3 pt-2 border-t border-gray-100">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      className="w-4 h-4 md:w-5 md:h-5 border border-[#B0B0B0] rounded-md bg-[#F5F5F5] mt-0.5 flex-shrink-0"
                    />
                    <label 
                      htmlFor="terms-checkbox"
                      className="text-xs md:text-sm text-[#0C0C0C] font-openSans cursor-pointer select-none"
                    >
                      I agree to the terms and refund policy
                    </label>
                  </div>
                </div>

                {/* Product List */}
                <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-white rounded-xl w-full shadow-sm">
                  <div className="flex justify-between items-center">
                    <p className="text-base md:text-lg font-semibold text-[#0C0C0C] font-montserrat">
                      Products
                    </p>
                    <p className="text-base md:text-lg font-semibold text-[#0C0C0C] font-montserrat">
                      Qty
                    </p>
                  </div>

                  {cartItems.map((item) => {
                    const safeImageSrc = getSafeImageSrc(item.productId.image);
                    const productName = item.productId.name || "Product Name";
                    const brandName = item?.productId?.brandId?.name;
                    const unitPrice = item.productId.price || 0;
                    const itemTotal = unitPrice * item.quantity;
                    const isOutOfStock = isProductOutOfStock(item);
                    const hasExceeded = hasExceededStock(item);

                    return (
                      <div
                        key={item._id}
                        className="relative border-t border-gray-100 pt-4 pb-3"
                      >
                        {/* Out of Stock Overlay */}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-gray-100/90 backdrop-blur-[2px] z-10 rounded-xl flex items-center justify-center">
                            <div className="bg-red-500 text-white px-3 py-1.5 rounded-lg font-semibold text-sm">
                              Out of Stock
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-3">
                          {/* Top Row: X, Image, Brand, and Quantity Controls */}
                          <div className="flex items-center justify-between gap-2">
                            {/* Left side: X, Image, Brand info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* X Button */}
                              <button
                                onClick={() => handleRemove(item._id)}
                                disabled={isSyncing || isOutOfStock}
                                className={`flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg flex justify-center items-center disabled:opacity-50 ${
                                  isOutOfStock ? "bg-gray-400" : "bg-[#DD2C2C] hover:bg-red-600"
                                } transition-colors`}
                                aria-label={`Remove ${productName}`}
                              >
                                <X className="text-white w-3 h-3 md:w-3.5 md:h-3.5" />
                              </button>

                              {/* Image */}
                              <div
                                className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden ${
                                  isOutOfStock
                                    ? "bg-gray-100"
                                    : "bg-[#F5F5F5]"
                                }`}
                              >
                                {safeImageSrc ? (
                                  <Image
                                    src={safeImageSrc}
                                    alt={productName}
                                    width={56}
                                    height={56}
                                    className={`object-cover w-full h-full ${
                                      isOutOfStock ? "opacity-50" : ""
                                    }`}
                                    onError={handleImageError}
                                  />
                                ) : (
                                  <Image
                                    src={productImage}
                                    alt={productName}
                                    width={56}
                                    height={56}
                                    className={`object-cover w-full h-full ${
                                      isOutOfStock ? "opacity-50" : ""
                                    }`}
                                    onError={handleImageError}
                                  />
                                )}
                              </div>

                              {/* Product Details */}
                              <div className="flex flex-col gap-1 min-w-0 flex-1">
                                <p className="font-semibold text-xs md:text-sm font-openSans text-[#0C0C0C] truncate">
                                  {brandName}
                                </p>
                                <p
                                  className={`text-xs md:text-sm font-openSans line-clamp-2 ${
                                    isOutOfStock
                                      ? "text-gray-500"
                                      : "text-[#0C0C0C]"
                                  }`}
                                >
                                  {productName}
                                </p>
                                <div className="flex flex-col gap-0.5">
                                  <p
                                    className={`text-xs md:text-sm font-semibold font-openSans ${
                                      isOutOfStock ? "text-gray-500" : ""
                                    }`}
                                  >
                                    ${unitPrice.toFixed(2)}
                                  </p>
                                  <p
                                    className={`text-xs font-openSans ${
                                      isOutOfStock
                                        ? "text-red-500 font-semibold"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {isOutOfStock
                                      ? "Out of Stock"
                                      : `Available: ${item.productId.available}`}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Right side: Quantity Controls */}
                            <div className="flex-shrink-0">
                              <div
                                className={`flex items-center justify-between border rounded-lg ${
                                  isOutOfStock
                                    ? "bg-gray-100 border-gray-300"
                                    : "bg-[#F5F5F5] border-[#C9A040]"
                                }`}
                              >
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item._id, "dec")
                                  }
                                  disabled={
                                    isSyncing || item.quantity <= 1 || isOutOfStock
                                  }
                                  className={`flex justify-center items-center w-8 h-8 md:w-9 md:h-9 rounded-lg disabled:opacity-50 ${
                                    isOutOfStock
                                      ? "bg-gray-300"
                                      : "bg-[#C9A040] hover:bg-[#a78435]"
                                  } transition-colors`}
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="text-white w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                                <span
                                  className={`text-sm md:text-base font-semibold font-openSans w-8 md:w-10 text-center ${
                                    isOutOfStock ? "text-gray-500" : ""
                                  }`}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    handleQuantityChange(item._id, "inc")
                                  }
                                  disabled={
                                    isSyncing ||
                                    item.quantity >= item.productId.available ||
                                    isOutOfStock
                                  }
                                  className={`flex justify-center items-center w-8 h-8 md:w-9 md:h-9 rounded-lg disabled:opacity-50 ${
                                    isOutOfStock
                                      ? "bg-gray-300"
                                      : "bg-[#C9A040] hover:bg-[#a78435]"
                                  } transition-colors`}
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="text-white w-3 h-3 md:w-3.5 md:h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Bottom Row: Total Price and Warnings */}
                          <div className="flex items-center justify-between">
                            {/* Left side: Item Total */}
                            <div className="pl-25 md:pl-28">
                              <p
                                className={`text-sm md:text-base font-semibold font-openSans ${
                                  isOutOfStock ? "text-gray-500" : "text-[#0C0C0C]"
                                }`}
                              >
                                Total: <span className="text-[#C9A040]">${itemTotal.toFixed(2)}</span>
                              </p>
                            </div>

                            {/* Right side: Exceeded Stock Warning */}
                            {hasExceeded && !isOutOfStock && (
                              <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-lg">
                                <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>Exceeds stock ({item.productId.available} available)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {cartItems.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-base md:text-lg mb-2">Your cart is empty</p>
                      <p className="text-gray-400 text-sm mb-6">Add items to get started</p>
                      <button
                        onClick={closeDrawer}
                        className="px-6 py-3 bg-[#C9A040] text-white font-semibold text-base rounded-lg hover:bg-[#a78435] transition-colors"
                      >
                        Continue Shopping
                      </button>
                    </div>
                  )}
                </div>

                {/* Spacer for when there are no action buttons */}
                {cartItems.length === 0 && <div className="h-20"></div>}
              </div>
            </div>

            {/* Action Buttons - Fixed at bottom */}
            {cartItems.length > 0 && (
              <div className="sticky bottom-0 bg-[#F9F9F9] pt-4 pb-6 md:pb-8 border-t border-gray-200 flex-shrink-0">
                <div className="px-4 md:px-6 lg:px-8">
                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                      onClick={handleClearCart}
                      disabled={cartItems.length === 0 || isSyncing}
                      className="w-full bg-white rounded-xl py-4 text-sm md:text-base font-semibold font-openSans border border-gray-300 disabled:opacity-50 hover:bg-gray-50 transition-colors active:bg-gray-100"
                    >
                      {isSyncing ? "Clearing..." : "Clear Cart"}
                    </button>

                    <button
  onClick={async () => {
    try {
      await checked(); // First call checked()
      
      // Check if we're already on the checkout page
      const isCheckoutPage = window.location.pathname.includes('/checkout');
      
      if (isCheckoutPage) {
        // If already on checkout page, fully reload the page
        window.location.reload(); // true forces a reload from server
      } else {
        // If not on checkout page, navigate to it
        router.push("/pages/checkout");
      }
    } catch (error) {
      // Handle errors if needed
      console.error("Error during checkout:", error);
    }
  }}
  disabled={
    cartItems.length === 0 ||
    !agree ||
    isSyncing ||
    hasExceededStockItems()
  }
  className="w-full bg-[#C9A040] rounded-xl py-4 text-sm md:text-base font-semibold font-openSans text-white disabled:opacity-50 hover:bg-[#a78435] transition-colors active:bg-[#95742e]"
>
  {isSyncing ? "Processing..." : "Checkout"}
</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add CSS animation for fade-in */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        /* For tablets and desktops */
        @media (min-width: 768px) {
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translate(-50%, -20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }
        }
        
        /* Line clamp for product name */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}