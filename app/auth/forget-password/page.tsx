"use client"; // If using App Router

import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo2.png"
import useUserStore from "@/app/store/userStore";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { UserForgetPasswordRequest } = useUserStore();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    console.log(email);
    const res = await UserForgetPasswordRequest(email);
    console.log(res);
    
    if (res.message === "OTP sent to email") {
      router.push("/auth/otp");
    } else {
      setErrorMessage(res.message || "Something went wrong");
    }
    setIsLoading(false);
  };

  const handleBackToLogin = () => {
    router.push("/auth/signin");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Back button for mobile */}
      <button 
        onClick={handleBack}
        className="md:hidden absolute top-4 left-4 z-10 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8 md:py-0">
        <div className=" md:w-[564px] bg-white p-[16px] md:p-[32px] flex flex-col items-center gap-4 md:gap-6 rounded-xl shadow-lg md:shadow-xl">
          {/* Logo */}
          <div className="w-full max-w-[280px] md:max-w-[500px] h-16 md:h-24 flex items-center justify-center">
            <div className="text-center">
              <Image 
                src={logo} 
                alt="logo" 
                width={180} 
                height={180} 
                className="w-[180px] h-auto md:w-[220px]"
                priority
              />
            </div>
          </div>

          {/* Title and subtitle section */}
          <div className="w-full max-w-[277px] md:w-[277px] h-auto md:h-16 flex flex-col items-center gap-1 md:gap-2">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-tight md:leading-9 text-center">
              Forgot Password
            </h2>
            <p className="text-sm md:text-base text-gray-500 leading-5 md:leading-6 text-center">
              Enter your email to reset password
            </p>
          </div>

          {/* Form section */}
          <div className="w-full md:w-[500px] h-auto md:h-[238px] flex flex-col gap-4 md:gap-6">
            {/* Email field */}
            <div className="flex flex-col gap-2 h-auto md:h-[86px]">
              <label
                htmlFor="email"
                className="text-base md:text-lg font-medium md:font-semibold text-gray-800 leading-6"
              >
                Email
              </label>
              <div className="relative">
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 gap-2 h-[48px] md:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <Mail
                    className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm md:text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !email}
              className="w-full bg-[#FFCF00] hover:bg-[#b59300] disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-medium text-sm md:text-base py-3 md:py-4 px-8 rounded-xl h-[48px] md:h-[55px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm md:text-base">Sending...</span>
                </div>
              ) : (
                "Next"
              )}
            </button>

            {/* Back to Login button */}
            <button
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-gray-800 hover:text-gray-900 font-medium text-sm md:text-base py-3 md:py-3.5 px-6 rounded-xl h-[48px] md:h-[52px] bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              Back to Login
            </button>
          </div>

          {/* Additional info for mobile */}
          <div className="mt-4 md:mt-0 text-center">
            <p className="text-xs md:text-sm text-gray-500">
              We'll send you a verification code to reset your password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;