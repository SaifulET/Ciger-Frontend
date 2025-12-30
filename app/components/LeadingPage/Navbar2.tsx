"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, User } from "lucide-react";
import logo from "@/public/logo2.png";
import menuData from "@/Data/MenuItems.json";
import CartPage from "../Drawer/cartCount";
import Cookies from "js-cookie";
import {
  Clock05Icon,
  Logout01Icon,
  Notification01Icon,
  PackageIcon,
  SquareLock02Icon,
  UserIcon,
  Globe02FreeIcons,
  BrandfetchIcon,
  Mail01FreeIcons,
  Discount01FreeIcons,
  File01Icon,
  Search01Icon,
  Menu01Icon,
  MultiplicationSignIcon,
  SecurityValidationIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, usePathname } from "next/navigation";
import useUserStore from "@/app/store/userStore";
import { useCartStore } from "@/app/store/cartStore";
import { useProductStore } from "@/app/store/productStore";

interface SubItem {
  label: string;
  link: string;
  subItems?: SubItem[];
  icon?: string;
}

interface SearchSuggestion {
  id: number;
  name: string;
  brand: string;
  image: string;
  category: string;
}

const Navbar: React.FC = () => {
  const [value, setValue] = useState<string>("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileModalOpen, setMobileModalOpen] = useState<boolean>(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState<boolean>(false);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState<boolean>(false);
  const [desktopProfileOpen, setDesktopProfileOpen] = useState<boolean>(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [isClient, setIsClient] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] =
    useState<boolean>(false);

  const { ClearStorage } = useCartStore();
  const { user, isLogin, UserLogoutRequest, userInfo } = useUserStore();
  const { products, fetchAllProducts } = useProductStore();

  const router = useRouter();
  const pathname = usePathname();

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch products on mount
  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  // Filter suggestions based on input - SHOW ALL PRODUCTS
  const filterSuggestions = useCallback(
    (searchTerm: string): SearchSuggestion[] => {
      if (products.length === 0) return [];

      const lowerCaseTerm = searchTerm.toLowerCase().trim();

      if (!lowerCaseTerm) {
        // Show ALL products when search input is empty
        return products.map((product) => ({
          id: product.id,
          name: product.name,
          brand: product.brand,
          image: product.image,
          category: product.category,
        }));
      }

      // Filter products by name, brand, or category when there's a search term
      const filtered = products.filter((product) => {
        return (
          product.name.toLowerCase().includes(lowerCaseTerm) ||
          product.brand.toLowerCase().includes(lowerCaseTerm) ||
          product.category.toLowerCase().includes(lowerCaseTerm)
        );
      });

      return filtered;
    },
    [products]
  );

  // Update suggestions when input changes or when focused
  useEffect(() => {
    if (value.trim() || showSuggestions) {
      setIsLoadingSuggestions(true);
      const timer = setTimeout(() => {
        const filtered = filterSuggestions(value);
        setSuggestions(filtered);
        setSelectedSuggestionIndex(-1);
        setIsLoadingSuggestions(false);
      }, 300); // Debounce for 300ms

      return () => clearTimeout(timer);
    } else {
      setSuggestions([]);
    }
  }, [value, filterSuggestions, showSuggestions]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === "Enter" && value.trim() !== "") {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          const selected = suggestions[selectedSuggestionIndex];
          router.push(`/pages/products/${selected.id}`);
          setValue("");
          setShowSuggestions(false);
        } else {
          handleSearch();
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
    }
  };

  // Scroll selected suggestion into view
  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedSuggestionIndex]);

  // Set isClient to true after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (mobileModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileModalOpen]);

  // Function to check if a menu item is selected based on current path
  const isMenuItemSelected = (item: SubItem): boolean => {
    if (!pathname) return false;

    // Special handling for Home menu - only selected for exact /pages or /pages/
    if (item.label === "Home") {
      return pathname === "/pages" || pathname === "/pages/";
    }

    // Check if current path matches the item's link
    if (pathname === item.link) {
      return true;
    }

    // Check if current path starts with the item's link (for nested routes)
    // Exclude Home from this check as we handled it above
    if (
      item.link !== "/" &&
      item.link !== "/pages" &&
      pathname.startsWith(item.link)
    ) {
      return true;
    }

    // Check subItems recursively
    if (item.subItems) {
      return item.subItems.some((subItem) => isMenuItemSelected(subItem));
    }

    return false;
  };

  const handleSearch = () => {
    if (value.trim() !== "") {
      router.push(`/pages/products?keyword=${encodeURIComponent(value)}`);
      setValue("");
      setShowSuggestions(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    router.push(`/pages/products/${suggestion.id}`);
    setValue("");
    setShowSuggestions(false);
  };

  const handleMenuClickDesktop = (item: SubItem) => {
    if (item.subItems) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else {
      setOpenMenu(null);
    }
  };

  const handleSubItemClickDesktop = (subItem: SubItem) => {
    setOpenMenu(null);
  };

  const toggleMobileExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const closeAllMobileUI = () => {
    setMobileProfileOpen(false);
    setMobileModalOpen(false);
    setMobileCartOpen(false);
    setMobileSearchOpen(false);
  };

  // Smooth toggle for mobile search
  const toggleMobileSearch = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (!mobileSearchOpen) {
      setMobileSearchOpen(true);
      setMobileProfileOpen(false);
      setMobileModalOpen(false);
      setMobileCartOpen(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setMobileSearchOpen(false);
      setValue("");
      setShowSuggestions(false);
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Smooth toggle for mobile menu
  const toggleMobileMenu = () => {
    if (isAnimating) return;

    setIsAnimating(true);
    if (!mobileModalOpen) {
      setMobileModalOpen(true);
      setMobileProfileOpen(false);
      setMobileCartOpen(false);
      setMobileSearchOpen(false);
      setShowSuggestions(false);
    } else {
      setMobileModalOpen(false);
      setExpandedItems({});
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Handle logout
  const handleLogout = async () => {
    await ClearStorage();
    await UserLogoutRequest();
    setDesktopProfileOpen(false);
    setMobileProfileOpen(false);
  };

  // Map menu items to icons
  const getMenuIcon = (label: string) => {
    const iconMap = {
      Home: Globe02FreeIcons,
      Brands: BrandfetchIcon,
      Products: PackageIcon,
      "Contact Us": Mail01FreeIcons,
      COA: SecurityValidationIcon,
      Blogs: File01Icon,
      Discounts: Discount01FreeIcons,
    };
    return iconMap[label as keyof typeof iconMap];
  };

  // Don't render anything until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <header className="relative">
        <div className="w-full lg:pt-5 text-black flex flex-col md:flex-row items-center md:px-10 gap-4 md:gap-6 bg-white relative z-50 min-h-[80px]"></div>
      </header>
    );
  }

  return (
    <header className="relative ">
      {/* ---------- Top bar (desktop & mobile) ---------- */}
      <div className="w-full lg:pt-5 text-black flex flex-col md:flex-row items-center md:px-10 gap-4 md:gap-6 bg-white relative z-50">
        {/* Logo (top in mobile, left in desktop) */}
        <Link href="/pages/">
          <div className="flex-shrink-0">
            <Image
              className="object-fit  w-0  lg:w-[220px] lg:h-[60px]"
              src={logo}
              alt="Logo"
              priority
            />
          </div>
        </Link>

        {/* Desktop: search + buttons + cart */}
        <div className="hidden lg:flex items-center justify-between gap-3 md:gap-4 w-full flex-nowrap">
          <div
            ref={searchRef}
            className="relative flex-grow ml-0 md:ml-0 max-h-[48px]"
          >
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowSuggestions(true)}
              className="w-full h-[48px] focus:h-11 px-4 rounded-xl border border-gray-300 bg-[#F5F5F5] text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
            />
            {!value && (
              <div className="absolute inset-0 flex items-center justify-start text-gray-600 pointer-events-none">
                <div className="flex items-center gap-2 text-gray-600 pl-5">
                  <Search className="w-4 h-4" />
                  <span className="text-base font-medium">
                    Search Product or Brand
                  </span>
                </div>
              </div>
            )}

            {/* Desktop Search Suggestions - SHOW ALL PRODUCTS */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                <div ref={suggestionsRef} className="max-h-96 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto"></div>
                      <p className="mt-2">Loading suggestions...</p>
                    </div>
                  ) : suggestions.length > 0 ? (
                    <>
                      <div className="p-3 bg-gray-50 border-b">
                        <p className="text-sm font-medium text-gray-600">
                          {value.trim()
                            ? `Found ${suggestions.length} products matching "${value}"`
                            : `Showing all ${suggestions.length} products`}
                        </p>
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={suggestion.id}
                          className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            index === selectedSuggestionIndex
                              ? "bg-gray-100"
                              : ""
                          } ${
                            index < suggestions.length - 1
                              ? "border-b border-gray-100"
                              : ""
                          }`}
                          onClick={() => handleSuggestionClick(suggestion)}
                          onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        >
                          <div className="w-10 h-10 relative flex-shrink-0">
                            <Image
                              src={
                                suggestion.image || "/placeholder-product.png"
                              }
                              alt={suggestion.name}
                              fill
                              priority
                              className="object-cover rounded"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                              {suggestion.name}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {suggestion.brand} • {suggestion.category}
                            </p>
                          </div>
                          <ChevronDown
                            size={16}
                            className="transform -rotate-90 text-gray-400"
                          />
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p>No products available</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-end items-center gap-2 md:gap-4 flex-shrink-0">
            {/* FIXED: Use isLoggedIn from Zustand store */}
            {!Cookies.get("token") ? (
              <>
                <Link href="/auth/signup">
                  <button
                    onClick={() => setMobileProfileOpen(false)}
                    className="bg-[#F5F5F5] text-base not-italic font-semibold leading-6 px-6 md:px-8 py-2 md:py-4 rounded-lg hover:bg-gray-400 transition text-[#0C0C0C] whitespace-nowrap"
                  >
                    Sign Up
                  </button>
                </Link>

                <Link href="/auth/signin">
                  <button className="text-base not-italic font-semibold leading-6 px-6 md:px-8 py-2 md:py-4 rounded-lg bg-[#C9A040] hover:bg-gray-400 transition text-[#0C0C0C] whitespace-nowrap">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
                  className="flex items-center gap-2 text-base font-semibold px-6 md:px-8 py-3 md:py-5 rounded-lg text-[#0C0C0C] transition cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    {userInfo?.image && (
                      <Image
                        src={userInfo?.image}
                        alt={`profile`}
                        width={40}
                        height={40}
                        priority
                        className="object-cover w-8 h-8 rounded-full"
                      />
                    )}
                    {!userInfo?.image && <User size={20} />}
                  </div>
                  <span>{userInfo?.firstName}</span>
                  <ChevronDown
                    size={20}
                    className={`transition ${
                      desktopProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Desktop Profile Dropdown */}
                {desktopProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-3">
                    <Link
                      href="/pages/profile"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                        <HugeiconsIcon icon={UserIcon} /> Profile
                      </div>
                    </Link>
                    <Link
                      href="/pages/tracking"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                        <HugeiconsIcon icon={PackageIcon} /> Tracking Number
                      </div>
                    </Link>
                    <Link
                      href="/pages/notification"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                        <HugeiconsIcon icon={Notification01Icon} /> Notification
                      </div>
                    </Link>
                    <Link
                      href="/pages/orderhistory"
                      onClick={() => setDesktopProfileOpen(false)}
                    >
                      <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
                        <HugeiconsIcon icon={Clock05Icon} /> Order History
                      </div>
                    </Link>
                    <button
                      className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <HugeiconsIcon icon={Logout01Icon} /> Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Cart component */}
            <CartPage />
          </div>
        </div>

        {/* ---------- Mobile simplified header (visible only on small screens) ---------- */}
        <div className="w-full lg:hidden">
          {/* Mobile Icon Row or Full-Width Search */}
          <div className="px-[16px] transition-all duration-300 w-full">
            {mobileSearchOpen ? (
              // Full-width search bar with X - with smooth transition
              <div className="w-full" ref={searchRef}>
                <div className="flex justify-between items-center">
                  {/* Hamburger - 5 columns (left) */}
                  <div className="flex justify-start gap-[8px]">
                    <button
                      aria-label="Menu"
                      className="transition-all duration-300 transform hover:scale-110"
                      onClick={toggleMobileMenu}
                    >
                      <div className="relative w-6 h-6">
                        <HugeiconsIcon
                          icon={Menu01Icon}
                          className={`absolute top-0 left-0 transition-all duration-300 ${
                            mobileModalOpen
                              ? "opacity-0 rotate-90"
                              : "opacity-100 rotate-0"
                          }`}
                        />

                        <X
                          size={30}
                          className={`absolute top-0 left-0 transition-all duration-300 ${
                            mobileModalOpen
                              ? "opacity-100 rotate-0"
                              : "opacity-0 -rotate-90"
                          }`}
                        />
                      </div>
                    </button>
                    <Link href="/pages/">
                      <div className="flex justify-center items-center">
                        <Image
                          className="object-fit w-[150px]  flex item-center mb-[10px]"
                          src={logo}
                          priority
                          alt="Logo"
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Icons container - 4 columns (right) */}
                  <div>
                    {/* Search icon */}
                    <div className="flex justify-between items-center">
                      {/* Search icon */}
                      <button
                        aria-label="Search"
                        className="p-1 transition-transform hover:scale-110"
                        onClick={toggleMobileSearch}
                      >
                        <HugeiconsIcon icon={Search01Icon} />
                      </button>

                      {/* Cart icon */}
                      <div
                        aria-label="Cart"
                        className="relative p-1"
                        onClick={() => {
                          setMobileCartOpen(!mobileCartOpen);
                          setMobileProfileOpen(false);
                          setMobileModalOpen(false);
                          setMobileSearchOpen(false);
                          setShowSuggestions(false);
                        }}
                      >
                        <CartPage />
                      </div>

                      {/* Profile icon */}
                      <div className="relative">
                        <button
                          aria-label="Profile"
                          className="p-1 transition-transform hover:scale-110"
                          onClick={() => {
                            setMobileProfileOpen(!mobileProfileOpen);
                            setMobileModalOpen(false);
                            setMobileCartOpen(false);
                            setMobileSearchOpen(false);
                            setShowSuggestions(false);
                          }}
                        >
                          <HugeiconsIcon icon={UserIcon} />
                        </button>

                        {/* Mobile profile dropdown */}
                        {mobileProfileOpen && (
                          <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-3 animate-fadeIn">
                            {/* FIXED: Use isLoggedIn from Zustand store */}
                            {user.length == 0 ? (
                              <div className="flex flex-col gap-2">
                                <Link href="/auth/signin">
                                  <button
                                    className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                    onClick={() => setMobileProfileOpen(false)}
                                  >
                                    <HugeiconsIcon icon={UserIcon} /> Login
                                  </button>
                                </Link>
                                <Link href="/auth/signup">
                                  <button
                                    className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                    onClick={() => setMobileProfileOpen(false)}
                                  >
                                    <HugeiconsIcon icon={SquareLock02Icon} />{" "}
                                    Signup
                                  </button>
                                </Link>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1">
                                <Link
                                  href="/pages/profile"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                    <HugeiconsIcon icon={UserIcon} /> Profile
                                  </div>
                                </Link>
                                <Link
                                  href="/pages/tracking"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                    <HugeiconsIcon icon={PackageIcon} />{" "}
                                    Tracking Number
                                  </div>
                                </Link>
                                <Link
                                  href="/pages/notification"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                    <HugeiconsIcon icon={Notification01Icon} />{" "}
                                    Notification
                                  </div>
                                </Link>
                                <Link
                                  href="/pages/orderhistory"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                    <HugeiconsIcon icon={Clock05Icon} /> Order
                                    History
                                  </div>
                                </Link>
                                <button
                                  className="flex gap-2 text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                  onClick={handleLogout}
                                >
                                  <HugeiconsIcon icon={Logout01Icon} /> Logout
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Search input with slide-in animation */}
                <div className="flex w-full gap-2 transition-all duration-300 mb-4 animate-slideDown">
                  <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search Product or Brand"
                    className="w-full h-[48px] px-4 rounded-lg border border-gray-300 bg-[#EDEDED] text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    autoFocus
                  />
                  <button
                    className="h-[48px] w-12 flex items-center justify-center transition-transform hover:scale-110 bg-[#EDEDED] rounded-lg hover:bg-gray-300 border border-gray-300"
                    onClick={toggleMobileSearch}
                    aria-label="Close search"
                  >
                    <HugeiconsIcon icon={MultiplicationSignIcon} />
                  </button>
                </div>

                {/* Mobile Search Suggestions - SHOW ALL PRODUCTS */}
                {showSuggestions && (
                  <div className="absolute left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden">
                    <div
                      ref={suggestionsRef}
                      className="max-h-96 overflow-y-auto"
                    >
                      {isLoadingSuggestions ? (
                        <div className="p-4 text-center text-gray-500">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto"></div>
                          <p className="mt-2">Loading suggestions...</p>
                        </div>
                      ) : suggestions.length > 0 ? (
                        <>
                          <div className="p-3 bg-gray-50 border-b">
                            <p className="text-sm font-medium text-gray-600">
                              {value.trim()
                                ? `Found ${suggestions.length} products matching "${value}"`
                                : `Showing all ${suggestions.length} products`}
                            </p>
                          </div>
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={suggestion.id}
                              className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                index === selectedSuggestionIndex
                                  ? "bg-gray-100"
                                  : ""
                              } ${
                                index < suggestions.length - 1
                                  ? "border-b border-gray-100"
                                  : ""
                              }`}
                              onClick={() => handleSuggestionClick(suggestion)}
                              onMouseEnter={() =>
                                setSelectedSuggestionIndex(index)
                              }
                            >
                              <div className="w-10 h-10 relative flex-shrink-0">
                                <Image
                                  src={
                                    suggestion.image ||
                                    "/placeholder-product.png"
                                  }
                                  alt={suggestion.name}
                                  fill
                                  priority
                                  className="object-cover rounded"
                                  sizes="40px"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-800 truncate">
                                  {suggestion.name}
                                </p>
                                <p className="text-sm text-gray-500 truncate">
                                  {suggestion.brand} • {suggestion.category}
                                </p>
                              </div>
                              <ChevronDown
                                size={16}
                                className="transform -rotate-90 text-gray-400"
                              />
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          <p>No products available</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Grid container with 12 columns
              <div className="flex justify-between items-center">
                {/* Hamburger - 5 columns (left) */}
                <div className="flex justify-start gap-[8px]">
                  <button
                    aria-label="Menu"
                    className="transition-all duration-300 transform hover:scale-110"
                    onClick={toggleMobileMenu}
                  >
                    <div className="relative w-6 h-6">
                      <HugeiconsIcon
                        icon={Menu01Icon}
                        className={`absolute top-0 left-0 transition-all duration-300 ${
                          mobileModalOpen
                            ? "opacity-0 rotate-90"
                            : "opacity-100 rotate-0"
                        }`}
                      />

                      <X
                        size={30}
                        className={`absolute top-0 left-0 transition-all duration-300 ${
                          mobileModalOpen
                            ? "opacity-100 rotate-0"
                            : "opacity-0 -rotate-90"
                        }`}
                      />
                    </div>
                  </button>
                  <Link href="/pages/">
                    <div className="flex justify-center items-center">
                      <Image
                        className="object-fit w-[150px] h-[50px] flex item-center mb-[10px]"
                        src={logo}
                        alt="Logo"
                        priority
                      />
                    </div>
                  </Link>
                </div>

                {/* Icons container - 4 columns (right) */}
                <div>
                  {/* Search icon */}
                  <div className="flex justify-between items-center">
                    {/* Search icon */}
                    <button
                      aria-label="Search"
                      className="p-1 transition-transform hover:scale-110"
                      onClick={toggleMobileSearch}
                    >
                      <HugeiconsIcon icon={Search01Icon} />
                    </button>

                    {/* Cart icon */}
                    <div
                      aria-label="Cart"
                      className="relative p-1"
                      onClick={() => {
                        setMobileCartOpen(!mobileCartOpen);
                        setMobileProfileOpen(false);
                        setMobileModalOpen(false);
                        setMobileSearchOpen(false);
                        setShowSuggestions(false);
                      }}
                    >
                      <CartPage />
                    </div>

                    {/* Profile icon */}
                    <div className="relative">
                      <button
                        aria-label="Profile"
                        className="p-1 transition-transform hover:scale-110"
                        onClick={() => {
                          setMobileProfileOpen(!mobileProfileOpen);
                          setMobileModalOpen(false);
                          setMobileCartOpen(false);
                          setMobileSearchOpen(false);
                          setShowSuggestions(false);
                        }}
                      >
                        {userInfo?.image && (
                          <Image
                            src={userInfo?.image}
                            alt={`profile`}
                            width={40}
                            height={40}
                            priority
                            className="object-cover w-8 h-8 rounded-full"
                          />
                        )}
                        {!userInfo?.image && <HugeiconsIcon icon={UserIcon} />}
                      </button>

                      {/* Mobile profile dropdown */}
                      {mobileProfileOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-3 animate-fadeIn">
                          {/* FIXED: Use isLoggedIn from Zustand store */}
                          {!Cookies.get("token") ? (
                            <div className="flex flex-col gap-2">
                              <Link href="/auth/signin">
                                <button
                                  className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <HugeiconsIcon icon={UserIcon} /> Login
                                </button>
                              </Link>
                              <Link href="/auth/signup">
                                <button
                                  className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                  onClick={() => setMobileProfileOpen(false)}
                                >
                                  <HugeiconsIcon icon={SquareLock02Icon} />{" "}
                                  Signup
                                </button>
                              </Link>
                            </div>
                          ) : (
                            <div className="flex flex-col gap-1">
                              <Link
                                href="/pages/profile"
                                onClick={() => setMobileProfileOpen(false)}
                              >
                                <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                  <HugeiconsIcon icon={UserIcon} /> Profile
                                </div>
                              </Link>
                              <Link
                                href="/pages/tracking"
                                onClick={() => setMobileProfileOpen(false)}
                              >
                                <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                  <HugeiconsIcon icon={PackageIcon} /> Tracking
                                  Number
                                </div>
                              </Link>
                              <Link
                                href="/pages/notification"
                                onClick={() => setMobileProfileOpen(false)}
                              >
                                <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                  <HugeiconsIcon icon={Notification01Icon} />{" "}
                                  Notification
                                </div>
                              </Link>
                              <Link
                                href="/pages/orderhistory"
                                onClick={() => setMobileProfileOpen(false)}
                              >
                                <div className="flex gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors">
                                  <HugeiconsIcon icon={Clock05Icon} /> Order
                                  History
                                </div>
                              </Link>
                              <button
                                className="flex gap-2 text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                onClick={handleLogout}
                              >
                                <HugeiconsIcon icon={Logout01Icon} /> Logout
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Desktop Menu (unchanged) ---------- */}
      <nav className="hidden lg:block bg-white w-full relative pb-[24px]">
        <div className="flex flex-row justify-center items-center gap-10 lg:gap-24 ">
          {menuData.map((item: SubItem, index: number) => {
            const isSelected = isMenuItemSelected(item);
            const isOpen = openMenu === item.label;

            return (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.subItems && setOpenMenu(item.label)}
                onMouseLeave={(e) => {
                  // Check if mouse is moving to dropdown
                  const relatedTarget = e.relatedTarget as HTMLElement;
                  if (!relatedTarget?.closest?.(".dropdown-container")) {
                    setOpenMenu(null);
                  }
                }}
              >
                <Link href={item.link}>
                  <div className="flex items-center gap-2 pt-4 pb-2 cursor-pointer select-none justify-center relative group">
                    <div className="relative">
                      <span
                        className={`font-['Open Sans'] font-semibold text-[16px] leading-[24px] transition-colors duration-300 ${
                          isOpen
                            ? "text-[#C9A040]"
                            : "text-[#0C0C0C] group-hover:text-[#C9A040]"
                        }  `}
                      >
                        {item.label}
                      </span>
                      {isSelected && (
                        <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#C9A040] transition-all duration-300" />
                      )}
                      {item.label === "Products" &&
                        pathname === "/pages/products" && (
                          <span className="absolute -bottom-2 left-0 right-0 h-1 bg-[#C9A040] transition-all duration-300" />
                        )}
                    </div>
                    {item.subItems && (
                      <ChevronDown
                        size={20}
                        className={`transition-all duration-300 ${
                          isOpen
                            ? "text-[#C9A040] rotate-180"
                            : "text-[#0C0C0C] rotate-0 group-hover:text-[#C9A040]"
                        }`}
                      />
                    )}
                  </div>
                </Link>

                {item.subItems && (
                  <div
                    className={`dropdown-container absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4 w-max min-w-[300px] transition-all duration-300 ${
                      isOpen
                        ? "opacity-100 visible translate-y-0"
                        : "opacity-0 invisible -translate-y-1"
                    }`}
                    onMouseEnter={() => setOpenMenu(item.label)}
                    onMouseLeave={() => setOpenMenu(null)}
                  >
                    <div
                      className={`grid gap-4 ${
                        item.subItems.length >= 3
                          ? "md:grid-cols-4"
                          : "md:grid-cols-1"
                      }`}
                    >
                      {item.subItems.map((sub) => (
                        <div key={sub.label}>
                          <div className="font-semibold px-2 py-1 text-[#0C0C0C] cursor-pointer">
                            <Link
                              href={sub.link}
                              className="block hover:text-[#C9A040] transition-colors duration-300 py-2"
                              onClick={() => setOpenMenu(null)}
                            >
                              {sub.label}
                            </Link>
                          </div>
                          {sub.subItems &&
                            sub.subItems.map((inner) => (
                              <div key={inner.label} className="pl-2 py-1">
                                <Link
                                  href={inner.link}
                                  className="block text-[#0C0C0C] hover:text-[#C9A040] transition-colors duration-300 py-2"
                                  onClick={() => setOpenMenu(null)}
                                >
                                  {inner.label}
                                </Link>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* ---------- Mobile Modal Menu ---------- */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-100 flex items-start justify-start pt-25 ">
          {/* Black Background */}
          <div
            className="absolute inset-0 transition-opacity duration-300 animate-fadeIn"
            onClick={toggleMobileMenu}
          />

          {/* Modal Menu Content - Starts from hamburger bottom with left padding */}
          <div className="relative w-full lg:w-0 h-full bg-white shadow-xl z-60 transition-all duration-300 transform animate-slideInLeft overflow-hidden">
            {/* Scrollable menu content */}
            <div className="h-full overflow-y-auto pb-20">
              <div className="p-6 pl-8">
                <div className="space-y-2">
                  {menuData.map((item: SubItem) => {
                    const hasSub = !!item.subItems?.length;
                    const isExpanded = !!expandedItems[item.label];
                    const isSelected = isMenuItemSelected(item);
                    const MenuIcon = getMenuIcon(item.label);

                    return (
                      <div
                        key={item.label}
                        className="border-b border-gray-100 pb-2 transition-colors"
                      >
                        <div className="flex items-center justify-between py-2">
                          <Link href={item.link} onClick={toggleMobileMenu}>
                            <div
                              className={`flex gap-2 items-center text-base font-semibold transition-colors ${
                                isSelected
                                  ? "text-[#C9A040]"
                                  : "hover:text-[#C9A040]"
                              }`}
                            >
                              {MenuIcon && (
                                <HugeiconsIcon icon={MenuIcon} size={24} />
                              )}
                              {item.label}
                            </div>
                          </Link>

                          {hasSub && (
                            <button
                              onClick={() => toggleMobileExpand(item.label)}
                              className="text-2xl font-bold px-2 transition-transform hover:scale-125"
                              aria-label={
                                isExpanded
                                  ? `Collapse ${item.label}`
                                  : `Expand ${item.label}`
                              }
                            >
                              {isExpanded ? "−" : "+"}
                            </button>
                          )}
                        </div>

                        {hasSub && isExpanded && (
                          <div className="pl-4 animate-fadeIn">
                            {item.subItems!.map((sub) => {
                              const isSubSelected = isMenuItemSelected(sub);

                              return (
                                <div key={sub.label} className="py-1">
                                  <Link
                                    href={sub.link}
                                    onClick={toggleMobileMenu}
                                  >
                                    <div
                                      className={`flex gap-2 items-center font-medium transition-colors ${
                                        isSubSelected
                                          ? "text-[#C9A040]"
                                          : "hover:text-[#C9A040]"
                                      }`}
                                    >
                                      {sub.label}
                                    </div>
                                  </Link>

                                  {sub.subItems && (
                                    <div className="mt-1">
                                      {sub.subItems.map((inner) => {
                                        const isInnerSelected =
                                          isMenuItemSelected(inner);

                                        return (
                                          <div
                                            key={inner.label}
                                            className="py-1"
                                          >
                                            <Link
                                              href={inner.link}
                                              onClick={toggleMobileMenu}
                                            >
                                              <div
                                                className={`flex gap-2 items-center text-sm transition-colors ${
                                                  isInnerSelected
                                                    ? "text-[#C9A040]"
                                                    : "hover:text-[#C9A040]"
                                                }`}
                                              >
                                                {inner.label}
                                              </div>
                                            </Link>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
