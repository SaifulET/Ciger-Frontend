"use client";

import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo1.svg"
import useUserStore from "@/app/store/userStore";



const SignInPage: NextPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {loginFormData,loginOnChange,UserLoginRequest}=useUserStore()
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  const res = await UserLoginRequest(email, password);
  if (res.success) {
    setErrorMessage('');
    router.push("/");

  } else {
    setErrorMessage(res.message || "Something went wrong");
  }
};

  const handleCreateAccount = () => router.push("/auth/signup");
  const handleForgotPassword = () => router.push("/auth/forget-password");

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-[564px] bg-white rounded-xl shadow-lg border border-gray-100 p-8 flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="w-full max-w-[500px] h-24 flex items-center justify-center">
            <div className="text-center">
              <Image
                src={logo}
                alt="logo"
                width={220}
                height={220}
                className="rounded-full"
              />
            </div>
          </div>

          {/* Welcome text */}
          <div className="text-center max-w-[266px]">
            <h2 className="text-3xl font-semibold text-gray-800 mb-2 leading-9">
              Welcome Back!
            </h2>
            <p className="text-gray-500 text-base leading-6">
              To login, enter your email address
            </p>
          </div>

          {/* Sign in form */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[500px] flex flex-col gap-6"
          >
            {/* Email field */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-lg font-semibold text-gray-800 leading-6"
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

            {/* Password field */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-lg font-semibold text-gray-800 leading-6"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-yellow-600 hover:text-yellow-700 font-medium text-sm leading-5 transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
                  <Lock
                    className="w-6 h-6 text-yellow-600 flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-yellow-600 hover:text-yellow-700 focus:outline-none transition-colors duration-200"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" strokeWidth={1.5} />
                    ) : (
                      <Eye className="w-6 h-6" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            
            {/* Login button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full bg-[#FFCF00] hover:bg-[#b59300] text-gray-800 font-medium text-base py-4 px-8 rounded-xl h-[52px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
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

            {/* Error message */}
            {errorMessage && (
              <p className="text-red-600 text-sm text-center">
                {errorMessage}
              </p>
            )}


            {/* Create account link */}
            <p className="text-center text-gray-500 text-sm leading-5">
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={handleCreateAccount}
                className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
                disabled={isLoading}
              >
                Create an account
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
