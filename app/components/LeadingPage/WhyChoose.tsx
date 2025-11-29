"use client";
import Image from "next/image";

const values = [
  {
    id: 1,
    icon: "/shipping-truck-01.svg",
    title: "Premium Products, Guaranteed Fresh",
    desc: "We stock only authentic, high-quality tobacco, cigars, disposables, and smokeless products—stored in optimal conditions and delivered at peak freshness every time.",
  },
  {
    id: 2,
    icon: "/square-lock-01.svg",
    title: "Unbeatable Pricing & Exclusive Deals",
    desc: "We curate top-tier tobacco and vape products at smart, accessible prices, bringing premium enjoyment within reach.",
  },
  {
    id: 3,
    icon: "/user-group.svg",
    title: "Lightning-Fast, Secure Nationwide Shipping",
    desc: "Your orders are packed with care and shipped with speed, accuracy, and full tracking, ensuring safe and reliable delivery—every single time.",
  },
 
];

export default function ValueSection() {
  return (
    <section className=" p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] bg-white rounded-lg">
      <div className=" text-center pb-[32px]">
        <h2 className="text-[28px] font-bold text-[#212121]">
          Why Choose Us
        </h2>
      </div>

      {/* Main grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl mx-auto justify-items-center">
        {values.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center text-center gap-4 max-w-xs w-full"
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#FFCF00]">
              <Image
                src={item.icon}
                alt={item.title}
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h3 className="font-semibold text-lg text-[#212121]">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}