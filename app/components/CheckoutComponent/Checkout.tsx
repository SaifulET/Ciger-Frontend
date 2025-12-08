"use client";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import mastercard from "@/public/mastercard.svg";
import visacard from "@/public/visaelectron.svg";
import Image from "next/image";
import api from "@/lib/axios";
import useUserStore from "@/app/store/userStore";
import { useCartStore } from "@/app/store/cartStore";
import { ageCheckerConfig } from "@/lib/ageCheckerConfig"; // Your existing config
import type { AgeVerificationResult } from "@/lib/ageChecker"; // Your existing types

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
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [isVerifyingAge, setIsVerifyingAge] = useState(false);
  const [ageVerificationMessage, setAgeVerificationMessage] = useState<string>("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxMessage, setTaxMessage] = useState("");
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);

  const ageCheckerInitialized = useRef<boolean>(false);

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

  // Initialize AgeChecker
  useEffect((): (() => void) => {
    if (ageCheckerInitialized.current || typeof window === 'undefined') return ()=>{};

    // Check if already verified in this session or recently
    const isAlreadyVerified = localStorage.getItem('age_verified') === 'true';
    const verificationTimestamp = localStorage.getItem('age_verification_timestamp');
    const isVerificationRecent = verificationTimestamp 
      ? (Date.now() - parseInt(verificationTimestamp)) < (24 * 60 * 60 * 1000) // 24 hours
      : false;

    if (isAlreadyVerified && isVerificationRecent) {
      setIsAgeVerified(true);
      setAgeVerificationMessage("✓ Age verified (recently verified)");
    }

    // Check if AgeChecker script is already loaded
    if (window.AgeChecker) {
      console.log("AgeChecker already loaded");
      ageCheckerInitialized.current = true;
      return ()=>{};
    }

    // Load AgeChecker script using your configuration
    const script: HTMLScriptElement = document.createElement("script");
    script.src = `https://cdn.agechecker.net/static/js/ac.js?key=${ageCheckerConfig.key}`;
    script.async = true;
    
    script.onload = (): void => {
      console.log("AgeChecker script loaded successfully");
      console.log("AgeChecker global object:", window.AgeChecker);
      ageCheckerInitialized.current = true;
      
      // Initialize AgeChecker with your config
      if (window.AgeChecker) {
        console.log("AgeChecker initialized successfully");
      } else {
        console.error("AgeChecker loaded but window.AgeChecker is undefined");
        setAgeVerificationMessage("Age verification failed to initialize.");
      }
    };

    script.onerror = (): void => {
      console.error("Failed to load AgeChecker script");
      setIsVerifyingAge(false);
      setAgeVerificationMessage("Age verification service is currently unavailable.");
    };

    document.head.appendChild(script);

    return (): void => {
      if (script.parentNode) {
        document.head.removeChild(script);
      }
      ageCheckerInitialized.current = false;
    };
  }, []);

  // Handle age verification button click
  const handleAgeVerification = (): void => {
    console.log("Age verification button clicked");
    
    if (!window.AgeChecker) {
      console.error("AgeChecker not available");
      setAgeVerificationMessage("Age verification service is loading. Please try again in a moment.");
      return;
    }

    setIsVerifyingAge(true);
    setAgeVerificationMessage("Starting age verification...");

    try {
      // Use your AgeChecker configuration
      window.AgeChecker.verify({
        siteId: ageCheckerConfig.key,
        onSuccess: (result: AgeVerificationResult) => {
          console.log("Age verification result:", result);
          
          if (result.status === 'verified') {
            console.log("User is verified as adult");
            setIsAgeVerified(true);
            setIsVerifyingAge(false);
            setAgeVerificationMessage("✓ Age verified successfully");
            
            // Store verification in localStorage for future visits
            localStorage.setItem('age_verified', 'true');
            localStorage.setItem('age_verification_timestamp', Date.now().toString());
            localStorage.setItem('age_verification_id', result.verificationId || '');
            
            // Optionally, send verification to your backend
            if (user || guestId) {
              api.post('/age-verification/record', {
                userId: user || guestId,
                status: 'verified',
                verificationId: result.verificationId,
                ageVerified: result.ageVerified,
                country: result.country,
                region: result.region,
                timestamp: result.timestamp,
                metadata: result.metadata
              }).catch(error => {
                console.error("Failed to record age verification:", error);
              });
            }
          } else if (result.status === 'underage') {
            console.log("User is underage");
            setIsAgeVerified(false);
            setIsVerifyingAge(false);
            setAgeVerificationMessage("Age verification failed. You must be 21+ to purchase.");
            
            // Clear any stored verification
            localStorage.removeItem('age_verified');
            localStorage.removeItem('age_verification_timestamp');
            localStorage.removeItem('age_verification_id');
            
            // Redirect if configured
            if (ageCheckerConfig.popupType === 'redirect' && ageCheckerConfig.redirectUrl) {
              window.location.href = ageCheckerConfig.redirectUrl;
            }
          } else {
            console.log("Age verification failed");
            setIsAgeVerified(false);
            setIsVerifyingAge(false);
            setAgeVerificationMessage("Age verification could not be completed. Please try again.");
          }
        },
        onFailure: () => {
          console.log("Age verification process failed");
          setIsVerifyingAge(false);
          setAgeVerificationMessage("Age verification service is currently unavailable.");
        }
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Error starting age verification:", errorMessage);
      setIsVerifyingAge(false);
      setAgeVerificationMessage("Failed to start age verification. Please try again.");
    }
  };

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
      isAgeVerified &&
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

    if (!isAgeVerified) {
      alert("Please verify your age before proceeding with the payment.");
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
      <div className="">
        <h1 className="bg-white rounded-lg text-[28px] font-semibold leading-[48px] text-gray-900 text-center p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
          Checkout
        </h1>

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-[32px]">
          {/* LEFT COLUMN: Contact Info + Date of Birth */}
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

            {/* Date of Birth & Age Verification */}
            <div className="bg-white rounded-lg p-[16px] md:p-[32px]">
              <h3 className="font-semibold mb-2">Age Verification</h3>
              <p className="text-xs text-gray-600 mb-4">
                Age verification is required by law. Most customers can be verified instantly. Your information will only be used to verify your age.
              </p>

              {/* Age Verification Status */}
              {ageVerificationMessage && (
                <div className={`mb-4 p-3 rounded-md text-sm ${
                  isAgeVerified 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : ageVerificationMessage.includes("unavailable")
                    ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {ageVerificationMessage}
                </div>
              )}

              <button
                onClick={handleAgeVerification}
                id="checkout-button"
                disabled={isVerifyingAge}
                className={`w-full font-medium py-2 rounded-md text-sm transition-colors ${
                  isAgeVerified 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : isVerifyingAge
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isVerifyingAge ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : isAgeVerified ? (
                  '✓ Age Verified'
                ) : (
                  'Verify Age'
                )}
              </button>
            </div>
          </div>

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
                  isAgeVerified ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"
                } ${!validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isAgeVerified || !validateForm() || cartItems.length === 0}
              >
                {cartItems.length === 0 ? "Cart is Empty" : 
                 isAgeVerified ? `Pay $${total.toFixed(2)}` : "Verify Age First"}
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

          {/* Date of Birth & Age Verification */}
          <div className="bg-white p-[16px] rounded-lg">
            <h3 className="font-semibold mb-2">Age Verification</h3>
            <p className="text-xs text-gray-600 mb-4">
              Age verification is required by law. Most customers can be verified instantly. Your information will only be used to verify your age.
            </p>

            {/* Age Verification Status */}
            {ageVerificationMessage && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                isAgeVerified 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : ageVerificationMessage.includes("unavailable")
                  ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {ageVerificationMessage}
              </div>
            )}

            <button 
              onClick={handleAgeVerification}
              id="checkout-button"
              disabled={isVerifyingAge}
              className={`w-full font-medium py-2 rounded-md text-sm transition-colors ${
                isAgeVerified 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : isVerifyingAge
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-yellow-600 hover:bg-yellow-700 text-white'
              }`}
            >
              {isVerifyingAge ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : isAgeVerified ? (
                '✓ Age Verified'
              ) : (
                'Verify Age'
              )}
            </button>
          </div>

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
                isAgeVerified ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"
              } ${!validateForm() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAgeVerified || !validateForm() || cartItems.length === 0}
            >
              {cartItems.length === 0 ? "Cart is Empty" : 
               isAgeVerified ? `Pay $${total.toFixed(2)}` : "Verify Age First"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;