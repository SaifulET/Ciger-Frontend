"use client"
import { useEffect, useState } from 'react';
import mastercard from "@/public/mastercard.svg"
import visacard from "@/public/visaelectron.svg"
import Image from 'next/image';
import api from '@/lib/axios';

// Define types first
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

interface AgeVerificationResult {
  status: 'verified' | 'underage' | 'failed';
  timestamp: string;
  verificationId?: string;
  ageVerified?: number;
  country?: string;
  region?: string;
  metadata?: Record<string, unknown>;
}

interface VerifyAgeResponse {
  valid: boolean;
  message?: string;
  userAge?: number;
  expiresAt?: string;
}

const CheckoutPage = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    city: '',
    state: '',
    zipCode: '',
    address: '',
    apartment: '',
    phone: '',
    saveInfo: false,
    birthMonth: '',
    birthDay: '',
    birthYear: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    cardCountry: '',
    discountCode: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);




  useEffect(() => {
    // AgeChecker configuration
    window.AgeCheckerConfig = {
      element: "#checkout-button",  // ID of the button to trigger the popup
      key: "LtE6WKMhRT41WntUJhk5oiEpuYl6g6SI",  // Replace with your actual AgeChecker API key
      background: "rgba(0, 0, 0, 0.7)",  // Custom background for popup
      font: "'Muli', 'Arial', sans-serif",  // Custom font for popup text
      accent_color: "linear-gradient(135deg, #7fc24c 0%, #04a1bf 100%)",  // Custom button color
      mode: "auto",  // Auto-show the popup when the page loads

      // Optionally, you can add event handlers to customize behavior
      onstatuschanged: (verification) => {
        console.log("abc")
        if (verification.status === "accepted") {
          console.log("User is verified as adult");
          setIsAgeVerified(true)
          // Proceed with checkout, or other actions
        } else {
          console.log("User is denied age verification");
          setIsAgeVerified(false)
          // Handle age denial, redirect, or show an error
        }
      },
    };

    // Dynamically load the AgeChecker script
    const script = document.createElement("script");
    script.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
    script.crossOrigin = "anonymous";
    script.onerror = () => {
      window.location.href = "https://agechecker.net/loaderror";  // Error page if script fails to load
    };

    document.head.appendChild(script);
  }, []);







  // Age verification handler
  // const handleAgeVerification = () => {
    
  //   console.log("90",window. AgeChecker)
  //   if (!window. AgeChecker) {
  //     alert("Age verification system not loaded.");
  //     return;
  //   }

  //   window. AgeChecker.verify({
  //     siteId: "ciger-frontend.vercel.app", // use your domain
  //     onSuccess: async (result: AgeVerificationResult) => {
  //       try {
  //         const res = await api.post<VerifyAgeResponse>("/ageCheck/Age", {
  //           token: result.verificationId
  //         });

  //         if (res.data.valid) {
  //           alert("Age verified successfully!");
  //           setIsAgeVerified(true);
  //           // Optionally save to localStorage
  //           localStorage.setItem('ageVerified', 'true');
  //           localStorage.setItem('ageVerificationTimestamp', new Date().toISOString());
  //         } else {
  //           alert("Verification failed: " + (res.data.message || "Unknown error"));
  //           setIsAgeVerified(false);
  //         }
  //       } catch (error) {
  //         console.error("Age verification API error:", error);
  //         alert("Failed to verify age. Please try again.");
  //         setIsAgeVerified(false);
  //       }
  //     },
  //     onFailure: () => {
  //       alert("Verification canceled or failed.");
  //       setIsAgeVerified(false);
  //     }
  //   });
  // };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    const newValue = type === 'checkbox' ? checked : value;
    
    let processedValue: string | boolean = newValue;
    const newErrors = { ...errors };

    if (name === 'email' && type !== 'checkbox') {
      if (value && !validateEmail(value)) {
        newErrors.email = 'Please enter a valid email';
      } else {
        delete newErrors.email;
      }
      processedValue = value;
    }

    if (name === 'birthMonth' && value) {
      const month = parseInt(value);
      if (month < 1 || month > 12 || value.length > 2) {
        newErrors.birthMonth = 'Month must be 1-12';
      } else {
        delete newErrors.birthMonth;
      }
      processedValue = value.slice(0, 2);
    }

    if (name === 'birthDay' && value) {
      const day = parseInt(value);
      if (day < 1 || day > 31 || value.length > 2) {
        newErrors.birthDay = 'Day must be 1-31';
      } else {
        delete newErrors.birthDay;
      }
      processedValue = value.slice(0, 2);
    }

    if (name === 'birthYear' && value) {
      if (value.length > 4 || (value.length === 4 && isNaN(parseInt(value)))) {
        newErrors.birthYear = 'Year must be 4 digits';
      } else if (value.length === 4 && (parseInt(value) < 1900 || parseInt(value) > new Date().getFullYear())) {
        newErrors.birthYear = 'Year must be valid';
      } else {
        delete newErrors.birthYear;
      }
      processedValue = value.slice(0, 4);
    }

    if (name === 'cardNumber' && value) {
      const cleaned = value.replace(/\s/g, '');
      if (cleaned.length > 16) {
        processedValue = cleaned.slice(0, 16);
      } else {
        processedValue = cleaned;
      }
      if (cleaned.length !== 16 && cleaned.length > 0) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      } else {
        delete newErrors.cardNumber;
      }
      const formatted = (processedValue as string).replace(/(\d{4})/g, '$1 ').trim();
      processedValue = formatted;
    }

    if (name === 'expiryDate' && value) {
      let cleaned = value.replace(/\D/g, '');
      if (cleaned.length > 4) {
        cleaned = cleaned.slice(0, 4);
      }
      if (cleaned.length >= 2) {
        processedValue = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
      } else {
        processedValue = cleaned;
      }
      if (cleaned.length === 4) {
        const month = parseInt(cleaned.slice(0, 2));
        if (month < 1 || month > 12) {
          newErrors.expiryDate = 'Invalid month';
        } else {
          delete newErrors.expiryDate;
        }
      }
    }

    if (name === 'cvv' && value) {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length > 6) {
        processedValue = cleaned.slice(0, 6);
      } else {
        processedValue = cleaned;
      }
      if (cleaned.length !== 6 && cleaned.length > 0) {
        newErrors.cvv = 'CVV must be 6 digits';
      } else {
        delete newErrors.cvv;
      }
    }

    if (name === 'cardCountry' && value) {
      if (value.length > 4) {
        processedValue = value.slice(0, 4);
      } else {
        processedValue = value;
      }
      if ((processedValue as string).length !== 4 && (processedValue as string).length > 0) {
        newErrors.cardCountry = 'Country code must be 4 digits';
      } else {
        delete newErrors.cardCountry;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue,
    }));
    setErrors(newErrors);
  };

  const cartItems = [
    { name: 'Good Stuff Red Pipe Tobacco - 16 oz. Bag', price: 24.50, qty: 3 },
    { name: 'Good Stuff Red Pipe Tobacco - 16 oz. Bag', price: 24.50, qty: 3 },
    { name: 'Good Stuff Red Pipe Tobacco - 16 oz. Bag', price: 24.50, qty: 3 },
    { name: 'Good Stuff Red Pipe Tobacco - 16 oz. Bag', price: 24.50, qty: 3 },
  ];

  const subtotal = 171.50;
  const shipping = 24.50;
  const tax = 24.50;
  const discount = -14.50;
  const total = 206.00;

  const isFormValid = agreedToTerms && 
    isAgeVerified && // Add age verification check
    formData.email && 
    !errors.email &&
    formData.birthMonth && 
    formData.birthDay && 
    formData.birthYear && 
    !errors.birthMonth &&
    !errors.birthDay &&
    !errors.birthYear &&
    formData.cardNumber.replace(/\s/g, '').length === 16 &&
    formData.expiryDate.length === 5 &&
    formData.cvv.length === 6 &&
    formData.cardCountry.length === 4;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    if(!isAgeVerified) {
       alert('Before Payment First Verify Age!');
       return;
    }
    try {
      // Submit order logic here
      
      console.log('Submitting order:', formData);
      // const response = await api.post('/api/checkout', formData);
      // Handle successful checkout
      alert('Order placed successfully!');
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
      <div className="">
        <h1 className="bg-white rounded-lg text-[28px] font-semibold leading-[48px] text-gray-900 text-center p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">Checkout</h1>
      

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
                  <option>Dhaka</option>
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
                  placeholder="Moakhali"
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

            {/* Date of Birth */}
            <div className="bg-white rounded-lg p-[16px] md:p-[32px]">
              <h3 className="font-semibold mb-2">Enter your date of birth</h3>
              <p className="text-xs text-gray-600 mb-4">
                Age verification is required by law. Most customers can be verified instantly. Your information will only be used to verify your age.
              </p>

              {/* <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    MM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="birthMonth"
                    placeholder="01"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthMonth ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    min="1"
                    max="12"
                  />
                  {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="birthDay"
                    placeholder="02"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthDay ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    min="1"
                    max="31"
                  />
                  {errors.birthDay && <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YYYY <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="birthYear"
                    placeholder="1998"
                    className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthYear ? 'border-red-500' : 'border-gray-300'}`}
                    value={formData.birthYear}
                    onChange={handleInputChange}
                  />
                  {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
                </div>
              </div> */}

              <button
                // onClick={handleAgeVerification}
                id="checkout-button"

                className={`w-full font-medium py-2 rounded-md text-sm ${
                  isAgeVerified 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
              >
                {isAgeVerified ? '✓ Age Verified' : 'Verify Age'}
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary + Discount + Payment */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white p-[16px] md:p-[32px] rounded-lg mb-[16px] md:mb-[32px]">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="text-gray-700">{item.name}</p>
                    </div>
                    <div className="flex gap-8 ml-4">
                      <span className="text-gray-600 w-16 text-right">${item.price.toFixed(2)}</span>
                      <span className="text-gray-600 w-8 text-center">{item.qty}</span>
                      <span className="font-medium w-16 text-right">${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sub Total</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Cost</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Sales Tax</span>
                  <span className="font-medium pl-[32px]">5%</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Discount CODE</span>
                  <span className="font-medium">5%</span>
                  <span className="font-medium text-red-500">${discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
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
                  placeholder="Code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  value={formData.discountCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
                />
                <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-6 py-2 rounded-md text-sm">
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
                  placeholder="xxxx"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cardCountry ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.cardCountry}
                  onChange={handleInputChange}
                  name="cardCountry"
                  maxLength={4}
                />
                {errors.cardCountry && <p className="text-red-500 text-xs mt-1">{errors.cardCountry}</p>}
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full font-semibold py-3 rounded-md text-base transition ${
                  isFormValid
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Confirm & Pay ${total.toFixed(2)}
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Layout - Same form wrapped */}
        <form onSubmit={handleSubmit} className="lg:hidden space-y-6">
          {/* Mobile sections remain the same, just wrap the entire content in form */}
           <div className="bg-white  p-[16px]  rounded-lg">
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
  <option>Dhaka</option>
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

          {/* Date of Birth */}
          <div className="bg-white  p-[16px]  rounded-lg">
            <h3 className="font-semibold mb-2">Enter your date of birth</h3>
            <p className="text-xs text-gray-600 mb-4">
              Age verification is required by law. Most customers can be verified instantly. Your information will only be used to verify your age.
            </p>
{/* 
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  MM <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="birthMonth"
                  placeholder="01"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthMonth ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.birthMonth}
                  onChange={handleInputChange}
                  min="1"
                  max="12"
                />
                {errors.birthMonth && <p className="text-red-500 text-xs mt-1">{errors.birthMonth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DD <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="birthDay"
                  placeholder="02"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthDay ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.birthDay}
                  onChange={handleInputChange}
                  min="1"
                  max="31"
                />
                {errors.birthDay && <p className="text-red-500 text-xs mt-1">{errors.birthDay}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YYYY <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="birthYear"
                  placeholder="1998"
                  className={`w-full px-3 py-2 border rounded-md text-sm ${errors.birthYear ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.birthYear}
                  onChange={handleInputChange}
                />
                {errors.birthYear && <p className="text-red-500 text-xs mt-1">{errors.birthYear}</p>}
              </div>
            </div> */}

            <button id="checkout-button" className={`w-full font-medium py-2 rounded-md text-sm ${
                  isAgeVerified 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}>
               {isAgeVerified ? '✓ Age Verified' : 'Verify Age'}
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white  p-[16px]  rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <div className="flex-1">
                    <p className="text-gray-700">{item.name}</p>
                  </div>
                  <div className="flex gap-4 ml-4">
                    <span className="text-gray-600 text-right">${item.price.toFixed(2)}</span>
                    <span className="text-gray-600">{item.qty}</span>
                    <span className="font-medium text-right">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Cost</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sales Tax</span>
                <span className="font-medium pl-[32px]">5%</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Discount CODE</span>
                <span className="text-gray-600">5%</span>
                <span className="font-medium text-red-500">${discount.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="termsMobile"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300"
              />
              <label htmlFor="termsMobile" className="ml-2 text-sm text-gray-700">
                I agree to the terms and refund policy
              </label>
            </div>
          </div>

          {/* Discount Code */}
          <div className="bg-white  p-[16px] rounded-lg">
            <h3 className="font-semibold mb-3">Discount Code</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code"
                className="flex-1 px-2 md:px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={formData.discountCode}
                onChange={(e) => setFormData(prev => ({ ...prev, discountCode: e.target.value }))}
              />
              <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-4 md:px-6 py-2 rounded-md text-sm">
                Apply
              </button>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white  p-[16px]  rounded-lg">
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
                placeholder="xxxx"
                className={`w-full px-3 py-2 border rounded-md text-sm ${errors.cardCountry ? 'border-red-500' : 'border-gray-300'}`}
                value={formData.cardCountry}
                onChange={handleInputChange}
                name="cardCountry"
                maxLength={4}
              />
              {errors.cardCountry && <p className="text-red-500 text-xs mt-1">{errors.cardCountry}</p>}
            </div>

            <button
              disabled={!isFormValid}
              className={`w-full font-semibold py-3 rounded-md text-base transition ${
                isFormValid
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Confirm & Pay ${total.toFixed(2)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;