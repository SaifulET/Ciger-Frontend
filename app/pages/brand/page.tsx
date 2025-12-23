// app/pages/brand/page.tsx
import BrandsPage from '@/app/components/Brand/BrandPage'
import React from 'react'
import { Metadata } from 'next'

// ✅ Metadata for Brand page
export const metadata: Metadata = {
  title: "Brands - Smokenza",
  description: "Explore premium cigar, hookah, nicotine vape, and accessory brands online at Smokenza. Fast delivery & secure checkout.",
  openGraph: {
    title: "Brands | Smokenza",
    description: "Explore premium cigar, hookah, nicotine vape, and accessory brands online at Smokenza.",
    url: "https://smokenza.com/pages/brand",
    images: [
      {
        url: "https://smokenza.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo2.5077c29d.png&w=3840&q=75", 
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brands | Smokenza",
    description: "Explore premium cigar, hookah, nicotine vape, and accessory brands online at Smokenza.",
    images: ["https://smokenza.com/_next/image?url=https%3A%2F%2Fsmokenza.s3.us-east-1.amazonaws.com%2Fuploads%2F1764601219620-BM.jpg&w=256&q=75"],
  },
}

// ✅ Brand page component
export default function BrandPageWrapper() {
  return (
    <div className='py-[16px] md:py-[32px] px-[16px] md:px-[32px]'>
      <BrandsPage />
    </div>
  )
}
