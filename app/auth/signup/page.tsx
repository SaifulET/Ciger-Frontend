// pages/signup.tsx or app/signup/page.tsx (depending on your Next.js version)
'use client'; // If using App Router

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { NextPage } from 'next';

import { useRouter } from 'next/navigation'
import Image from 'next/image';
import logo from "@/public/logo2.png"
import useUserStore from "@/app/store/userStore";

const SignUpPage: NextPage = () => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const router = useRouter();
  const { UserSignupRequest } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await UserSignupRequest(email, password, firstName, lastName);
      if(res.status !== "error"){
        router.push("/auth/signin");
      } else {
        setErrorMessage(res.message ?? "");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
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
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:p-8 md:w-full md:max-w-[564px]">
        <div className="w-full max-w-[500px] md:w-[500px] flex flex-col items-center p-4 md:p-8 gap-4 md:gap-6 bg-white rounded-xl shadow-lg md:shadow-xl">
          
          {/* Logo */}
          <div className="w-full max-w-[280px] md:w-[500px] h-16 md:h-24 flex items-center justify-center">
            <Image 
              src={logo} 
              alt="logo" 
              width={180} 
              height={180} 
              className="w-[180px] h-auto md:w-[220px]"
              priority
            />
          </div>

          {/* Welcome text */}
          <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-800 leading-tight md:leading-9">
            Create an account
          </h2>

          {/* Sign up form */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 md:gap-6">
            
            {/* Name fields - side by side on desktop, stacked on mobile */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-4">
              {/* First Name */}
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="firstName" className="text-base md:text-lg font-medium md:font-semibold text-gray-800 leading-6">
                  First Name
                </label>
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 gap-2 h-[48px] md:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First"
                    className="flex-1 w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm md:text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div className="flex-1 flex flex-col gap-2">
                <label htmlFor="lastName" className="text-base md:text-lg font-medium md:font-semibold text-gray-800 leading-6">
                  Last Name
                </label>
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 gap-2 h-[48px] md:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last"
                    className="flex-1 w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm md:text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-base md:text-lg font-medium md:font-semibold text-gray-800 leading-6">
                Email
              </label>
              <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 gap-2 h-[48px] md:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                <Mail className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 flex-shrink-0" strokeWidth={1.5} />
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

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-base md:text-lg font-medium md:font-semibold text-gray-800 leading-6">
                Password
              </label>
              <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 gap-2 h-[48px] md:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                <Lock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600 flex-shrink-0" strokeWidth={1.5} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="flex-1 w-full bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm md:text-base leading-6"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-yellow-600 hover:text-yellow-700 focus:outline-none transition-colors duration-200 p-1"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? 
                    <EyeOff className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} /> : 
                    <Eye className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                  }
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !firstName || !lastName || !email || !password}
              className="w-full bg-[#FFCF00] hover:bg-[#b59300] disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-medium text-sm md:text-base py-3 md:py-4 px-8 rounded-xl h-[48px] md:h-[52px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm md:text-base">Creating...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="mt-2 md:mt-4">
              <p className="text-center text-gray-500 text-sm md:text-base leading-6">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200 focus:outline-none focus:underline"
                  disabled={isLoading}
                >
                  Login
                </button>
              </p>
            </div>

          </form>

          {/* Additional mobile-friendly spacing */}
          <div className="mt-4 md:mt-0 text-center">
            <p className="text-xs md:text-sm text-gray-500">
              By creating an account, you agree to our Terms and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;