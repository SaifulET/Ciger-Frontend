"use client";
import { useEffect, useState } from "react";
import mastercard from "@/public/mastercard.svg";
import visacard from "@/public/visaelectron.svg";
import Image from "next/image";
import api from "@/lib/axios";
import useUserStore from "@/app/store/userStore";

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

const CheckoutPage = () => {
  const {user} =useUserStore()
  console.log(user)
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

  const [errors, setErrors] = useState<Errors>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);

  // Dynamically load Collect.js script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://ecrypt.transactiongateway.com/token/Collect.js"; // URL for Collect.js
    script.setAttribute("data-tokenization-key", "your-tokenization-key-here"); // Replace with your actual tokenization key
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.CollectJS) {
        window.CollectJS.configure({
          dataTokenizationKey: "your-tokenization-key-here", // Your tokenization key
          dataVariant: "inline", // Inline form integration
          dataPaymentSelector: "#payButton", // Button that triggers payment
        });
      }
    };

    return () => {
      document.head.removeChild(script); // Cleanup script on unmount
    };
  }, []);

  // Handle form validation and input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    const newValue = type === "checkbox" ? checked : value;

    const newErrors = { ...errors };

    if (name === "email" && type !== "checkbox") {
      if (value && !validateEmail(value)) {
        newErrors.email = "Please enter a valid email";
      } else {
        delete newErrors.email;
      }
    }
    // Additional validation logic can go here for other fields

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setErrors(newErrors);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    return (
      agreedToTerms &&
      isAgeVerified &&
      formData.email &&
      !errors.email &&
      formData.birthMonth &&
      formData.birthDay &&
      formData.birthYear &&
      !errors.birthMonth &&
      !errors.birthDay &&
      !errors.birthYear &&
      formData.cardNumber.replace(/\s/g, "").length === 16 &&
      formData.expiryDate.length === 5 &&
      formData.cvv.length === 6 &&
      formData.cardCountry.length === 4
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fill out all required fields correctly.");
      return;
    }

    // If age verification hasn't been completed, stop the form submission
    if (!isAgeVerified) {
      alert("Please verify your age before proceeding with the payment.");
      return;
    }

    // Collect.js payment tokenization process
    if (window.CollectJS) {
      window.CollectJS.startPaymentRequest();

      window.CollectJS.on("complete", async (e: CollectJSEvent) => {
        const paymentToken = e.paymentToken; // Token received after payment collection

        try {
          // Call backend API to process the payment
          const response = await api.post("/api/payment", {
            paymentToken,
            amount: 1000, // Replace with actual amount in cents
            currency: "USD", // Specify currency
          });

          if (response.data.success) {
            alert("Payment successful!");
          } else {
            alert("Payment failed!");
          }
        } catch (error) {
          console.error("Payment processing error:", error);
          alert("Failed to process payment. Please try again.");
        }
      });

      window.CollectJS.on("failure", (e: CollectJSEvent) => {
        console.log("Payment failed:", e);
        alert("Payment failed. Please check your payment details and try again.");
      });
    } else {
      alert("CollectJS failed to load.");
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
                {/* {cartItems.map((item, idx) => (
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
                ))} */}
              </div>

              {/* <div className="border-t pt-3 space-y-2 text-sm">
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
              </div> */}

              <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
                <span>Total</span>
                {/* <span>${total.toFixed(2)}</span> */}
                <span>$100</span>
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

              <div>
          <button
            id="payButton"
            type="submit"
            className={`w-full py-3 rounded-md text-white ${isAgeVerified ? "bg-green-600" : "bg-yellow-600"}`}
            disabled={!isAgeVerified || !validateForm()}
          >
            {isAgeVerified ? "Proceed with Payment" : "Verify Age First"}
          </button>
        </div>
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
              {/* {cartItems.map((item, idx) => (
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
              ))} */}
            </div>

            {/* <div className="border-t pt-3 space-y-2 text-sm">
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
            </div> */}

            <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-base">
              <span>Total</span>
              {/* <span>${total.toFixed(2)}</span> */}
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

           <div>
          <button
            id="payButton"
            type="submit"
            className={`w-full py-3 rounded-md text-white ${isAgeVerified ? "bg-green-600" : "bg-yellow-600"}`}
            disabled={!isAgeVerified || !validateForm()}
          >
            {isAgeVerified ? "Proceed with Payment" : "Verify Age First"}
          </button>
        </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;