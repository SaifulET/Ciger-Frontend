"use client";

import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo1.svg";
import useUserStore from "@/app/store/userStore";

const SignInPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const { user, UserLoginRequest } = useUserStore();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user.length>0) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await UserLoginRequest(email, password);

      if (res.status === "success") {
        setErrorMessage("");
        // The redirect will be handled by the useEffect when isLoggedIn changes
      } else {
        setErrorMessage(res.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAccount = () => {
    router.push("/auth/signup");
  };

  const handleForgotPassword = () => {
    router.push("/auth/forget-password");
  };

  // If already logged in, show loading while redirecting
  if (user.length>0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-[564px] bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 flex flex-col items-center gap-6 sm:gap-8">
          {/* Logo */}
          <div className="w-full max-w-[500px] h-20 sm:h-24 flex items-center justify-center">
            <div className="text-center">
              <Image
                src={logo}
                alt="logo"
                width={200}
                height={200}
                className="rounded-full"
                priority
              />
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center max-w-[266px]">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2 leading-8 sm:leading-9">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-6">
              To login, enter your email address
            </p>
          </div>

          {/* Sign in form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] flex flex-col gap-4 sm:gap-6"
          >
            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-base sm:text-lg font-semibold text-gray-800 leading-6"
              >
                Email
              </label>
              <div className="relative">
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 gap-2 h-[48px] sm:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <Mail
                    className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base leading-6 w-full"
                    required
                    disabled={isLoading}
                    autoComplete="email"
                  />
                </div>
              </div>
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-base sm:text-lg font-semibold text-gray-800 leading-6"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="text-yellow-600 hover:text-yellow-700 font-medium text-xs sm:text-sm leading-5 transition-colors duration-200 disabled:opacity-50"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3 sm:py-3.5 gap-2 h-[48px] sm:h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <Lock
                    className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm sm:text-base leading-6 w-full"
                    required
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-yellow-600 hover:text-yellow-700 focus:outline-none transition-colors duration-200 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm text-center">
                  {errorMessage}
                </p>
              </div>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-[#FFCF00] hover:bg-[#b59300] disabled:bg-gray-300 disabled:cursor-not-allowed text-gray-800 font-medium text-base py-3 sm:py-4 px-8 rounded-xl h-[48px] sm:h-[52px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                "Login"
              )}
            </button>

            {/* Create account link */}
            <div className="text-center">
              <p className="text-gray-500 text-sm leading-5">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={handleCreateAccount}
                  className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Create an account
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;