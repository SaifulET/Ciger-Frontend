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

// Collect.js Types
interface CollectJSCard {
  number: string;
  bin: string;
  exp: string;
  hash: string;
  type: string;
}

interface CollectJSCheck {
  name: string;
  account: string;
  hash: string;
  aba: string;
}

interface CollectJSResponse {
  token: string;
  card: CollectJSCard;
  check: CollectJSCheck;
}

// Simplified interface for CollectJSConfig
interface CollectJSConfig {
  callback: (response: CollectJSResponse) => void;
  paymentType?: "cc" | "ach" | "eft";
  fields?: Record<string, unknown>;
  [key: string]: unknown;
}

declare global {
  interface Window {
    AgeCheckerConfig?: AgeCheckerConfig;
    CollectJS?: {
      configure: (config: CollectJSConfig) => void;
      startPaymentRequest: () => void;
      closeCheckout?: () => void;
    };
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
    paymentToken?: string;
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
interface DiscountResponse {
  success: boolean;
  percentage?: number;
  message?: string;
}

const CheckoutPage = () => {
  const { user } = useUserStore();
  const { guestId,initializeCart } = useCartStore();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [servicePricing, setServicePricing] = useState<ServicePricing | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const[transactionid,setTransactionid]=useState(0);
  const [orderFailed,setOrderFailed]=useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
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


  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState<string | null>(null);



  const [errors, setErrors] = useState<Errors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [taxMessage, setTaxMessage] = useState("");
  const [tax, setTax] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [isCalculatingTax, setIsCalculatingTax] = useState(false);
  const [isAgeChecked, setIsAgeChecked] = useState(false);

  // Collect.js states
  const [isCollectJSLoaded, setIsCollectJSLoaded] = useState(false);
  const [paymentToken, setPaymentToken] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [collectJSError, setCollectJSError] = useState<string | null>(null);


  const collectJSConfiguredRef = useRef(false);
  const COLLECT_JS_TOKENIZATION_KEY = "kys4zk-Gg5DDh-35QMup-h39wNz";
 

  // Age Checker
 useEffect(() => {
  // Early return for SSR
  if (typeof window === "undefined") return;

  // Check if script is already loaded to avoid duplicates
  if (document.querySelector('script[src*="agechecker.net"]')) {
    console.log("Age checker script already loaded");
    return;
  }

  const onVerified = () => {
    console.log("Age verification successful!");
    setIsAgeChecked(true);
    // You could also trigger checkout or other actions here
  };

  // Configure the global settings
  window.AgeCheckerConfig = {
    element: "#checkout-button",
    key: "LtE6WKMhRT41WntUJhk5oiEpuYl6g6SI",
    onVerified,
    // Optional: Add error handling
    // onUnverified: () => console.log("Age verification failed"),
    // onError: (error) => console.error("Age checker error:", error)
  };

  // Load the script
  const script = document.createElement("script");
  script.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
  script.crossOrigin = "anonymous";
  script.async = true;

  script.onload = () => {
    
    console.log("Age checker script loaded successfully");
  };

  script.onerror = () => {
    console.log("Failed to load age checker script");
    setIsAgeChecked(false);
    // Optional: Handle fallback behavior here
    // You might want to proceed without age check in development
  };

  document.head.appendChild(script);

  // Cleanup function
  return () => {
    // Remove the script if it exists
    if (script.parentNode) {
      console.log("Removing age checker script");
      script.parentNode.removeChild(script);
    }
    
    // Clean up global variable
    delete window.AgeCheckerConfig;
    
    // Optional: Reset age check state if component unmounts
    // setIsAgeChecked(false);
  };
}, []);

  // Collect.js loading and configuration
  useEffect(() => {
    if (typeof window === "undefined") return;

    const configureCollectJS = () => {
      if (!window.CollectJS) {
        console.error("Collect.js not available for configuration");
        return;
      }

      if (collectJSConfiguredRef.current) {
        console.log("Collect.js already configured");
        return;
      }

      try {
        // Minimal configuration - just to check if Collect.js works
        const config: CollectJSConfig = {
          callback: () => {
            console.log("Collect.js initialized successfully");
          },
          paymentType: "cc"
        };

        console.log("Configuring Collect.js with minimal config");
        window.CollectJS.configure(config);
        collectJSConfiguredRef.current = true;
        console.log("Collect.js configured successfully");
        setCollectJSError(null);
      } catch (configError) {
        console.error("Error configuring Collect.js:", configError);
        setCollectJSError("Failed to configure payment processor.");
      }
    };

    // Check if Collect.js is already loaded
    if (window.CollectJS) {
      console.log("Collect.js already loaded, configuring...");
      configureCollectJS();
      setIsCollectJSLoaded(true);
      return;
    }

    // Check if script already exists
    if (document.querySelector('script[src*="Collect.js"]')) {
      console.log("Collect.js script already exists, waiting for load...");
      return;
    }

    // Load Collect.js script
    const script = document.createElement("script");
    script.src = "https://ecrypt.transactiongateway.com/token/Collect.js";
    script.async = true;
    script.id = "collect-js-script";
    script.setAttribute("data-tokenization-key", COLLECT_JS_TOKENIZATION_KEY);

    script.onload = () => {
      console.log("Collect.js loaded successfully");
      setIsCollectJSLoaded(true);
      setTimeout(() => {
        configureCollectJS();
      }, 500);
    };

    script.onerror = (error) => {
      console.error("Failed to load Collect.js:", error);
      setCollectJSError(
        "Failed to load payment processor. Please refresh the page."
      );
      setIsCollectJSLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.getElementById("collect-js-script");
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  // Submit order with payment token
  const submitOrderWithToken = async (token: string) => {
    try {
      console.log("Preparing to submit order with token:", token);

      // Validate all required data before submission
      const validationErrors: string[] = [];

      if (!user && !guestId) {
        validationErrors.push("User identification is missing");
      }

      if (cartItems.length === 0) {
        validationErrors.push("Cart is empty");
      }

      if (!formData.email || !validateEmail(formData.email)) {
        validationErrors.push("Valid email is required");
      }

      if (!formData.firstName.trim()) {
        validationErrors.push("First name is required");
      }

      if (!formData.lastName.trim()) {
        validationErrors.push("Last name is required");
      }

      if (!formData.address.trim()) {
        validationErrors.push("Address is required");
      }

      if (!formData.city.trim()) {
        validationErrors.push("City is required");
      }

      if (!formData.state.trim()) {
        validationErrors.push("State is required");
      }

      if (!formData.zipCode.trim()) {
        validationErrors.push("ZIP code is required");
      }

      if (!formData.phone.trim()) {
        validationErrors.push("Phone is required");
      }

      if (!agreedToTerms) {
        validationErrors.push("You must agree to the terms and conditions");
      }

      if (!isAgeChecked) {
        validationErrors.push("Age verification is required");
      }

      if (validationErrors.length > 0) {
        console.error("Validation errors:", validationErrors);
        alert(`Cannot submit order:\n${validationErrors.join("\n")}`);
        return;
      }
      if(!isCalculatingTax)
{
  alert("Wrong address provided for tax calculation. Please check your address details.");
}
      console.log("All validation passed, creating order data...");

      const orderData: OrderData = {
        userId: user || guestId,
        items: cartItems.map((item: CartItem) => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.price,
          discount: item.productId.discount,
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
          apartment: formData.apartment,
        },
        payment: {
          paymentMethod: "credit_card",
          amount: total,
          currency: "USD",
          paymentToken: token,
        },
        totals: {
          subtotal,
          shipping: shippingCost,
          tax,
          discount,
          total,
        },
      };

      console.log("Submitting order with complete data:", orderData);

      const response = await api.post<{
        success: boolean;
        message?: string;
        orderid?: string;
        transactionid?:number;
      }>("/payment/payment", orderData);
      console.log("Order submission response:", response.data);

      if (response.data.success) {
        console.log("Order placed successfull", response.data);
        setTransactionid(response.data.transactionid || 0);
        
      } else {
        setOrderFailed(true);
        
      
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      
       setOrderFailed(true);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Cache for tax calculations
  const cacheTaxCalculation = useCallback(
    (
      zip: string,
      state: string,
      amount: number,
      calculatedTax: number
    ): void => {
      if (typeof window === "undefined") return;

      const cacheKey = `tax_${zip}_${state}_${Math.round(amount)}`;
      const cacheData: TaxCacheData = {
        tax: calculatedTax,
        timestamp: Date.now(),
        expiresIn: 24 * 60 * 60 * 1000,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));
    },
    []
  );

  const getCachedTax = useCallback(
    (zip: string, state: string, amount: number): number | null => {
      if (typeof window === "undefined") return null;

      const cacheKey = `tax_${zip}_${state}_${Math.round(amount)}`;
      const cached = localStorage.getItem(cacheKey);

      if (cached) {
        try {
          const data: TaxCacheData = JSON.parse(cached);
          if (Date.now() - data.timestamp < data.expiresIn) {
            return data.tax;
          }
        } catch (error: unknown) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error("Error reading tax cache:", errorMessage);
        }
      }
      return null;
    },
    []
  );

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
  }, [formData.zipCode, formData.state, cartItems.length]);

  // Fetch cart data and service pricing
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        console.log("fetching data for checkout");
        setLoading(true);

        // Fetch cart items
        if (user) {
          const cartResponse = await api.get<CartApiResponse>(
            `/cart/getUserCart/${user}`
          );
          console.log("Cart response:", cartResponse.data);
          if (cartResponse.data.success) {
            setCartItems(cartResponse.data.data);
          } else {
            console.error("Failed to fetch cart:", cartResponse.data);
          }
        } else if (guestId) {
          console.log("fetching cart for guest", guestId);
          const cartResponse = await api.get<CartApiResponse>(
            `/cart/getUserCart/${guestId}`
          );
          console.log("Cart response for guest:", cartResponse.data);
          if (cartResponse.data.success) {
            setCartItems(cartResponse.data.data);
          } else {
            console.error("Failed to fetch guest cart:", cartResponse.data);
          }
        }

        // Fetch service pricing
        const pricingResponse = await api.get<ServicePricingApiResponse>(
          "/servicePricing/getServicePricing"
        );
        console.log("Service pricing:", pricingResponse.data);
        if (pricingResponse.data.success) {
          setServicePricing(pricingResponse.data.data);
        } else {
          console.error(
            "Failed to fetch service pricing:",
            pricingResponse.data
          );
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
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
      return sum + discountedPrice * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate shipping cost based on service pricing
  const shippingCost = useMemo((): number => {
    if (!servicePricing) return 0;

    return subtotal >= servicePricing.MinimumFreeShipping
      ? 0
      : servicePricing.shippingCost;
  }, [servicePricing, subtotal]);




const handleApplyDiscount = async (): Promise<void> => {
    const code = formData.discountCode.trim();
    
    if (!code) {
      setDiscountApplied(false);
      setDiscountPercent(0);
      setDiscountError(null);
      return;
    }

    setDiscountLoading(true);
    setDiscountError(null);

    try {
      const response = await api.get<DiscountResponse>(`/discount/getDiscountByCode/${code}`);
      
      console.log("Discount API response:", response.data);
      
      if (response.data.success && response.data.percentage !== undefined) {
        setDiscountApplied(true);
        setDiscountPercent(response.data.percentage);
        setDiscountError(null);
       
      } else {
        setDiscountApplied(false);
        setDiscountPercent(0);
        setDiscountError(response.data.message || "Invalid discount code");
        
      }
    } catch (error: unknown) {
      console.error("Error applying discount:", error);
      setDiscountApplied(false);
      setDiscountPercent(0);
      setDiscountError("Failed to apply discount. Please try again.");
      
      // Check if it's an axios error
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response?.data?.message) {
          setDiscountError(axiosError.response.data.message);
        }
      }
      
      alert("Failed to apply discount. Please try again.");
    } finally {
      setDiscountLoading(false);
    }
  };






  // Calculate discount from applied code
  const discount = useMemo((): number => {
    return discountApplied ? subtotal * (discountPercent / 100) : 0;
  }, [discountApplied, discountPercent, subtotal]);

  // Memoized dependencies for tax calculation
  const taxCalculationDeps = useMemo(
    (): { zip: string; state: string; subtotal: number; shipping: number } => ({
      zip: formData.zipCode,
      state: formData.state,
      subtotal: Math.round(subtotal * 100),
      shipping: Math.round(shippingCost * 100),
    }),
    [formData.zipCode, formData.state, subtotal, shippingCost]
  );

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
      const cachedTax = getCachedTax(
        formData.zipCode,
        formData.state,
        subtotal
      );
      if (cachedTax !== null) {
        setTax(cachedTax);
        setTaxRate(subtotal > 0 ? (cachedTax / subtotal) * 100 : 0);
        setTaxMessage("");
        return;
      }

      setIsCalculatingTax(true);
      setTaxMessage("Calculating tax...");

      try {
        const response = await api.post<TaxResponse>("/tax/calculateTax", {
          amount: subtotal,
          to_zip: formData.zipCode,
          to_state: formData.state,
          shipping: shippingCost,
        });

        console.log("Tax API response:", response.data);

        if (response.data?.tax?.amount_to_collect !== undefined) {
          const taxAmount: number = response.data.tax.amount_to_collect;
          setTax(taxAmount);

          // Calculate tax rate percentage for display
          const rate: number = subtotal > 0 ? (taxAmount / subtotal) * 100 : 0;
          setTaxRate(rate);

          // Cache the successful calculation
          cacheTaxCalculation(
            formData.zipCode,
            formData.state,
            subtotal,
            taxAmount
          );
          setTaxMessage("");
        } else {
          setTax(0);
          setTaxRate(0);
          setTaxMessage("Unable to calculate tax. Please check your address.");
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
       
        setTax(0);
        setTaxRate(0);
        setTaxMessage("Unable to calculate tax. Please verify your address.");
      } finally {
        setIsCalculatingTax(false);
      }
    };

    const timeoutId: NodeJS.Timeout = setTimeout(calculateTax, 500);

    return (): void => clearTimeout(timeoutId);
  }, [
    taxCalculationDeps,
    shouldCalculateTax,
    getCachedTax,
    cacheTaxCalculation,
    shippingCost,
    subtotal,
    formData.state,
    formData.zipCode,
  ]);

  // Calculate total
  const total = useMemo((): number => {
    return subtotal + shippingCost + tax - discount;
  }, [subtotal, shippingCost, tax, discount]);

  // Handle form validation and input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    const isCheckbox: boolean = type === "checkbox";
    const checked: boolean = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : false;
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
      const cleaned: string = value.replace(/\s/g, "");
      if (cleaned && !/^\d+$/.test(cleaned)) {
        newErrors.cardNumber = "Card number must contain only digits";
      } else if (cleaned && cleaned.length !== 16) {
        newErrors.cardNumber = "Card number must be 16 digits";
      } else {
        delete newErrors.cardNumber;
      }

      // Format card number with spaces
      if (cleaned.length <= 16) {
        const formatted: string = cleaned.replace(/(\d{4})/g, "$1 ").trim();
        setFormData((prev) => ({ ...prev, [name]: formatted }));
      }
      return;
    }

    // Expiry date validation and formatting
    if (name === "expiryDate") {
      const cleaned: string = value.replace(/\D/g, "");
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

      setFormData((prev) => ({ ...prev, [name]: formatted }));
      return;
    }

    // CVV validation
    if (name === "cvv") {
      const cleaned: string = value.replace(/\D/g, "");
      if (cleaned.length > 6) return;

      if (cleaned && cleaned.length < 3) {
        newErrors.cvv = "CVV must be 3-6 digits";
      } else {
        delete newErrors.cvv;
      }

      setFormData((prev) => ({ ...prev, [name]: cleaned }));
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

  // SIMPLIFIED validateForm - only for button enablement
  const validateForm = (): boolean => {
    const isValid =
      agreedToTerms &&
      formData.email !== "" &&
      !errors.email &&
      isAgeChecked &&
      cartItems.length > 0;

    return isValid;
  };

  // const handleApplyDiscount = (): void => {
  //   if (formData.discountCode.trim() !== "") {
  //     if (formData.discountCode.toUpperCase() === "SAVE10") {
  //       setDiscountApplied(true);
  //       setDiscountPercent(10);
  //     } else {
  //       setDiscountApplied(false);
  //       setDiscountPercent(0);
  //       alert("Invalid discount code. Try 'SAVE10' for 10% off.");
  //     }
  //   } else {
  //     setDiscountApplied(false);
  //     setDiscountPercent(0);
  //   }
  // };

  // Modified handleSubmit to use Collect.js
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log("Submit clicked", {
      isCollectJSLoaded,
      windowCollectJS: !!window.CollectJS,
      validateFormResult: validateForm(),
      cartItems: cartItems.length,
      email: formData.email,
      agreedToTerms,
      isAgeChecked,
      errors,
    });

    if (!validateForm()) {
      let errorMessage = "Please complete the following:\n";
      if (!agreedToTerms) errorMessage += "• Agree to terms and conditions\n";
      if (!formData.email) errorMessage += "• Enter email address\n";
      if (errors.email) errorMessage += `• Fix email error: ${errors.email}\n`;
      if (!isAgeChecked) errorMessage += "• Complete age verification\n";
      if (cartItems.length === 0) errorMessage += "• Add items to cart\n";

      alert(errorMessage);
      return;
    }

    // Validate ALL required form fields BEFORE opening payment modal
    const validationErrors: string[] = [];

    if (cartItems.length === 0) {
      validationErrors.push("Cart is empty");
    }

    if (!formData.email || !validateEmail(formData.email)) {
      validationErrors.push("Valid email is required");
    }

    if (!formData.firstName.trim()) {
      validationErrors.push("First name is required");
    }

    if (!formData.lastName.trim()) {
      validationErrors.push("Last name is required");
    }

    if (!formData.address.trim()) {
      validationErrors.push("Address is required");
    }

    if (!formData.city.trim()) {
      validationErrors.push("City is required");
    }

    if (!formData.state.trim()) {
      validationErrors.push("State is required");
    }

    if (!formData.zipCode.trim()) {
      validationErrors.push("ZIP code is required");
    }

    if (!formData.phone.trim()) {
      validationErrors.push("Phone is required");
    }

    if (!agreedToTerms) {
      validationErrors.push("You must agree to the terms and conditions");
    }

    if (!isAgeChecked) {
      validationErrors.push("Age verification is required");
    }

    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      alert(`Please complete all required fields:\n${validationErrors.join("\n")}`);
      return;
    }

    if (!isCollectJSLoaded) {
      alert("Payment processor is still loading. Please try again in a moment.");
      return;
    }

    if (!window.CollectJS) {
      alert("Payment processor not available. Please refresh the page.");
      return;
    }

    if (!collectJSConfiguredRef.current) {
      alert("Payment processor not properly configured. Please try again.");
      return;
    }

    setIsProcessingPayment(true);
    console.log("Starting Collect.js payment request...");

    try {
      // Reconfigure Collect.js with the actual payment callback
      const paymentConfig: CollectJSConfig = {
        callback: (response: CollectJSResponse) => {
          console.log("Collect.js payment callback received:", response);
          setPaymentToken(response.token);
          setIsProcessingPayment(false);
          submitOrderWithToken(response.token);
        },
        paymentType: "cc"
      };

      console.log("Configuring Collect.js for payment");
      window.CollectJS.configure(paymentConfig);
      
      // This triggers the Collect.js lightbox/payment modal
      window.CollectJS.startPaymentRequest();
    } catch (error) {
      console.error("Error starting payment request:", error);
      alert(`Failed to process payment: ${error instanceof Error ? error.message : "Unknown error"}`);
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    );
  }
  if(orderFailed==true){
 return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Sorry! 
        </h1>
        
        <p className="text-gray-600 text-base md:text-lg mb-6">
          Your order could not be processed.<br></br>
         
        </p>
        
        <div className="text-sm text-gray-600 mb-6">
          Please try again or
          <a 
            href="/pages/contact" 
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Contact us
          </a>
        </div>
        
        <a href="/pages" className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded transition-colors duration-200">
          Continue to homepage
        </a>
      </div>
    </div>
  );

  }
  if(transactionid!==0 && orderFailed==false){
 
    return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Thank You!
        </h1>
        
        <p className="text-gray-600 text-base md:text-lg mb-6">
          Your order has been successfully processed.<br></br>
          Your transaction ID is <span className="font-mono font-semibold">{transactionid}</span>
        </p>
        
        <div className="text-sm text-gray-600 mb-6">
          Having trouble?{' '}
          <a 
            href="/pages/contact" 
            className="text-blue-500 hover:text-blue-600 underline"
          >
            Contact us
          </a>
        </div>
        
        <a href="/pages" className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded transition-colors duration-200">
          Continue to homepage
        </a>
      </div>
    </div>
  );
  }
if(transactionid===0 && orderFailed==false)
  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
      <noscript>
        <meta
          httpEquiv="refresh"
          content="0;url=https://agechecker.net/noscript"
        />
      </noscript>

      {collectJSError && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{collectJSError}</p>
        </div>
      )}

      {!isCollectJSLoaded && !collectJSError && (
        <div className="max-w-6xl mx-auto mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-700">Loading payment processor...</p>
        </div>
      )}

    
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
              <h2 className="text-lg font-semibold mb-4">
                Contact Information
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
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
                    placeholder="Enter last name"
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
                    backgroundPosition: "right 0.5rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
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
                    placeholder="Enter city"
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
                    placeholder="Enter state"
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
                  placeholder="Enter ZIP code"
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
                  placeholder="Enter street address"
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
                  placeholder="Enter apartment/suite"
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
                  placeholder="Enter phone number"
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
                <label
                  htmlFor="saveInfo"
                  className="ml-2 text-sm text-gray-700"
                >
                  Save this information for next time
                </label>
              </div>
            </div>
            <div>
              <button
            id="checkout-button"
            onClick={() => setIsAgeChecked(true)}
            className={`${isAgeChecked?"bg-green-600 hover:bg-green-700":"bg-yellow-600 hover:bg-yellow-700"} py-3 w-full rounded-md  transition-colors`}
          >
            {isAgeChecked ? (
              <p className="text-gray-50  font-medium">Age verification passed ✅</p>
            ) : (
              <p className="text-gray-900  font-medium">Please verify your age</p>
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
                <div className="text-center p-4">
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                  <p className="text-xs text-red-500 mt-2">
                    Please add items to your cart before checking out
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                    {cartItems.map((item: CartItem) => {
                      const price: number = item.productId.price || 0;
                      const discount: number = item.productId.discount || 0;
                      const discountedPrice: number =
                        price * (1 - discount / 100);
                      const itemTotal: number = discountedPrice * item.quantity;

                      return (
                        <div
                          key={item._id}
                          className="flex justify-between text-sm"
                        >
                          <div className="flex-1">
                            <p className="text-gray-700">
                              {item.productId.name}
                            </p>
                          </div>
                          <div className="flex gap-8 ml-4">
                            <span className="text-gray-600 w-16 text-right">
                              ${discountedPrice.toFixed(2)}
                            </span>
                            <span className="text-gray-600 w-8 text-center">
                              {item.quantity}
                            </span>
                            <span className="font-medium w-16 text-right">
                              ${itemTotal.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="border-t pt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sub Total</span>
                      <span className="font-medium">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Cost</span>
                      <span className="font-medium">
                        {shippingCost === 0
                          ? "FREE"
                          : `$${shippingCost.toFixed(2)}`}
                        {servicePricing &&
                          subtotal >= servicePricing.MinimumFreeShipping && (
                            <span className="text-xs text-green-600 ml-1">
                              (Free shipping over $
                              {servicePricing.MinimumFreeShipping})
                            </span>
                          )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sales Tax</span>
                      {isCalculatingTax ? (
                        <span className="text-gray-500 text-sm">
                          Calculating...
                        </span>
                      ) : taxMessage ? (
                        <span className="text-xs text-red-600">
                          {taxMessage}
                        </span>
                      ) : (
                        <>
                          <span className="font-medium pl-[32px]">
                            {taxRate.toFixed(2)}%
                          </span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </>
                      )}
                    </div>
                    {discountApplied && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discount Code</span>
                        <span className="font-medium">{discountPercent}%</span>
                        <span className="font-medium text-red-500">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setAgreedToTerms(e.target.checked)
                  }
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({
                      ...prev,
                      discountCode: e.target.value,
                    }))
                  }
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

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>

              {/* Collect.js Info */}
              {!isCollectJSLoaded && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-700">
                    Payment processor loading...
                  </p>
                </div>
              )}

             

              <div className="mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={mastercard}
                      alt="Mastercard"
                      width={40}
                      height={25}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Image src={visacard} alt="Visa" width={40} height={25} />
                  </div>
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
                  className={`w-full px-3 py-2 border rounded-md text-sm ${
                    errors.cardCountry ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.cardCountry}
                  onChange={handleInputChange}
                  name="cardCountry"
                />
                {errors.cardCountry && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.cardCountry}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-md text-white font-medium transition-colors ${"bg-green-600 hover:bg-green-700"} ${
                  !validateForm() || !isCollectJSLoaded || isProcessingPayment
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  !validateForm() ||
                  !isCollectJSLoaded ||
                  isProcessingPayment ||
                  cartItems.length === 0 || !isAgeChecked
                }
              >
                {isProcessingPayment
                  ? "Processing..."
                  : !isCollectJSLoaded
                  ? "Loading Payment..."
                  : cartItems.length === 0
                  ? "Cart is Empty"
                  : `Pay $${total.toFixed(2)}`}
              </button>

              {!isAgeChecked && (
                <p className="text-sm text-red-600 mt-2 text-center">
                  Please verify your age before proceeding
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Layout */}
        <form onSubmit={handleSubmit} className="lg:hidden space-y-6">
          {/* Collect.js Status */}
          {!isCollectJSLoaded && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Loading payment processor...
              </p>
            </div>
          )}

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
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                  backgroundPosition: "right 0.5rem center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "1.5em 1.5em",
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
              <label
                htmlFor="saveInfoMobile"
                className="ml-2 text-sm text-gray-700"
              >
                Save this information for next time
              </label>
            </div>
          </div>

          {/* Age Checker Button */}
             <button
            id="checkout-button"
            onClick={() => setIsAgeChecked(true)}
            className={`${isAgeChecked?"bg-green-600 hover:bg-green-700":"bg-yellow-600 hover:bg-yellow-700"} py-3 w-full rounded-md  transition-colors`}
          >
            {isAgeChecked ? (
              <p className="text-gray-50  font-medium">Age verification passed ✅</p>
            ) : (
              <p className="text-gray-900  font-medium">Please verify your age</p>
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
                    const discountedPrice: number =
                      price * (1 - discount / 100);
                    const itemTotal: number = discountedPrice * item.quantity;

                    return (
                      <div
                        key={item._id}
                        className="flex justify-between text-sm"
                      >
                        <div className="flex-1">
                          <p className="text-gray-700">{item.productId.name}</p>
                        </div>
                        <div className="flex gap-4 ml-4">
                          <span className="text-gray-600">
                            ${discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-600">{item.quantity}</span>
                          <span className="font-medium">
                            ${itemTotal.toFixed(2)}
                          </span>
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
                      {shippingCost === 0
                        ? "FREE"
                        : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sales Tax</span>
                    {isCalculatingTax ? (
                      <span className="text-gray-500 text-sm">
                        Calculating...
                      </span>
                    ) : taxMessage ? (
                      <span className="text-xs text-red-600">{taxMessage}</span>
                    ) : (
                      <>
                        <span className="font-medium">
                          {taxRate.toFixed(2)}%
                        </span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </>
                    )}
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount Code</span>
                      <span className="text-gray-600">{discountPercent}%</span>
                      <span className="font-medium text-red-500">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="termsMobile"
                checked={agreedToTerms}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAgreedToTerms(e.target.checked)
                }
                className="w-4 h-4 rounded border-gray-300"
              />
              <label
                htmlFor="termsMobile"
                className="ml-2 text-sm text-gray-700"
              >
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData((prev) => ({
                    ...prev,
                    discountCode: e.target.value,
                  }))
                }
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

            {/* Payment Status */}
            {!isCollectJSLoaded && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-700">
                  Payment processor loading...
                </p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Type
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Image
                    src={mastercard}
                    alt="Mastercard"
                    width={40}
                    height={25}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Image src={visacard} alt="Visa" width={40} height={25} />
                </div>
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
                className={`w-full px-3 py-2 border rounded-md text-sm ${
                  errors.cardCountry ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.cardCountry}
                onChange={handleInputChange}
                name="cardCountry"
              />
              {errors.cardCountry && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cardCountry}
                </p>
              )}
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-md text-white font-medium transition-colors ${"bg-green-600 hover:bg-green-700"} ${
                !validateForm() || !isCollectJSLoaded || isProcessingPayment
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                !validateForm() ||
                !isCollectJSLoaded ||
                isProcessingPayment ||
                cartItems.length === 0
              }
            >
              {isProcessingPayment
                ? "Processing..."
                : !isCollectJSLoaded
                ? "Loading Payment..."
                : cartItems.length === 0
                ? "Cart is Empty"
                : `Pay $${total.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;