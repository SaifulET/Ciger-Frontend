"use client";

import { Mail, Phone } from "lucide-react";
import fbIcon from "@/public/Facebook.svg"
import instaIcon from "@/public/instagram.svg"
import youtubeIcon from "@/public/youtube.svg"
import tiktokIcon from "@/public/TikTok.svg"
import Image from "next/image";
import logo from "@/public/logo1.svg"
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#212121] w-full text-white px-8 md:px-16 py-16 flex flex-col md:gap-10">
      {/* Main Container */}
      <div className="w-full  flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-[303px]">
          {/* Left: Logo & Description */}
          <div className="flex flex-col gap-12 w-full ">
            <p className="text-white font-[600] text-[16px] leading-[24px] font-[Open_Sans]">
              The Finest in Tobacco, Vapes, and Lifestyle Accessories.
            </p>
            <h2 className="text-white font-[Montserrat] font-semibold text-[40px] leading-[48px]">
             <Image className=' ' src={logo} alt="Logo"width={220} height={220}/>
            </h2>
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-col gap-4 w-full md:w-[123px]">
            <h4 className="font-[Montserrat] font-semibold text-[18px] leading-[26px]">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-2 text-[16px] font-[Open_Sans]">
              {[
                "Home",
                "Brand",
                "Discounts",
                "Contact",
                "RefundPolicy",
                "Terms&Policies",
              ].map((item) => (
                <li key={item}>
                  <a
                    href={`/pages/${item==="Home"?``:item.toLowerCase()}`}
                    className="hover:text-[#C9A040] transition-colors duration-300"
                  >
                    {item==="RefundPolicy"?"Refund Policy":item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: Contact + Socials */}
          <div className="flex flex-col  ">
            <Link href="/pages/contact">
            <button className="bg-[#C9A040] text-[#0C0C0C] font-semibold px-8 py-3 rounded-xl hover:bg-[#d4ae56] transition">
              Contact Us
            </button>
            </Link>

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
                <Image src={fbIcon} width={20}height={20}alt="facebook"></Image>
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={instaIcon} width={20}height={20}alt="instagram"></Image>
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={youtubeIcon} width={20}height={20}alt="youtube"></Image>
              </a>
              <a href="#" className="hover:opacity-80">
                <Image src={tiktokIcon} width={20}height={20}alt="tiktok"></Image>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center font-[Open_Sans] font-semibold text-[16px] leading-[24px]">
          © 2025 All rights reserved to Smokenza
        </p>
      </div>
    </footer>
  );
}
