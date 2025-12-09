"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import mastercard from "@/public/mastercard.svg";
import visacard from "@/public/visaelectron.svg";
import Image from "next/image";
import api from "@/lib/axios";
import useUserStore from "@/app/store/userStore";
import { useCartStore } from "@/app/store/cartStore";




interface AgeCheckerConfig {
  element: string;
  key: string;
  path?: string;
  onVerified?: () => void;
}

// Minimal type for the global AgeChecker object loaded by the script
interface AgeCheckerWindow {
  AgeCheckerConfig?: AgeCheckerConfig;
}

declare global {
  interface Window {
    AgeCheckerConfig?: AgeCheckerConfig;
  }
}
// Define types for form data, errors, etc.
interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
  address: string;
  apartment: string;
  phone: string;
  saveInfo: boolean;
  birthMonth: string;
  birthDay: string;
  birthYear: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
  cardCountry: string;
  discountCode: string;
}

interface Errors {
  email?: string;
  birthMonth?: string;
  birthDay?: string;
  birthYear?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  cardCountry?: string;
}

interface CartItem {
  _id: string;
  userId: string;
  productId: {
    _id: string;
    name: string;
    images: string[];
    price: number;
    discount: number;
    isInStock: boolean;
    brandId: {
      _id: string;
      name: string;
    };
  };
  quantity: number;
  total: number;
  isSelected: boolean;
  isOrdered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ServicePricing {
  _id: string;
  shippingCost: number;
  AdvertisingText: string;
  MinimumFreeShipping: number;
  createdAt: string;
  updatedAt: string;
}

interface CartApiResponse {
  success: boolean;
  count: number;
  data: CartItem[];
}

interface ServicePricingApiResponse {
  success: boolean;
  data: ServicePricing;
}

interface TaxDetail {
  amount_to_collect: number;
  rate: number;
  taxable_amount: number;
  county?: string;
  city?: string;
  state?: string;
}

interface TaxResponse {
  tax: TaxDetail;
  freight_taxable?: boolean;
  has_nexus?: boolean;
  request?: {
    to_country: string;
    to_zip: string;
    to_state: string;
    amount: number;
    shipping: number;
  };
}

interface OrderData {
  userId: string | undefined;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    discount: number;
  }>;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
    address: string;
    apartment: string;
  };
  payment: {
    paymentMethod: string;
    amount: number;
    currency: string;
  };
  totals: {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: number;
    total: number;
  };
}

interface TaxCacheData {
  tax: number;
  timestamp: number;
  expiresIn: number;
}

const CheckoutPage = () => {
  const { user } = useUserStore();
  const { guestId } = useCartStore();  
  
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [servicePricing, setServicePricing] = useState<ServicePricing | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName:  "",
    lastName:  "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",
    apartment: "",
    phone: "",
    saveInfo: false,
    birthMonth: "",
    birthDay: "",
    birthYear: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
    cardCountry: "",
    discountCode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxMessage, setTaxMessage] = useState("");
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);



  const [isAgeChecked, setIsAgeChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const config: AgeCheckerConfig = {
      element: "#checkout-button",
      key: "LtE6WKMhRT41WntUJhk5oiEpuYl6g6SI", // Replace with your API key
      onVerified: () => {
        console.log("Age verification successful!");
        setIsAgeChecked(true);
      },
    };

    window.AgeCheckerConfig = config;

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
    script.crossOrigin = "anonymous";

    script.onerror = () => {
      window.location.href = "https://agechecker.net/loaderror";
    };

    head.insertBefore(script, head.firstChild);

    return () => {
      head.removeChild(script);
    };
  }, []);

  // Cache for tax calculations
  const cacheTaxCalculation = useCallback((zip: string, state: string, amount: number, calculatedTax: number): void => {
    if (typeof window === 'undefined') return;
    
    const cacheKey = `tax_${zip}_${state}_${Math.round(amount)}`;
    const cacheData: TaxCacheData = {
      tax: calculatedTax,
      timestamp: Date.now(),
      expiresIn: 24 * 60 * 60 * 1000 // 24 hours
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }, []);

  const getCachedTax = useCallback((zip: string, state: string, amount: number): number | null => {
    if (typeof window === 'undefined') return null;
    
    const cacheKey = `tax_${zip}_${state}_${Math.round(amount)}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const data: TaxCacheData = JSON.parse(cached);
        if (Date.now() - data.timestamp < data.expiresIn) {
          return data.tax;
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error reading tax cache:", errorMessage);
      }
    }
    return null;
  }, []);

  // Check if we should calculate tax
  const shouldCalculateTax = useCallback((): boolean => {
    return (
      formData.zipCode !== undefined && 
      formData.zipCode.length >= 3 && 
      formData.state !== undefined && 
      formData.state.length >= 2 &&
      cartItems.length > 0 &&
      subtotal > 0
    );
  }, [formData.zipCode, formData.state, cartItems.length,]);

  // Fetch cart data and service pricing
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        console.log('fetching data for checkout');
        setLoading(true);
        
        // Fetch cart items
        if (user) {
          const cartResponse = await api.get<CartApiResponse>(`/cart/getUserCart/${user}`);
          console.log(cartResponse.data,'cart response in checkout');
          if (cartResponse.data.success) {
            setCartItems(cartResponse.data.data);
          }
        }
        else if(guestId){
          console.log('fetching cart for guest',guestId);
          const cartResponse = await api.get<CartApiResponse>(`/cart/getUserCart/${guestId}`);
          console.log(cartResponse.data,'cart response in checkout for guest'); 
         if (cartResponse.data.success) {
            setCartItems(cartResponse.data.data);
          }
        }
        
        // Fetch service pricing
        const pricingResponse = await api.get<ServicePricingApiResponse>("/servicePricing/getServicePricing");
        console.log(pricingResponse.data,'service pricing in checkout');
        if (pricingResponse.data.success) {
          setServicePricing(pricingResponse.data.data);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Error fetching data:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, guestId]);

  // Calculate cart totals
  const subtotal = useMemo((): number => {
    return cartItems.reduce((sum: number, item: CartItem): number => {
      const price: number = item.productId.price || 0;
      const discount: number = item.productId.discount || 0;
      const discountedPrice: number = price * (1 - discount / 100);
      return sum + (discountedPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  // Calculate shipping cost based on service pricing
  const shippingCost = useMemo((): number => {
    if (!servicePricing) return 0;
    
    return subtotal >= servicePricing.MinimumFreeShipping ? 0 : servicePricing.shippingCost;
  }, [servicePricing, subtotal]);

  // Calculate discount from applied code
  const discount = useMemo((): number => {
    return discountApplied ? subtotal * (discountPercent / 100) : 0;
  }, [discountApplied, discountPercent, subtotal]);

  // Memoized dependencies for tax calculation
  const taxCalculationDeps = useMemo((): { zip: string; state: string; subtotal: number; shipping: number } => ({
    zip: formData.zipCode,
    state: formData.state,
    subtotal: Math.round(subtotal * 100), // Round to avoid floating point changes
    shipping: Math.round(shippingCost * 100)
  }), [formData.zipCode, formData.state, subtotal, shippingCost]);

  // Smart tax calculation with caching and debouncing
  useEffect((): (() => void) => {
    const calculateTax = async (): Promise<void> => {
      if (!shouldCalculateTax()) {
        setTax(0);
        setTaxRate(0);
        if (!formData.zipCode || !formData.state) {
          setTaxMessage("Enter address to calculate tax");
        }
        return;
      }

      // Check cache first
      const cachedTax = getCachedTax(formData.zipCode, formData.state, subtotal);
      if (cachedTax !== null) {
        setTax(cachedTax);
        setTaxRate(subtotal > 0 ? (cachedTax / subtotal) * 100 : 0);
        setTaxMessage("");
        return;
      }

      setIsCalculatingTax(true);
      setTaxMessage("Calculating tax...");
      
      try {
        const response = await api.post<TaxResponse>('/tax/calculateTax', {
          amount: subtotal,
          to_zip: formData.zipCode,
          to_state: formData.state,
          shipping: shippingCost
        });

        console.log("Tax API response:", response.data);
        
        if (response.data?.tax?.amount_to_collect !== undefined) {
          const taxAmount: number = response.data.tax.amount_to_collect;
          setTax(taxAmount);
          
          // Calculate tax rate percentage for display
          const rate: number = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
          setTaxRate(rate);
          
          // Cache the successful calculation
          cacheTaxCalculation(formData.zipCode, formData.state, subtotal, taxAmount);
          setTaxMessage("");
        } else {
          setTax(0);
          setTaxRate(0);
          setTaxMessage("Unable to calculate tax. Please check your address.");
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error("Tax calculation failed:", errorMessage);
        setTax(0);
        setTaxRate(0);
        setTaxMessage("Unable to calculate tax. Please verify your address.");
      } finally {
        setIsCalculatingTax(false);
      }
    };

    // Debounce the tax calculation to avoid too many API calls
    const timeoutId: NodeJS.Timeout = setTimeout(calculateTax, 500);
    
    return (): void => clearTimeout(timeoutId);
  }, [taxCalculationDeps, shouldCalculateTax, getCachedTax, cacheTaxCalculation, shippingCost, subtotal, formData.state, formData.zipCode]);

  // Calculate total
  const total = useMemo((): number => {
    return subtotal + shippingCost + tax - discount;
  }, [subtotal, shippingCost, tax, discount]);

  // Handle form validation and input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const isCheckbox: boolean = type === "checkbox";
    const checked: boolean = isCheckbox ? (e.target as HTMLInputElement).checked : false;
    const newValue: string | boolean = isCheckbox ? checked : value;

    const newErrors: Errors = { ...errors };

    if (name === "email" && !isCheckbox) {
      if (value && !validateEmail(value)) {
        newErrors.email = "Please enter a valid email";
      } else {
        delete newErrors.email;
      }
    }

    // Card number validation
    if (name === "cardNumber") {
      const cleaned: string = value.replace(/\s/g, '');
      if (cleaned && !/^\d+$/.test(cleaned)) {
        newErrors.cardNumber = "Card number must contain only digits";
      } else if (cleaned && cleaned.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      } else {
        delete newErrors.cardNumber;
      }
      
      // Format card number with spaces
      if (cleaned.length <= 16) {
        const formatted: string = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        setFormData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Expiry date validation and formatting
    if (name === "expiryDate") {
      const cleaned: string = value.replace(/\D/g, '');
      if (cleaned.length > 4) return;
      
      if (cleaned && cleaned.length !== 4) {
        newErrors.expiryDate = "Enter MM/YY format";
      } else {
        delete newErrors.expiryDate;
      }
      
      // Format as MM/YY
      let formatted: string = cleaned;
      if (cleaned.length >= 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
      }
      
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    // CVV validation
    if (name === "cvv") {
      const cleaned: string = value.replace(/\D/g, '');
      if (cleaned.length > 6) return;
      
      if (cleaned && cleaned.length < 3) {
        newErrors.cvv = "CVV must be 3-6 digits";
      } else {
        delete newErrors.cvv;
      }
      
      setFormData(prev => ({ ...prev, [name]: cleaned }));
      return;
    }

    // Card country validation
    if (name === "cardCountry") {
      if (!value.trim()) {
        newErrors.cardCountry = "Please enter country";
      } else {
        delete newErrors.cardCountry;
      }
    }

    setFormData((prev: FormData): FormData => ({ ...prev, [name]: newValue }));
    setErrors(newErrors);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    return (
      agreedToTerms &&
      formData.email !== "" &&
      !errors.email &&
      formData.cardNumber.replace(/\s/g, "").length === 16 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length >= 3 &&
      formData.cvv.length <= 6 &&
      formData.cardCountry !== "" &&
      cartItems.length > 0
    );
  };

  const handleApplyDiscount = (): void => {
    if (formData.discountCode.trim() !== "") {
      // In a real app, you would validate the discount code with your API
      // For demonstration, we'll apply a 10% discount for "SAVE10"
      if (formData.discountCode.toUpperCase() === "SAVE10") {
        setDiscountApplied(true);
        setDiscountPercent(10);
      } else {
        setDiscountApplied(false);
        setDiscountPercent(0);
        alert("Invalid discount code. Try 'SAVE10' for 10% off.");
      }
    } else {
      setDiscountApplied(false);
      setDiscountPercent(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    try {
      const orderData: OrderData = {
        userId: user || guestId,
        items: cartItems.map((item: CartItem) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          discount: item.productId.discount
        })),
        shippingInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          address: formData.address,
          apartment: formData.apartment
        },
        payment: {
          paymentMethod: "credit_card", // You'll need to implement actual payment processing
          amount: Math.round(total * 100),
          currency: "USD"
        },
        totals: {
          subtotal,
          shipping: shippingCost,
          tax,
          discount,
          total
        }
      };

      const response = await api.post<{ success: boolean; message?: string; orderId?: string }>("/api/orders", orderData);

      if (response.data.success) {
        alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
        // Clear cart or redirect to order confirmation page
      } else {
        alert(`Order failed: ${response.data.message || 'Unknown error'}`);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Order processing error:", errorMessage);
      alert("Failed to process order. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
       <noscript>
        <meta httpEquiv="refresh" content="0;url=https://agechecker.net/noscript" />
      </noscript>
      <div className="">
        <h1 className="bg-white rounded-lg text-[28px] font-semibold leading-[48px] text-gray-900 text-center p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Checkout
        </h1>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-[32px]">
          {/* LEFT COLUMN: Contact Info */}
          <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
              <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Dhaka"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zipCode"
                  placeholder="Dhaka"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Moakhali"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apartment, suite, etc (optional)
                </label>
                <input
                  type="text"
                  name="apartment"
                  placeholder="SA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.apartment}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                  Save this information for next time
                </label>
              </div>
            </div>
          </div>
           <button id="checkout-button">

        {isAgeChecked ? (
          <p style={{ color: "green" }}>Age verification passed ✅</p>
        ) : (
          <p style={{ color: "red" }}>Please verify your age to continue</p>
        )}
        </button>

          {/* RIGHT COLUMN: Order Summary + Discount + Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-[16px] md:p-[32px] rounded-lg mb-[16px] md:mb-[32px]">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-sm">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item: CartItem) => {
                      const price: number = item.productId.price || 0;
                      const discount: number = item.productId.discount || 0;
                      const discountedPrice: number = price * (1 - discount / 100);
                      const itemTotal: number = discountedPrice * item.quantity;
                      
                      return (
                        <div key={item._id} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="text-gray-700">{item.productId.name}</p>
                            {discount > 0 && (
                              <p className="text-xs text-gray-500">
                                Discount: {discount}% off
                              </p>
                            )}
                          </div>
                          <div className="flex gap-8 ml-4">
                            <span className="text-gray-600 w-16 text-right">${discountedPrice.toFixed(2)}</span>
                            <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                            <span className="font-medium w-16 text-right">${itemTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="font-medium">
                        {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                        {servicePricing && subtotal >= servicePricing.MinimumFreeShipping && (
                          <span className="text-xs text-green-600 ml-1">(Free shipping over ${servicePricing.MinimumFreeShipping})</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sales Tax</span>
                      {isCalculatingTax ? (
                        <span className="text-gray-500 text-sm">Calculating...</span>
                      ) : taxMessage ? (
                        <span className="text-xs text-red-600">{taxMessage}</span>
                      ) : (
                        <>
                          <span className="font-medium pl-[32px]">{taxRate.toFixed(2)}%</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount Code</span>
                        <span className="font-medium">{discountPercent}%</span>
                        <span className="font-medium text-red-500">-${discount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}
              {taxMessage && (
                <p className="text-xs text-red-600 mt-2">{taxMessage}</p>
              )}

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                  I agree to the terms and refund policy
                </label>
              </div>
            </div>

            {/* Discount Code */}
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Discount Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter discount code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.discountCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
                />
                <button 
                  type="button"
                  onClick={handleApplyDiscount}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-md text-sm"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Payment */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="xxxx xxxx xxxx xxxx"
                    className={`flex-1 px-3 py-2 border rounded-md text-sm ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    name="cardNumber"
                    maxLength={19}
                  /> 
                  <Image src={mastercard} alt="mastercard" width={30} height={30}/>
                  <Image src={visacard} alt="visaCard" width={30} height={30}/>
                </div>
                {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    name="expiryDate"
                    maxLength={5}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="CVV"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.cvv}
                    onChange={handleInputChange}
                    name="cvv"
                    maxLength={6}
                  />
                  {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.nameOnCard}
                  onChange={handleInputChange}
                  name="nameOnCard"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country or Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Country code (e.g., USA)"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cardCountry ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.cardCountry}
                  onChange={handleInputChange}
                  name="cardCountry"
                />
                {errors.cardCountry && <p className="text-red-500 text-xs mt-1">{errors.cardCountry}</p>}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                  "bg-green-600 hover:bg-green-700"
                } ${!validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!validateForm() || cartItems.length === 0}
              >
                {cartItems.length === 0 ? "Cart is Empty" : `Pay $${total.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Layout */}
        <form onSubmit={handleSubmit} className="lg:hidden space-y-6">
          {/* Contact Information */}
          <div className="bg-white p-[16px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.firstName}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.lastName}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                name="country"
                className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-md text-sm appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                }}
                value={formData.country}
                onChange={handleInputChange}
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.state}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                placeholder="ZIP Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.zipCode}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apartment, suite, etc (optional)
              </label>
              <input
                type="text"
                name="apartment"
                placeholder="Apartment"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.apartment}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="saveInfoMobile"
                name="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="saveInfoMobile" className="ml-2 text-sm text-gray-700">
                Save this information for next time
              </label>
            </div>
          </div>
            <button id="checkout-button">

        {isAgeChecked ? (
          <p style={{ color: "green" }}>Age verification passed ✅</p>
        ) : (
          <p style={{ color: "red" }}>Please verify your age to continue</p>
        )}
        </button>

          {/* Order Summary */}
          <div className="bg-white p-[16px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item: CartItem) => {
                    const price: number = item.productId.price || 0;
                    const discount: number = item.productId.discount || 0;
                    const discountedPrice: number = price * (1 - discount / 100);
                    const itemTotal: number = discountedPrice * item.quantity;
                    
                    return (
                      <div key={item._id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="text-gray-700">{item.productId.name}</p>
                          {discount > 0 && (
                            <p className="text-xs text-gray-500">
                              Discount: {discount}% off
                            </p>
                          )}
                        </div>
                        <div className="flex gap-4 ml-4">
                          <span className="text-gray-600">${discountedPrice.toFixed(2)}</span>
                          <span className="text-gray-600">{item.quantity}</span>
                          <span className="font-medium">${itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t pt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sub Total</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Cost</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Tax</span>
                    {isCalculatingTax ? (
                      <span className="text-gray-500 text-sm">Calculating...</span>
                    ) : taxMessage ? (
                      <span className="text-xs text-red-600">{taxMessage}</span>
                    ) : (
                      <>
                        <span className="font-medium">{taxRate.toFixed(2)}%</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount Code</span>
                      <span className="text-gray-600">{discountPercent}%</span>
                      <span className="font-medium text-red-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </>
            )}
            {taxMessage && (
              <p className="text-xs text-red-600 mt-2">{taxMessage}</p>
            )}

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="termsMobile"
                checked={agreedToTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="termsMobile" className="ml-2 text-sm text-gray-700">
                I agree to the terms and refund policy
              </label>
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-white p-[16px] rounded-lg">
            <h3 className="font-semibold mb-3">Discount Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter discount code"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.discountCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
              />
              <button 
                type="button"
                onClick={handleApplyDiscount}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 py-2 rounded-md text-sm"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white p-[16px] rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="xxxx xxxx xxxx xxxx"
                  className={`flex-1 px-3 py-2 border rounded-md text-sm ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  name="cardNumber"
                  maxLength={19}
                />
                <Image src={mastercard} alt="mastercard" width={30} height={30}/>
                <Image src={visacard} alt="visaCard" width={30} height={30}/>
              </div>
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.expiryDate ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  name="expiryDate"
                  maxLength={5}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CVV <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="CVV"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.cvv}
                  onChange={handleInputChange}
                  name="cvv"
                  maxLength={6}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                name="nameOnCard"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country or Region <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Country code (e.g., USA)"
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cardCountry ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.cardCountry}
                onChange={handleInputChange}
                name="cardCountry"
              />
              {errors.cardCountry && <p className="text-red-500 text-xs mt-1">{errors.cardCountry}</p>}
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
                "bg-green-600 hover:bg-green-700"
              } ${!validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!validateForm() || cartItems.length === 0}
            >
              {cartItems.length === 0 ? "Cart is Empty" : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;