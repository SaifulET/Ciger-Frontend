"use client";

import { Mail, Phone } from "lucide-react";
import fbIcon from "@/public/Facebook.svg";
import instaIcon from "@/public/instagram.svg";
import youtubeIcon from "@/public/youtube.svg";
import tiktokIcon from "@/public/TikTok.svg";
import Image from "next/image";
import logo from "@/public/logo1.svg";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#212121] w-full text-white px-[16px]  lg:px-[64px] py-[16px] lg:py-[32px] flex flex-col">
      {/* Main Container */}
      <div className="w-full flex flex-col ">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-around mb-[32px]">
          {/* Left: Logo & Description */}
         

          {/* Center: Quick Links */}
          <div className="flex flex-col gap-4 justify-center mb-[32px]">
            <h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white flex-none order-0 flex-grow-0">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2 text-[16px] ">
              {[
                "Home",
                "Brand",
                "Discounts",
               
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/pages/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "")
                    }`}
                    className="hover:text-[#C9A040] transition-colors duration-300 font-open-sans font-normal text-base leading-[24px] text-white flex-none order-3 flex-grow-0"
                  >
                    {item === "RefundPolicy" ? "Refund Policy" : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          
          {/* Center: Get in touch */}
          <div className="flex flex-col gap-4 justify-end mb-[32px] ">
            <h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white flex-none order-0 flex-grow-0">
              Get in touch
            </h4>
            <ul className="flex flex-col gap-2 text-[16px] ">
              {[
               
                "Contact",
                "RefundPolicy",
                "Terms & Policies",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/pages/${
                      item === "Home"
                        ? ""
                        : item.toLowerCase().replace(/\s+/g, "")
                    }`}
                    className="hover:text-[#C9A040] transition-colors duration-300 font-open-sans font-normal text-base leading-[24px] text-white flex-none order-3 flex-grow-0"
                  >
                    {item === "RefundPolicy" ? "Refund Policy" : item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact + Socials */}
          <div className="flex flex-col gap-4  justify-start ">
           
<h4 className="font-montserrat font-semibold text-[18px] leading-[26px] text-white flex-none order-0 flex-grow-0">
              Contact Us
            </h4>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5" />
              <span className="font-[Open_Sans] font-semibold text-[16px]">
                689296744
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <span className="font-[Open_Sans] font-semibold text-[16px]">
                admin@smokenza.com
              </span>
            </div>

            <div className="flex items-center gap-6 mt-2">
              <a href="#" className="hover:opacity-80">
                <Image src={fbIcon} width={20} height={20} alt="facebook" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={instaIcon} width={20} height={20} alt="instagram" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={youtubeIcon} width={20} height={20} alt="youtube" />
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={tiktokIcon} width={20} height={20} alt="tiktok" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-left lg:text-center  font-semibold text-[16px] leading-[24px] ">
          © 2025 All rights reserved to Smokenza
        </p>
      </div>
    </footer>
  );
}
