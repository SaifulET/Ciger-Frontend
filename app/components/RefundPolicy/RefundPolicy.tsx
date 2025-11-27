"use client";
import React from 'react';

// JSON data structure for Smokenza refund policy
const refundData = {
  sections: [
    {
      id: 1,
      title: "1. All Sales Are Final",
      content: [
        {
          text: "Because we sell age-restricted, consumable, and perishable items, we do not accept returns or exchanges for: Tobacco products, cigars and cigarillos, vape devices and disposable vapes, e-liquids and nicotine pouches, pipe tobacco, grabba/leaf, or rolling tobacco, any opened, unsealed, or partially used items. This policy helps us maintain product integrity and comply with federal/state regulations."
        }
      ]
    },
    {
      id: 2,
      title: "2. No Refunds for Buyer's Remorse",
      content: [
        {
          text: "We do not offer refunds for: Changing your mind, ordering the wrong item, not liking a flavor or strength, not reading product descriptions, purchasing by mistake, third-party package theft after delivery. Please double-check your order before submitting payment."
        }
      ]
    },
    {
      id: 3,
      title: "3. Damaged or Incorrect Items",
      content: [
        {
          text: "We only offer replacements for items that: Arrive damaged, are defective out of the box, are incorrect due to our mistake. To qualify, you must notify us via email at support@smokenza.com within 48 hours of delivery with: Your order number, photos of the product and packaging, description of the issue. If approved, we may send a replacement or store credit. Refunds will only be issued at our discretion."
        }
      ]
    },
    {
      id: 4,
      title: "4. Age Verification Failures",
      content: [
        {
          text: "If your order fails age verification: Your order will be canceled, a restocking fee of up to 25% may be deducted, shipping fees are non-refundable. This protects us from fraudulent or underage purchases."
        }
      ]
    },
    {
      id: 5,
      title: "5. Lost, Stolen, or Delayed Packages",
      content: [
        {
          text: "Once a package is marked 'Delivered' by the carrier, we are no longer responsible for: Stolen packages, packages delivered to the wrong address due to customer error, delayed deliveries caused by USPS/UPS/FedEx. If your package is lost in transit (not marked delivered), we will help file a claim with the carrier."
        }
      ]
    },
    {
      id: 6,
      title: "6. Canceling an Order",
      content: [
        {
          text: "Because orders begin processing immediately: Orders cannot be canceled once the shipping label is printed. If the order is still unprocessed, you may request cancellation. A 10–20% cancellation/restocking fee may apply (covers age verification, labor, and payment-processing costs)."
        }
      ]
    },
    {
      id: 7,
      title: "7. No Returns on Clearance, Sale, or Promotional Items",
      content: [
        {
          text: "All discounted, clearance, 'Buy X Get Y,' and promotional items are strictly final sale."
        }
      ]
    },
    {
      id: 8,
      title: "8. Refused or Returned-to-Sender Packages",
      content: [
        {
          text: "If a package is returned to us due to: Wrong address entered, failure to pick up from carrier, refusal at delivery, age-verification failure. Then: Refunds will be issued minus shipping + up to 30% restocking fee, or you may repay shipping to have it resent. Opened or damaged returns will not be refunded."
        }
      ]
    },
    {
      id: 9,
      title: "9. Chargebacks & Fraudulent Claims",
      content: [
        {
          text: "We take fraudulent claims seriously. If a chargeback is filed for an order that: Was delivered, passed age verification, was not damaged, was not reported within 48 hours. We will provide the payment processor with: Photo evidence, age verification logs, shipping records, tracking confirmation, IP and device logs, customer communication history. Any fraudulent chargeback attempt will result in account termination and may be reported to the appropriate authorities."
        }
      ]
    },
    {
      id: 10,
      title: "10. Contact Us",
      content: [
        {
          text: "For questions or concerns regarding your order, email us at: support@smokenza.com. We are happy to help resolve any legitimate issue quickly and fairly."
        }
      ]
    }
  ],
  lastUpdated: "Last Updated: November 27, 2025"
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen p-[16px] md:p-[32px]">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
        <div>
          <h1 className="text-[28px] font-semibold text-gray-900 text-center mb-4">
            Refund & Return Policy
          </h1>
          <div className="text-center text-gray-600 leading-relaxed">
            <p>At Smokenza, we prioritize product authenticity, safety, and customer satisfaction.</p>
            <p>Due to the nature of tobacco, nicotine, and consumable products, all sales are final.</p>
            <p>Please review our policy carefully before placing your order.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        <div className="bg-white rounded-lg shadow-sm p-[16px] md:p-[32px]">
          <div className="space-y-8">
            {refundData.sections.map((section) => (
              <div key={section.id} className="">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {section.title}
                </h2>
                <div className="space-y-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="flex items-start">
                      {/* <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-2 mr-4"></span> */}
                      <div className="flex-1">
                        <p className="text-gray-600 leading-relaxed">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {refundData.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}