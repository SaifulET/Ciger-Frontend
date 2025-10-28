"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  available: number;
}

const cartData: CartItem[] = [
  {
    id: 1,
    image: "🏷️",
    name: "Iced Khunar",
    description: "Cold Ice Moricha Frozen - 16 Bag",
    price: 618.0,
    quantity: 1,
    available: 5,
  },
  {
    id: 2,
    image: "🏷️",
    name: "Iced Khunar",
    description: "Cold Ice Moricha Frozen - 16 Bag",
    price: 618.0,
    quantity: 1,
    available: 3,
  },
];

export default function ShoppingCart() {
  const [items, setItems] = useState<CartItem[]>(cartData);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (id: number) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const removeChecked = () => {
    setCheckedItems(new Set());
  };

  const clearCart = () => {
    const newItems = items.filter((item) => !checkedItems.has(item.id));
    setItems(newItems);
    setCheckedItems(new Set());
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
    const newChecked = new Set(checkedItems);
    newChecked.delete(id);
    setCheckedItems(newChecked);
  };

  const updateQuantity = (id: number, action: "increase" | "decrease") => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          let newQuantity = item.quantity;
          if (action === "increase") {
            if (item.quantity < item.available) {
              newQuantity = item.quantity + 1;
            }
          } else {
            newQuantity = Math.max(1, item.quantity - 1);
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    if (checkedItems.size === 0) {
      alert("Please select items to checkout");
      return;
    }
    const checkoutData = {
      selectedItemIds: Array.from(checkedItems),
      items: items.filter((item) => checkedItems.has(item.id)),
      timestamp: new Date().toISOString(),
    };
    console.log("Checkout Data:", checkoutData);
    setTimeout(() => {
      window.location.href = "/pages/checkout";
    }, 100);
  };

  const calculateTotal = () => {
    return items
      .filter((item) => checkedItems.has(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg">
      <div className="max-w-full ">
        {/* Header with title and buttons */}
        <div className="border-b border-gray-200 bg-white rounded-t-lg">
          <div className="px-4 md:px-8 py-4 md:py-6">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4 justify-between items-start md:items-center">
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-0">
                Shopping Cart
              </h1>
              <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-4 w-full md:w-auto">
                <button
                  onClick={removeChecked}
                  disabled={checkedItems.size === 0}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Remove Checked
                </button>
                <button
                  onClick={clearCart}
                  disabled={checkedItems.size === 0}
                  className="flex-1 md:flex-none px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 font-medium text-sm md:text-base rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={checkedItems.size === 0}
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
          <div className="px-4 md:px-8 py-6 space-y-4">
            {/* Desktop Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b-2 border-gray-200 font-bold text-gray-700 text-sm">
              <div className="col-span-1">Select</div>
              <div className="col-span-1">Image</div>
              <div className="col-span-3">Product</div>
              <div className="col-span-2 text-center">Unit Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {/* Cart Items */}
            {items.map((item) => (
              <div key={item.id} className="space-y-2 md:space-y-0">
                {/* Mobile View */}
                <div className="md:hidden bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex gap-3 mb-3 items-start">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 mt-1 cursor-pointer"
                    />
                    <span className="text-3xl">{item.image}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-base leading-6">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {item.available}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 mt-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="font-semibold text-base leading-6 text-gray-900">
                        ₹{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Qty</p>
                      <div className="flex justify-center gap-0 mt-1 border border-gray-300 rounded w-fit mx-auto">
                        <button
                          onClick={() => updateQuantity(item.id, "decrease")}
                          className="w-8 h-8 bg-[#C9A040] hover:bg-[#9b7a2f] text-sm font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-semibold text-sm border-l border-r border-gray-300">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, "increase")}
                          disabled={item.quantity >= item.available}
                          className="w-8 h-8 bg-[#C9A040] hover:bg-[#a78435] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:grid grid-cols-12 gap-4 py-4 px-2 border-b border-gray-200 items-center hover:bg-gray-50">
                  <div className="col-span-1">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleCheck(item.id)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </div>
                  <div className="col-span-1 text-2xl">{item.image}</div>
                  <div className="col-span-3">
                    <p className="font-semibold text-gray-900 text-sm">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Available: {item.available}
                    </p>
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </div>
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center gap-0 border border-gray-300 rounded font-semibold text-base text-center">
                      <button
                        onClick={() => updateQuantity(item.id, "decrease")}
                        className="w-12 h-12 bg-[#C9A040] hover:bg-[#ab8938] font-semibold text-base"
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-semibold text-base border-l border-r border-gray-300">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, "increase")}
                        disabled={item.quantity >= item.available}
                        className="w-12 h-12 bg-[#C9A040] hover:bg-[#ab8938] disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-sm font-semibold text-gray-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
