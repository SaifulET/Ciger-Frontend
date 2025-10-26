'use client';

import React, { useState } from 'react';
import { ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import logo from "@/public/logo1.svg"

const NewPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleNext = () => {
   
    router.push('/auth/welcome'); 
  };

  const handleBackToLogin = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">

      {/* Main content */}
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-xl p-8  w-full max-w-[564px] flex flex-col items-center gap-6 shadow-lg">
          
          {/* Logo */}
          <div className="w-[500px] h-24 flex items-center justify-center">
            <div className="text-center">
              <Image src={logo} alt="logo" width={220} height={220} className='rounded-full'/>
               {/* <Image src={Logo} alt='logo'/> */}
            </div>
          </div>

          {/* Header text */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[375px]">
            <h3 className="text-2xl font-semibold text-gray-900 text-center">Set new password</h3>
            <p className="text-base text-gray-500 text-center leading-6">
              Set a new password and continue your journey
            </p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-6 w-full max-w-[500px]">
            
            {/* New Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-900">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-[52px] pl-12 pr-12 py-3.5 bg-yellow-50 border border-gray-200 rounded-xl text-base text-gray-500 placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:text-gray-900"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-6 h-6 text-yellow-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <Eye className="w-6 h-6 text-yellow-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold text-gray-900">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retype password"
                  className="w-full h-[52px] pl-12 pr-12 py-3.5 bg-yellow-50 border border-gray-200 rounded-xl text-base text-gray-500 placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:text-gray-900"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-6 h-6 text-yellow-600" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <Eye className="w-6 h-6 text-yellow-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Next button */}
            <button 
              onClick={handleNext}
              className="w-full h-[52px] hover:bg-[#b59300] bg-[#FFCF00] rounded-xl flex items-center justify-center px-8 py-3 transition-colors"
            >
              <span className="text-base font-medium text-gray-900">Next</span>
            </button>

            

            {/* Back to Login button */}
            <button 
              onClick={handleBackToLogin}
              className="w-full h-[52px] rounded-xl flex items-center justify-center px-6 py-3.5  focus:bg-[#FFCF00] transition-colors gap-2"
            >
              <ArrowLeft className="w-6 h-6 text-gray-900" />
              <span className="text-base font-medium text-gray-900">Back to Login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;