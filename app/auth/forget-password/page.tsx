
"use client"; // If using App Router

import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo1.svg"
import useUserStore from "@/app/store/userStore";

const ForgotPasswordPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
    const {loginFormData,loginOnChange,UserForgetPasswordRequest}=useUserStore()

  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email)
    const res = await UserForgetPasswordRequest(email);
  console.log(res);
    if (res.message==="OTP sent to email" ) {
      router.push("/auth/otp");
    } else {
      setIsLoading(true)
      setErrorMessage(res.message || "Something went wrong");
    }
  };

  const handleBackToLogin = () => {
    router.push("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Main content - Positioned to avoid overlap with patterns */}
      <div
        className="relative z-10 min-h-screen flex items-center justify-center "
        style={{ paddingTop: "139px", paddingBottom: "139px" }}
      >
        <div className="w-[564px] h-[510px] bg-white  p-8 flex flex-col items-center gap-6  rounded-xl shadow-lg">
          {/* Logo */}
          <div className="w-full max-w-[500px] h-24 flex items-center justify-center">
            <div className="text-center">
              {/* <Image src={Logo} alt='logo'/> */}
              <Image src={logo} alt="logo" width={220} height={220} className='rounded-full'/>
            </div>
          </div>

          {/* Title and subtitle section */}
          <div className="w-[277px] h-16 flex flex-col items-center gap-1">
            <h2 className="w-[277px] h-9 text-3xl font-semibold text-gray-800 leading-9 text-center">
              Forgot Password
            </h2>
            <p className="w-[277px] h-6 text-base text-gray-500 leading-6 text-center">
              Enter your email to reset password
            </p>
          </div>

          {/* Form section */}
          <div className="w-[500px] h-[238px] flex flex-col gap-6">
            {/* Email field */}
            <div className="flex flex-col gap-2 h-[86px]">
              <label
                htmlFor="email"
                className="text-lg font-semibold text-gray-800 leading-6 h-[26px]"
              >
                Email
              </label>
              <div className="relative">
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <Mail
                    className="w-6 h-6 text-yellow-600 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Next button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !email}
              className="w-full bg-[#FFCF00] hover:bg-[#b59300]   text-gray-800 font-medium text-base py-4 px-8 rounded-xl h-[55px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 "
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </div>
              ) : (
                "Next"
              )}
            </button>

            {/* Back to Login button */}
            <button
              onClick={handleBackToLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-gray-800 font-medium text-base py-3.5 px-6 rounded-xl h-[52px]  transition-colors duration-200   "
            >
              <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
              Back to Login
            </button>
            {errorMessage && (
              <p className="text-red-600 text-sm text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
