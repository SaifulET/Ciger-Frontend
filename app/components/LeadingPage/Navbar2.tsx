"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Menu, X, User } from "lucide-react";
import logo from "@/public/logo1.svg";
import menuData from "@/Data/MenuItems.json";
import CartPage from "../Drawer/cartCount";
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
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter, usePathname } from "next/navigation";

interface SubItem {
  label: string;
  link: string;
  subItems?: SubItem[];
  icon?: string;
}

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
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

  const router = useRouter();
  const pathname = usePathname();

  // Set isClient to true after component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prevent body scroll when mobile modal is open
  useEffect(() => {
    if (mobileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
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

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim() !== "") {
      router.push(`/pages/product?brandProduct=${encodeURIComponent(value)}`);
      setValue("");
    }
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
    } else {
      setMobileSearchOpen(false);
      setValue("");
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
    } else {
      setMobileModalOpen(false);
      setExpandedItems({});
    }
    setTimeout(() => setIsAnimating(false), 300);
  };

  // Map menu items to icons
  const getMenuIcon = (label: string) => {
    const iconMap = {
      Home: Globe02FreeIcons,
      Brands: BrandfetchIcon,
      Products: PackageIcon,
      "Contact Us": Mail01FreeIcons,
      Blogs: File01Icon,
      Discounts: Discount01FreeIcons,
    };
    return iconMap[label as keyof typeof iconMap];
  };

  // Don't render anything until client-side to avoid hydration mismatch
  if (!isClient) {
    return (
      <header>
        <div className="w-full h-auto text-black flex flex-col md:flex-row items-center px-4 md:px-10 gap-4 md:gap-6 bg-white pt-4 md:pt-8">
          <div className=" flex-shrink-0 ">
            <Image
              className="rounded-full object-cover"
              src={logo}
              alt="Logo"
              width={150}
              height={150}
            />
          </div>
          {/* Simple loading state for desktop search */}
          <div className="hidden md:flex items-center justify-between gap-3 md:gap-4 w-full flex-nowrap">
            <div className="relative flex-grow ml-0 md:ml-0">
              <div className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-[#EDEDED]" />
            </div>
          </div>
        </div>
        {/* Simple loading state for desktop menu */}
        <nav className="hidden md:block bg-white w-full relative pt-2">
          <div className="flex flex-row justify-center items-center gap-[72px] md:px-16">
            {menuData.map((item: SubItem) => (
              <div key={item.label} className="relative md:min-w-[80px]">
                <Link href={item.link}>
                  <div className="flex items-center gap-2 py-2 cursor-pointer select-none justify-center md:justify-start relative">
                    <span className="font-['Open Sans'] font-semibold text-[16px] leading-[24px] text-[#0C0C0C]">
                      {item.label}
                    </span>
                    {item.subItems && (
                      <ChevronDown
                        size={20}
                        className="text-[#0C0C0C] md:ml-1"
                      />
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </header>
    );
  }

  return (
    <header>
      {/* ---------- Top bar (desktop & mobile) ---------- */}
      <div className="w-full h-auto md:pt-5 text-black flex flex-col md:flex-row items-center px-4 md:px-10 gap-4 md:gap-6 bg-white relative">
        {/* Logo (top in mobile, left in desktop) */}
        <div className="flex-shrink-0   ">
          <Image
            className="object-cover w-[220px] h-[30px] "
            src={logo}
            alt="Logo"
          />
        </div>

        {/* Desktop: search + buttons + cart */}
        <div className="hidden md:flex items-center justify-between gap-3 md:gap-4 w-full flex-nowrap">
          <div className="relative flex-grow ml-0 md:ml-0">
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleSearchKeyPress}
              className="w-full h-14 px-4 rounded-xl border border-gray-300 bg-[#EDEDED] text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
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
          </div>

          {/* Buttons */}
          <div className="flex flex-row justify-end items-center gap-2 md:gap-4 flex-shrink-0">
            {!isLoggedIn ? (
              <>
                <Link href="/auth/signup">
                  <button
                    onClick={() => setMobileProfileOpen(false)}
                    className="text-base not-italic font-semibold leading-6 px-6 md:px-8 py-2 md:py-4 rounded-lg hover:bg-gray-400 transition text-[#0C0C0C] whitespace-nowrap"
                  >
                    SignUp
                  </button>
                </Link>

                <Link href="#">
                  <button
                    onClick={() => {
                      setIsLoggedIn(true);
                      setMobileProfileOpen(false);
                    }}
                    className="text-base not-italic font-semibold leading-6 px-6 md:px-8 py-2 md:py-4 rounded-lg bg-[#C9A040] hover:bg-gray-400 transition text-[#0C0C0C] whitespace-nowrap"
                  >
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <div
                  onClick={() => setDesktopProfileOpen(!desktopProfileOpen)}
                  className="flex items-center gap-2 text-base font-semibold px-6 md:px-8 py-3 md:py-5 rounded-lg  text-[#0C0C0C] transition"
                >
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <span>User Name</span>
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
                      onClick={() => {
                        setIsLoggedIn(false);
                        setDesktopProfileOpen(false);
                      }}
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
        <div className="w-full md:hidden ">
          {/* Mobile Icon Row or Full-Width Search */}
          <div className="flex items-center justify-center gap-4  px-4 transition-all duration-300">
            {mobileSearchOpen ? (
              // Full-width search bar with X - with smooth transition
              <div className="w-full">
                <div className="flex gap-8 justify-center pr-10 items-center">
                  {/* Search icon */}
                  <button
                    aria-label="Search"
                    className="p-1 transition transform hover:scale-110"
                    onClick={toggleMobileSearch}
                  >
                    <Search size={30} className="text-[#C9A040]" />
                  </button>

                  {/* Cart icon */}
                  <div
                    aria-label="Cart"
                    className="relative p-1 "
                    onClick={() => {
                      setMobileCartOpen(!mobileCartOpen);
                      setMobileProfileOpen(false);
                      setMobileModalOpen(false);
                      setMobileSearchOpen(false);
                    }}
                  >
                    <CartPage />
                  </div>

                  {/* Profile icon */}
                  <div className="relative">
                    <button
                      aria-label="Profile"
                      className="p-1 transition transform hover:scale-110"
                      onClick={() => {
                        setMobileProfileOpen(!mobileProfileOpen);
                        setMobileModalOpen(false);
                        setMobileCartOpen(false);
                        setMobileSearchOpen(false);
                      }}
                    >
                      <User size={30} />
                    </button>

                    {/* Mobile profile dropdown */}
                    {mobileProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-3 animate-fadeIn">
                        {!isLoggedIn ? (
                          <div className="flex flex-col gap-2">
                            <Link href="/auth/signin">
                              <button
                                className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                onClick={() => {
                                  setIsLoggedIn(true);
                                  setMobileProfileOpen(false);
                                }}
                              >
                                <HugeiconsIcon icon={UserIcon} /> Login
                              </button>
                            </Link>
                            <Link href="/auth/signup">
                              <button
                                className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                onClick={() => setMobileProfileOpen(false)}
                              >
                                <HugeiconsIcon icon={SquareLock02Icon} /> Signup
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
                                <HugeiconsIcon icon={Clock05Icon} /> Order History
                              </div>
                            </Link>
                            <button
                              className="flex gap-2 text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setIsLoggedIn(false);
                                setMobileProfileOpen(false);
                              }}
                            >
                              <HugeiconsIcon icon={Logout01Icon} /> Logout
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Hamburger with smooth transition to X */}
                  <button
                    aria-label="Menu"
                    className="p-1 transition-all duration-300 transform hover:scale-110"
                    onClick={toggleMobileMenu}
                  >
                    <div className="relative w-6 h-6">
                      <Menu 
                        size={30} 
                        className={`absolute top-0 left-0 transition-all duration-300 ${
                          mobileModalOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                        }`}
                      />
                      <X 
                        size={30} 
                        className={`absolute top-0 left-0 transition-all duration-300 ${
                          mobileModalOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                        }`}
                      />
                    </div>
                  </button>
                </div>
                
                {/* Search input with slide-in animation */}
                <div className="flex w-full gap-2 transition-all duration-300 mb-4 animate-slideDown">
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleSearchKeyPress}
                    placeholder="Search Product or Brand"
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-[#EDEDED] text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                    autoFocus
                  />
                  <button
                    className="transition-transform hover:scale-110"
                    onClick={toggleMobileSearch}
                    aria-label="Close search"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
            ) : (
              // Original icon row with hover effects
              <>
                {/* Search icon */}
                <button
                  aria-label="Search"
                  className="p-3 transition-transform hover:scale-110"
                  onClick={toggleMobileSearch}
                >
                  <Search size={30} />
                </button>

                {/* Cart icon */}
                <div
                  aria-label="Cart"
                  className="relative p-3 "
                  onClick={() => {
                    setMobileCartOpen(!mobileCartOpen);
                    setMobileProfileOpen(false);
                    setMobileModalOpen(false);
                    setMobileSearchOpen(false);
                  }}
                >
                  <CartPage />
                </div>

                {/* Profile icon */}
                <div className="relative">
                  <button
                    aria-label="Profile"
                    className="p-3 pt-2 transition-transform hover:scale-110"
                    onClick={() => {
                      setMobileProfileOpen(!mobileProfileOpen);
                      setMobileModalOpen(false);
                      setMobileCartOpen(false);
                      setMobileSearchOpen(false);
                    }}
                  >
                    <User size={30} />
                  </button>

                  {/* Mobile profile dropdown */}
                  {mobileProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md z-50 p-3 animate-fadeIn">
                      {!isLoggedIn ? (
                        <div className="flex flex-col gap-2">
                          <Link href="#">
                            <button
                              className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                              onClick={() => {
                                setIsLoggedIn(true);
                                setMobileProfileOpen(false);
                              }}
                            >
                              <HugeiconsIcon icon={UserIcon} /> Login
                            </button>
                          </Link>
                          <Link href="/pages/signup">
                            <button
                              className="flex gap-2 w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                              onClick={() => setMobileProfileOpen(false)}
                            >
                              <HugeiconsIcon icon={SquareLock02Icon} /> Signup
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
                              <HugeiconsIcon icon={Clock05Icon} /> Order History
                            </div>
                          </Link>
                          <button
                            className="flex gap-2 text-left px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                            onClick={() => {
                              setIsLoggedIn(false);
                              setMobileProfileOpen(false);
                            }}
                          >
                            <HugeiconsIcon icon={Logout01Icon} /> Logout
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Hamburger with smooth transition to X */}
                <button
                  aria-label="Menu"
                  className="p-3 transition-all duration-300 transform hover:scale-110"
                  onClick={toggleMobileMenu}
                >
                  <div className="relative w-6 h-6">
                    <Menu 
                      size={30} 
                      className={`absolute top-0 left-0 transition-all duration-300 ${
                        mobileModalOpen ? "opacity-0 rotate-90" : "opacity-100 rotate-0"
                      }`}
                    />
                    <X 
                      size={30} 
                      className={`absolute top-0 left-0 transition-all duration-300 ${
                        mobileModalOpen ? "opacity-100 rotate-0" : "opacity-0 -rotate-90"
                      }`}
                    />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Desktop Menu (unchanged) ---------- */}
      <nav className="hidden md:block bg-white w-full relative ">
        <div className="flex flex-row justify-center items-center gap-[72px] md:px-16 ">
          {menuData.map((item: SubItem) => {
            const isSelected = isMenuItemSelected(item);

            return (
              <div key={item.label} className="relative md:min-w-[80px]">
                <Link
                  href={item.link}
                  onClick={() => setMobileModalOpen(false)}
                >
                  <div
                    onClick={() => handleMenuClickDesktop(item)}
                    className="flex items-center gap-2 py-2 cursor-pointer select-none justify-center md:justify-start relative"
                  >
                    <span className="font-['Open Sans'] font-semibold text-[16px] leading-[24px] text-[#0C0C0C]">
                      {item.label}
                    </span>
                    {item.subItems && (
                      <ChevronDown
                        size={20}
                        className="text-[#0C0C0C] md:ml-1"
                      />
                    )}
                    {isSelected && (
                      <span className="absolute bottom-0 w-3/5 h-1 bg-[#C9A040]" />
                    )}
                  </div>
                </Link>

                {item.subItems && openMenu === item.label && (
                  <div className="absolute md:top-full md:left-0 mt-2 bg-white shadow-lg rounded-lg border border-gray-200 z-50 p-4 w-max min-w-[300px]">
                    <div
                      className={`grid gap-4 ${
                        item.subItems.length >= 3
                          ? "md:grid-cols-3"
                          : "md:grid-cols-1"
                      }`}
                    >
                      {item.subItems.map((sub) => (
                        <div key={sub.label}>
                          <div
                            onClick={() =>
                              sub.subItems
                                ? null
                                : handleSubItemClickDesktop(sub)
                            }
                            className={`font-semibold px-2 py-1 text-[#0C0C0C] cursor-pointer hover:text-[#C9A040] ${
                              isMenuItemSelected(sub) ? "underline" : ""
                            }`}
                          >
                            <Link
                              href={sub.link}
                              onClick={() => {
                                setOpenMenu(null);
                              }}
                            >
                              {sub.label}
                            </Link>
                          </div>
                          {sub.subItems &&
                            sub.subItems.map((inner) => (
                              <div
                                key={inner.label}
                                onClick={() => handleSubItemClickDesktop(inner)}
                                className={`pl-4 py-4 text-[#0C0C0C] cursor-pointer hover:text-[#C9A040] ${
                                  isMenuItemSelected(inner) ? "underline" : ""
                                }`}
                              >
                                <Link
                                  href={inner.link}
                                  onClick={() => {
                                    setOpenMenu(null);
                                  }}
                                  className="py-24"
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

      {/* ---------- Mobile Modal for Hamburger with proper scrolling ---------- */}
      {mobileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center">
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300 animate-fadeIn"
            onClick={toggleMobileMenu}
          />
          <div className="relative w-full max-w-md mt-20 bg-white rounded-lg shadow-lg z-60 mx-4 transition-all duration-300 transform animate-slideDown flex flex-col max-h-[80vh]">
            {/* Header with close button */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200">
              <button
                className="absolute top-4 right-4 p-1 transition-transform hover:scale-110"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
              <h2 className="text-lg font-semibold text-center">Menu</h2>
            </div>
            
            {/* Scrollable menu content */}
            <div className="flex-1 overflow-y-auto p-4">
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
                        <Link
                          href={item.link}
                          onClick={toggleMobileMenu}
                        >
                          <div
                            className={`flex gap-2 items-center text-base font-semibold transition-colors ${
                              isSelected ? "text-[#C9A040]" : "hover:text-[#C9A040]"
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
                                      isSubSelected ? "text-[#C9A040]" : "hover:text-[#C9A040]"
                                    }`}
                                  >
                                    {sub.label}
                                  </div>
                                </Link>

                                {sub.subItems && (
                                  <div className="pl-3 mt-1">
                                    {sub.subItems.map((inner) => {
                                      const isInnerSelected =
                                        isMenuItemSelected(inner);

                                      return (
                                        <div key={inner.label} className="py-1">
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
      )}

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Navbar;