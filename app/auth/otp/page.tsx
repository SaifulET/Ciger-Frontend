'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import logo from "@/public/logo1.svg"
import Image from 'next/image';

const OTPVerification: React.FC = () => {
  const [otpValues, setOtpValues] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
      setFocusedIndex(0);
    }
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = value;
      setOtpValues(newOtpValues);

      // Auto-focus next field if value is entered and not last field
      if (value && index < 3) {
        const nextIndex = index + 1;
        if (inputRefs.current[nextIndex]) {
          inputRefs.current[nextIndex].focus();
          setFocusedIndex(nextIndex);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace to move to previous field
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevIndex = index - 1;
      if (inputRefs.current[prevIndex]) {
        inputRefs.current[prevIndex].focus();
        setFocusedIndex(prevIndex);
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handleNext = () => {
    router.push('/auth/new-password');
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
               {/* <Image src={Logo} alt='logo'/> */}
              <Image src={logo} alt="logo"width={220} height={220} className='rounded-full' />
            </div>
          </div>

          {/* Header text */}
          <div className="flex flex-col items-center gap-1 w-full max-w-[427px]">
            <h3 className="text-2xl font-semibold text-gray-900 text-center">Verify Code</h3>
            <p className="text-base text-gray-500 text-center leading-6">
              We Sent OTP code to your email &quot;example@gmail.com&quot;. Enter the code below to verify
            </p>
          </div>

          {/* OTP Input fields */}
          <div className="flex flex-col gap-6 w-full max-w-[500px]">
            <div className="flex gap-6 justify-center">
              {otpValues.map((value, index) => (
                <div key={index} className="flex-1 max-w-[107px]">
                  <input
                    ref={(el) => { inputRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onFocus={() => handleFocus(index)}
                    onBlur={handleBlur}
                    className={`w-full h-[52px] px-4 py-3.5 rounded-xl border text-center text-base font-normal ${
                      focusedIndex === index || value
                        ? 'bg-yellow-50 border-yellow-600 text-gray-900' 
                        : 'bg-yellow-50 border-gray-200 text-gray-500'
                    } focus:outline-none focus:border-yellow-600 focus:text-gray-900`}
                    placeholder=""
                  />
                </div>
              ))}
            </div>

            {/* Next button */}
            <button 
              onClick={handleNext}
              className="w-full h-[52px] bg-[#FFCF00] hover:bg-[#b59300] rounded-xl flex items-center justify-center px-8 py-5 transition-colors"
            >
              <span className="text-base font-medium text-gray-900">Next</span>
            </button>

            {/* Resend text */}
            <div className="text-center">
              <p className="text-base text-gray-500">
                Don&#39;t receive OTP? <span className="text-[#b59300] cursor-pointer hover:underline">Resend again</span>
              </p>
            </div>

            {/* Back to Login button */}
            <button 
              onClick={handleBackToLogin}
              className="w-full h-[52px] rounded-xl flex items-center justify-center px-6 py-3.5  focus:bg-[#FFCF00]transition-colors gap-2"
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

export default OTPVerification;