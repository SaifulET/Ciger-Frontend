import ShoppingCart from '@/app/components/ShoppingCart/ShoppingCart'
import type { Metadata } from 'next'
import Head from 'next/head'
import React from 'react'

export const metadata: Metadata = {
  title: 'Shopping Cart | Smokenza - Premium Cigars, Hookah & Vapes',
  description: 'Review your cart: premium cigars, hookah supplies, nicotine vapes & smoking accessories. Free shipping on orders over $50. Secure checkout available.',
  keywords: [
    'shopping cart',
    'cart items',
    'smoke shop cart',
    'cigar cart',
    'hookah cart',
    'vape cart',
    'smoking accessories cart',
    'Smokenza cart',
    'premium cigars cart',
    'tobacco products cart',
    'shisha cart',
    'rolling papers cart',
    'vape juice cart'
  ].join(', '),
  openGraph: {
    title: 'Shopping Cart | Smokenza',
    description: 'Review your premium smoking essentials before checkout',
    type: 'website',
    url: 'https://smokenza.com/cart',
    images: [
      {
        url: '/og-cart-image.jpg', // Add your cart OG image
        width: 1200,
        height: 630,
        alt: 'Smokenza Shopping Cart',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Shopping Cart | Smokenza',
    description: 'Review your premium smoking essentials',
  },
  robots: {
    index: false, // Cart pages typically shouldn't be indexed
    follow: true,
  },
  alternates: {
    canonical: 'https://smokenza.com/cart',
  },
  other: {
    'age-restriction': '18+',
  }
}

// Optional: Add structured data for cart page
function CartStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shopping Cart - Smokenza",
    "description": "Shopping cart page for premium cigars, hookah, and vapes",
    "url": "https://smokenza.com/cart",
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://smokenza.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shopping Cart",
          "item": "https://smokenza.com/cart"
        }
      ]
    }
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

function Page() {
  return (
    <>

    <Head>

<title>Shopping Cart | Smokenza</title>
<meta
  name="description"
  content="Review the items in your Smokenza shopping cart. Update quantities, apply coupons, and proceed to secure checkout for fast delivery."
/>

    </Head>
      <CartStructuredData />
      <div className='p-[16px] md:p-[32px]'>
        <ShoppingCart />
      </div>
    </>
  )
}

export default Page