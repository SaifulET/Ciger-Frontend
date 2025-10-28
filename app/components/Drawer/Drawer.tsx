"use client";

import { useState, useEffect } from "react";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ShoppingCart02Icon } from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CartItem {
  id: number;
  brand: string;
  name: string;
  price: number;
  available: number;
  image: string;
  total: number;
}

interface CartDrawerProps {
  items: CartItem[];
  subtotal: number;
}

export default function CartDrawer({ items, subtotal }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [cartItems, setCartItems] = useState(items);
  const [agree, setAgree] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cartCount = cartItems.length;
  const router = useRouter();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleQuantityChange = (id: number, type: "inc" | "dec") => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              total:
                type === "inc"
                  ? item.total + item.price
                  : Math.max(item.price, item.total - item.price),
            }
          : item
      )
    );
  };

  const handleRemove = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handle animation mount/unmount
  useEffect(() => {
    if (isOpen) {
      setShowDrawer(true);
    }
  }, [isOpen]);

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setIsOpen(false), 300);
  };

  return (
    <>
      {/* 🛒 Button to open drawer */}
      <button onClick={() => setIsOpen(true)}>
        <div className="relative flex items-center justify-center gap-2 text-sm md:text-base font-semibold leading-6 px-4 md:px-6 py-3 md:py-5 rounded-lg md:bg-[#F5F5F5] hover:bg-gray-400 transition text-[#0C0C0C] flex-shrink-0">
          <HugeiconsIcon icon={ShoppingCart02Icon} />
          {cartCount > 0 && (
            <span className="absolute -top-2 md:-top-1 -right-1 bg-[#C9A040] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            onClick={closeDrawer}
            className={`absolute inset-0 bg-black transition-opacity duration-300 ${
              showDrawer ? "opacity-50" : "opacity-0"
            }`}
          ></div>

          {/* Drawer container - Different behavior for mobile vs desktop */}
          <div
            className={`relative h-full w-full bg-[#F9F9F9] shadow-2xl flex flex-col overflow-y-auto transform transition-all duration-300 ease-in-out ${
              isMobile
                ? `fixed bottom-0 left-0 right-0 max-h-[100vh]  ${
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
                <h2 className="text-[24px] md:text-[28px] font-semibold text-[#0C0C0C] font-montserrat">
                  Your Cart
                </h2>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={closeDrawer}
                  className="p-2 rounded-full bg-gray-200 flex justify-center items-center md:rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {router.push("/pages/shoppingcart");setIsOpen(false)}}
                  className="text-[16px] md:text-[18px] text-[#0C0C0C] font-openSans cursor-pointer text-left"
                >
                  View All
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col p-4 md:p-8 gap-4 md:gap-6 overflow-y-auto">
              {/* Subtotal + checkbox */}
              <div className="flex flex-col p-4 md:p-6 gap-4 md:gap-6 bg-white rounded-xl w-full">
                <div className="flex justify-between items-center">
                  <p className="text-[14px] md:text-[16px] font-semibold text-[#0C0C0C] font-openSans">
                    Subtotal
                  </p>
                  <p className="text-[14px] md:text-[16px] font-semibold text-[#0C0C0C] font-openSans">
                    ${subtotal.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="w-4 h-4 md:w-5 md:h-5 border border-[#B0B0B0] rounded-md bg-[#F5F5F5]"
                  />
                  <label className="text-[14px] md:text-[16px] text-[#0C0C0C] font-openSans">
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

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-t border-gray-200 pt-4"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="flex justify-center items-center w-6 h-6 md:w-8 md:h-8 bg-[#DD2C2C] rounded-xl flex-shrink-0"
                      >
                        <X className="text-white w-3 h-3 md:w-4 md:h-4" />
                      </button>

                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 md:w-[70px] md:h-[70px] bg-[#F5F5F5] border border-[#B0B0B0] rounded-xl flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={isMobile ? 30 : 50}
                            height={isMobile ? 30 : 50}
                            className="object-contain"
                          />
                        </div>

                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                          <p className="font-semibold text-[12px] md:text-[14px] font-openSans text-[#0C0C0C] truncate">
                            {item.brand}
                          </p>
                          <p className="text-[12px] md:text-[14px] text-[#0C0C0C] font-openSans truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center gap-1 flex-wrap">
                            <p className="text-[12px] md:text-[14px] font-semibold font-openSans">
                              ${item.price.toFixed(2)}
                            </p>
                            <p className="text-[10px] md:text-[12px] font-openSans text-gray-500">
                              ({item.available} Available)
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-2 mx-2">
                      <div className="flex items-center justify-between bg-[#F5F5F5] border border-[#C9A040] rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.id, "dec")}
                          className="flex justify-center items-center w-8 h-8 md:w-[36px] md:h-[36px] bg-[#C9A040] rounded-xl"
                        >
                          <Minus className="text-[#0C0C0C] w-3 h-3" />
                        </button>
                        <span className="text-[12px] md:text-[14px] font-semibold font-openSans w-6 md:w-8 text-center">
                          {Math.round(item.total / item.price)}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, "inc")}
                          className="flex justify-center items-center w-8 h-8 md:w-[36px] md:h-[36px] bg-[#C9A040] rounded-xl"
                        >
                          <Plus className="text-[#0C0C0C] w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <p className="text-[12px] md:text-[14px] font-openSans w-12 md:w-[60px] text-right truncate">
                      ${item.total.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 w-full mt-4 md:mt-6">
                <Link href="/pages/shoppingcart" className="w-full">
                  <button
                    className="w-full bg-white rounded-xl py-3 text-[14px] md:text-[16px] font-semibold font-openSans border border-gray-300"
                    onClick={closeDrawer}
                  >
                    Clear Cart
                  </button>
                </Link>
                <Link href="/pages/checkout" className="w-full">
                  <button
                    className="w-full bg-[#C9A040] rounded-xl py-3 text-[14px] md:text-[16px] font-semibold font-openSans text-white"
                    onClick={closeDrawer}
                  >
                    Checkout
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