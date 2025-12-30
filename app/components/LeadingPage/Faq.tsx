"use client";
import { useState } from "react";
import Image from "next/image";
import helpcircle from "@/public/help-circle.svg"
import addbutton from "@/public/add-01.svg"
import negativeOne from "@/public/Vector (1).svg"
const faqs = [
  {
    id: 1,
    question: "Are all your tobacco and vape products authentic?",
    answer:
      "Yes. We source directly from authorized distributors and reputable manufacturers, ensuring every product we sell is 100% authentic, fresh, and factory-sealed. No counterfeits, no grey-market items — ever.",
  },
  {
    id: 2,
    question: "Do you verify age before shipping?",
    answer:
      "Absolutely. As a responsible smoke shop, we follow strict compliance protocols. Customers must be 21 or older, and all orders go through a secure age-verification process before shipment.",
  },
  {
    id: 3,
    question: "How long does shipping take?",
    answer:
      "Most orders are processed within 24 hours and delivered within 2–5 business days, depending on your location. Tracking information is provided for every purchase, so you can monitor your delivery in real time.",
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer:
      "We accept major secure payment options including credit/debit cards, digital wallets, and encrypted online checkout. All transactions are protected with industry-standard SSL security.",
  },
  {
    id: 5,
    question: "Do you offer discreet packaging?",
    answer:"Yes. All orders are shipped in plain, unmarked packaging to ensure privacy and discretion at every step."

  },
  {
    id: 6,
    question: "Do you offer wholesale pricing for smoke shops and convenience stores?",
    answer:
      "Yes. We offer exclusive wholesale pricing, case discounts, and bulk rates on cigars, tobacco, vapes, nicotine pouches, and accessories. Approved wholesale accounts receive tiered pricing based on volume.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <section className="p-[16px] md:p-[32px] mx-[16px] md:mx-[32px] mt-[16px] md:mt-[32px] bg-white  rounded-lg">
      <div className=" text-center  pb-[32px]">
        <h2 className="text-[24px] md:text-[28px] font-bold text-[#212121]">
          Frequently Asked Questions
        </h2>
      </div>

      <div className=" mx-auto flex flex-col gap-4">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="border rounded-lg p-4 cursor-pointer transition"
            onClick={() => toggle(faq.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* left question mark icon */}
                <Image
                  src={helpcircle}
                  alt="Question"
                  width={20}
                  height={20}
                  priority
                />
                <h3 className="font-semibold text-[#212121]">{faq.question}</h3>
              </div>

              {/* plus or minus */}
              <Image
                src={
                  openIndex === faq.id
                    ? negativeOne
                    : addbutton
                }
                alt="toggle"
                width={20}
                height={20}
                priority
              />
            </div>

            {openIndex === faq.id && (
              <p className="mt-3 text-gray-600 text-sm md:text-base">
                {faq.answer}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

 