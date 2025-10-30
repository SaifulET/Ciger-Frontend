"use client";
import Image from "next/image";

const values = [
  {
    id: 1,
    icon: "/shipping-truck-01.svg",
    title: "Fast & Secure Transport",
    desc: "Reliable logistics, on time and safe",
  },
  {
    id: 2,
    icon: "/square-lock-01.svg",
    title: "New & Innovative Ideas",
    desc: "Creative, modern solutions tailored to your needs",
  },
  {
    id: 3,
    icon: "/user-group.svg",
    title: "Trusted by 200+ Clients",
    desc: "Over 200 satisfied clients have already chosen us",
  },
  {
    id: 4,
    icon: "/user-group.svg",
    title: "Young and Motivated Team",
    desc: "A passionate, energetic, and dedicated workforce",
  },
  {
    id: 5,
    icon: "/credit-card-pos.svg",
    title: "Personalized Attention",
    desc: "Tailored support for every client",
  },
  {
    id: 6,
    icon: "/credit-card-pos.svg",
    title: "Personalized Attention",
    desc: "Tailored support for every client",
  },
];

export default function ValueSection() {
  return (
    <section className=" p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] bg-white rounded-lg">
      <div className=" text-center pb-[32px]">
        <h2 className="text-[28px] md:text-4xl font-bold text-[#212121]">
          Why Choose Us
        </h2>
      </div>

      {/* Main grid container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto justify-items-center">
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