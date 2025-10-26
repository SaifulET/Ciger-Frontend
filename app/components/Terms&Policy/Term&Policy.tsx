import React from 'react';

// JSON data structure for terms and policies
const termsData = {
  sections: [
    {
      id: 1,
      title: "Terms of Service",
      content: [
        {
          subtitle: "Acceptance of Terms",
          text: "By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
        },
        {
          subtitle: "Use License",
          text: "Permission is granted to temporarily download one copy of the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        },
        {
          subtitle: "User Responsibilities",
          text: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account or password."
        }
      ]
    },
    {
      id: 2,
      title: "Privacy Policy",
      content: [
        {
          subtitle: "Information Collection",
          text: "We collect information from you when you register on our site, place an order, subscribe to our newsletter, or fill out a form. The information collected includes your name, email address, and phone number."
        },
        {
          subtitle: "Information Usage",
          text: "Any information we collect from you may be used to personalize your experience, improve our website, improve customer service, and process transactions efficiently."
        },
        {
          subtitle: "Data Protection",
          text: "We implement a variety of security measures to maintain the safety of your personal information. Your personal information is contained behind secured networks and is only accessible by a limited number of persons."
        }
      ]
    },
    {
      id: 3,
      title: "Cookie Policy",
      content: [
        {
          subtitle: "What Are Cookies",
          text: "Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience by remembering your preferences and settings."
        },
        {
          subtitle: "How We Use Cookies",
          text: "We use cookies to understand and save your preferences for future visits, keep track of advertisements, and compile aggregate data about site traffic and interactions."
        },
        {
          subtitle: "Managing Cookies",
          text: "You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies through your browser settings."
        }
      ]
    },
    {
      id: 4,
      title: "Refund Policy",
      content: [
        {
          subtitle: "Refund Eligibility",
          text: "We offer refunds within 30 days of purchase. To be eligible for a refund, your item must be unused and in the same condition that you received it. It must also be in the original packaging."
        },
        {
          subtitle: "Refund Process",
          text: "Once we receive your item, we will inspect it and notify you of the status of your refund. If approved, your refund will be processed within 7-10 business days."
        },
        {
          subtitle: "Non-Refundable Items",
          text: "Certain items are non-refundable, including downloadable software products, gift cards, and services that have already been provided."
        }
      ]
    }
  ],
  lastUpdated: "October 18, 2025"
};

export default function TermsAndPolicy() {
  const allPoints = termsData.sections.flatMap(section => section.content);
  
  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className=" px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            Terms & Policy
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12">
          <div className="space-y-6">
            {allPoints.map((item, index) => (
              <div key={index} className="pl-6">
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
              Last Updated: {termsData.lastUpdated}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}