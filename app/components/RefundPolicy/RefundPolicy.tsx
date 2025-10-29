// RefundPolicy.tsx
"use client";
import React from 'react';

// JSON data structure for e-commerce refund policy
const refundData = {
  sections: [
    {
      id: 1,
      title: "Introduction",
      content: [
        {
          subtitle: "Scope of Refunds",
          text: "This Refund Policy outlines the rules and procedures for returning products purchased from our e-commerce store. All purchases are subject to this policy."
        }
      ]
    },
    {
      id: 2,
      title: "Eligibility for Refund",
      content: [
        {
          subtitle: "Timeframe",
          text: "Refund requests must be submitted within 30 days from the date of delivery."
        },
        {
          subtitle: "Condition of Items",
          text: "Products must be unused, in original packaging, and include all accessories and documentation."
        }
      ]
    },
    {
      id: 3,
      title: "Non-Refundable Items",
      content: [
        {
          subtitle: "Exclusions",
          text: "Certain products such as digital downloads, gift cards, and personalized items are non-refundable."
        }
      ]
    },
    {
      id: 4,
      title: "Return Process",
      content: [
        {
          subtitle: "Initiating a Return",
          text: "Contact our customer support to request a return. Provide your order number and reason for return."
        },
        {
          subtitle: "Shipping Instructions",
          text: "You will receive a shipping label or instructions for sending the item back. Ensure the item is securely packaged."
        }
      ]
    },
    {
      id: 5,
      title: "Refund Processing Time",
      content: [
        {
          subtitle: "Processing Duration",
          text: "Once we receive your returned item, we will inspect it and process your refund within 7-10 business days."
        }
      ]
    },
    {
      id: 6,
      title: "Late or Missing Refunds",
      content: [
        {
          subtitle: "Troubleshooting",
          text: "If you haven’t received a refund after the processing time, please contact your bank or credit card company."
        }
      ]
    },
    {
      id: 7,
      title: "Exchanges",
      content: [
        {
          subtitle: "Exchange Policy",
          text: "Exchanges are handled similarly to returns. Contact support to initiate an exchange if needed."
        }
      ]
    },
    {
      id: 8,
      title: "Contact Information",
      content: [
        {
          subtitle: "Customer Support",
          text: "For any questions regarding refunds or returns, please contact our support team at support@example.com."
        }
      ]
    }
  ],
  lastUpdated: "October 18, 2025"
};

export default function RefundPolicy() {
  const allPoints = refundData.sections.flatMap(section => section.content);

  return (
    <div className="min-h-screen p-[16px] md:p-[32px] ">
      {/* Header */}
      <div className="bg-white shadow-sm  rounded-lg p-[16px] md:p-[32px] mb-[16px] md:mb-[32px]">
        <div className="  ">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Refund Policy
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="   ">
        <div className="bg-white rounded-lg shadow-sm p-[16px] md:p-[32px] ">
          <div className="space-y-6">
            {allPoints.map((item, index) => (
              <div key={index} className="">
                <div className="flex items-start">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-2 mr-4"></span>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.subtitle}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last Updated: {refundData.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
