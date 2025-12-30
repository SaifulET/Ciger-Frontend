"use client";

import { Mail, Phone } from "lucide-react";
import fbIcon from "@/public/Facebook.svg";
import instaIcon from "@/public/instagram.svg";
import youtubeIcon from "@/public/youtube.svg";
import tiktokIcon from "@/public/TikTok.svg";
import Image from "next/image";
import discover from "@/public/discover.svg";
import master from "@/public/master.svg";
import paypal from "@/public/paypal.svg";
import visa from "@/public/visa.svg";
import american from "@/public/american.svg";

export default function Footer() {
  return (
    <footer className="bg-[#212121] w-full text-white px-[16px] lg:px-[256px] py-[16px] lg:py-[32px] flex flex-col">
      {/* Main Container */}
      <div className="w-full flex flex-col">
        {/* Top Section - Fixed alignment */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between w-full mb-[32px]">
          {/* Left: Quick Links */}
          <div className="flex flex-col gap-4 mb-[32px] lg:mb-0 lg:w-1/3">
            <h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2">
              {["Home", "Brand", "Discounts"].map((item) => (
                <li key={item}>
                  <a
                    href={`/pages/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "")
                    }`}
                    className="hover:text-[#C9A040] transition-colors duration-300 font-open-sans font-normal text-base leading-[24px] text-white"
                  >
                    {item === "RefundPolicy" ? "Refund Policy" : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Center: Get in touch */}
          <div className="flex flex-col gap-4 mb-[32px] lg:mb-0 lg:w-1/3">
            <h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white">
              Get in touch
            </h4>
            <ul className="flex flex-col gap-2">
              {["Contact", "RefundPolicy", "privacyPolicy", "Terms & Conditions"].map((item) => (
                <li key={item}>
                  <a
                    href={`/pages/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "")
                    }`}
                    className="hover:text-[#C9A040] transition-colors duration-300 font-open-sans font-normal text-base leading-[24px] text-white"
                  >
                    {item === "RefundPolicy"
                      ? "Refund Policy"
                      : item === "privacyPolicy"
                      ? "Privacy Policy"
                      : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact + Socials + Card Icons */}
          <div className="flex flex-col gap-4 lg:w-1/3">
            <h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white">
              Contact Us
            </h4>
            
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span className="font-[Open_Sans] font-semibold text-[16px]">
                904-990-2445
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span className="font-[Open_Sans] font-semibold text-[16px]">
                support@smokenza.com
              </span>
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-6 mt-2">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Image src={fbIcon} width={20} height={20} priority alt="facebook" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Image src={instaIcon} width={20} height={20} priority alt="instagram" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Image src={youtubeIcon} width={20} height={20} priority alt="youtube" />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Image src={tiktokIcon} width={20} height={20} priority alt="tiktok" />
              </a>
            </div>

            {/* Payment Card Icons */}
            <div className="flex items-center gap-2 md:gap-4 mt-4">
              <Image 
                src={discover} 
                alt="Discover" 
                width={60} 
                height={24}
                priority
                className="scale-80 md:scale-100 hover:scale-105 transition-transform duration-200"
              />
              <Image 
                src={master} 
                alt="MasterCard" 
                width={60} 
                height={24}
                priority
                className="scale-80 md:scale-100 hover:scale-105 transition-transform duration-200"
              />
              <Image 
                src={paypal} 
                alt="PayPal" 
                width={60} 
                height={24}
                priority
                className="scale-80 md:scale-100 hover:scale-105 transition-transform duration-200"
              />
              <Image 
                src={visa} 
                alt="visa" 
                width={60} 
                height={24}
                priority
                className="scale-80 md:scale-100 hover:scale-105 transition-transform duration-200"
              />
              <Image 
                src={american} 
                alt="american express" 
                width={60} 
                height={24}
                priority
                className="scale-80 md:scale-100 hover:scale-105 transition-transform duration-200"
              />
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-left lg:text-center font-semibold text-[16px] leading-[24px] mt-4">
          © 2025 All rights reserved to Smokenza
        </p>
      </div>
    </footer>
  );
}