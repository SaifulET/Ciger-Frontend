import CouponComponent from '@/app/components/CouponDeal/CouponComponent'
import React from 'react'
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Smokenza Coupon Codes & Discounts | Save on Premium Cigars",
  description:
    "Get the latest Smokenza coupon codes, discount offers, and exclusive deals. Save more on premium cigars and accessories with verified promo codes.",
  keywords: [
    "Smokenza coupon code",
    "Smokenza discount",
    "cigar coupons",
    "promo codes cigars",
    "cigar discounts online",
    "Smokenza deals",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://smokenza.com/pages/discounts",
  },
  openGraph: {
    title: "Smokenza Discount Coupons & Promo Codes",
    description:
      "Save on premium cigars with verified Smokenza coupon codes and exclusive discount offers.",
    url: "https://smokenza.com/pages/discounts",
    siteName: "Smokenza",
    images: [
      {
        url: "https://smokenza.com/og-discounts.jpg",
        width: 1200,
        height: 630,
        alt: "Smokenza Coupon Codes and Discounts",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smokenza Coupon Codes | Premium Cigar Discounts",
    description:
      "Find the best Smokenza promo codes and save on premium cigars today.",
    images: ["https://smokenza.com/og-discounts.jpg"],
  },
};

function page() {

  
  return (
    <div >
        <CouponComponent/>
        </div>
  )
}

export default page