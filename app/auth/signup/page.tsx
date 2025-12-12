// pages/signup.tsx or app/signup/page.tsx (depending on your Next.js version)
'use client'; // If using App Router

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
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
  const {loginFormData,loginOnChange,UserSignupRequest}=useUserStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Replace with your account creation logic
 const res = await UserSignupRequest(email, password,firstName,lastName);
console.log(res)
     if(res.status!=="error"){
      router.push("/auth/signin")
     }
     else{
setErrorMessage(res.message ??"")
     }
      
    } catch (error) {
      
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    // Navigation logic for sign in
    router.push("/auth/signin")
  };

 return (
  <div className="min-h-screen bg-white relative">

   

    {/* Main content */}
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center w-[564px] h-[776px] p-8 gap-6 bg-white rounded-xl shadow-lg ">

      {/* Logo */}
      <div className="w-[500px] h-24 flex items-center justify-center ">
        {/* <Image src={Logo} alt='logo'/> */}
        <Image src={logo} alt="logo" width={220} height={220} className=''/>
      </div>

      {/* Welcome text */}
      <h2 className="text-center text-3xl font-semibold text-gray-800 leading-9">
        Create an account
      </h2>

      {/* Sign up form */}
      <form onSubmit={handleSubmit} className="w-[500px] flex flex-col gap-6">

        {/* First Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="firstName" className="text-lg font-semibold text-gray-800 leading-6">
            First Name
          </label>
          <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First"
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-2">
          <label htmlFor="lastName" className="text-lg font-semibold text-gray-800 leading-6">
            Last Name
          </label>
          <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last"
              className="flex-1 bg-transparent text-gray-700 placeholder-gray-500 outline-none text-base leading-6"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-lg font-semibold text-gray-800 leading-6">
            Email
          </label>
          <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
            <Mail className="w-6 h-6 text-yellow-600 flex-shrink-0" strokeWidth={1.5} />
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

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-lg font-semibold text-gray-800 leading-6">
            Password
          </label>
          <div className="flex items-center bg-yellow-50 border border-gray-200 rounded-xl px-4 py-3.5 gap-2 h-[52px] focus-within:ring-2 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all duration-200">
            <Lock className="w-6 h-6 text-yellow-600 flex-shrink-0" strokeWidth={1.5} />
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
              {showPassword ? <EyeOff className="w-6 h-6" strokeWidth={1.5} /> : <Eye className="w-6 h-6" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !firstName || !lastName || !email || !password}
          className="w-full bg-[#FFCF00] hover:bg-[#b59300] text-gray-800 font-medium text-base py-4 px-8 rounded-xl h-[52px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </div>
          ) : (
            "Create"
          )}
        </button>
         {errorMessage && (
              <p className="text-red-600 text-sm text-center">
                {errorMessage}
              </p>
            )}


        {/* Login Link */}
        <p className="text-center text-gray-500 text-base leading-6 mb-[32px]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={handleSignIn}
            className="text-yellow-600 hover:text-yellow-700 font-medium transition-colors duration-200"
            disabled={isLoading}
          >
            Login
          </button>

        </p>

      </form>
    </div>
  </div>
);

};

export default SignUpPage;