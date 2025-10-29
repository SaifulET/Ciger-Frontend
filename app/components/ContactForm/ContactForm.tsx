// components/ContactForm.tsx
import Image from 'next/image';
import React from 'react';
import logo from "@/public/logo1.svg"


const ContactForm = () => {
  return (
   <div className='p-[16px] md:p-[32px] bg-white rounded-3xl shadow-xl'>
    <h2 className="text-[40px] font-semibold  text-center">Contact</h2>
     <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[32px] items-center justify-center      ">
      
      {/* Left Column: Logo and Description */}
      <div className="flex flex-col items-center   max-w-[500px] w-full ">
        <div className="w-full  flex justify-center items-center text-center "><Image className='rounded-full' src={logo} alt="Logo"width={220} height={220}/></div>
        <p className="text-center font-open-sans text-[16px] font-semibold leading-[24px]">
          The Finest in Tobacco, Vapes, and Lifestyle Accessories.
        </p>
      </div>

      {/* Right Column: Form */}
      <div className="flex flex-col items-center w-full max-w-[700px]">
        
        
        <form className="w-full space-y-6">
          <div className="flex flex-col">
            {/* <label htmlFor="email" className="text-lg font-medium">Enter email</label> */}
            <input
              type="email"
              id="email"
              name="email"
              className="p-4 mt-2 rounded-lg focus:outline-none bg-[#EDEDED] focus:ring-2 focus:ring-[#C9A040]"
              placeholder="Enter email"
            />
          </div>

          <div className="flex flex-col">
            {/* <label htmlFor="subject" className="text-lg font-medium">Subject</label> */}
            <input
              type="text"
              id="subject"
              name="subject"
              className="p-4 mt-2 bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              placeholder="Subject"
            />
          </div>

          <div className="flex flex-col">
            {/* <label htmlFor="message" className="text-lg font-medium">Message</label> */}
            <textarea
              id="message"
              name="message"
              className="p-4 mt-2 bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
              placeholder="Message"
              rows={6}
            />
          </div>

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-[#C9A040] text-gray-900 px-6 py-3 rounded-lg hover:bg-[#685529] transition duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
   </div>
  );
};

export default ContactForm;
