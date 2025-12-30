import CheckoutPage from '@/app/components/CheckoutComponent/Checkout'
import React from 'react'
import type { Metadata } from 'next'
import Head from 'next/head'

export const metadata: Metadata = {
  title: 'Checkout | Smokeza Store - Premium Smoking Essentials',
  description: 'Complete your purchase securely at Smokeza Store. Fast shipping on premium smoking accessories, glassware, and essentials. Secure checkout with multiple payment options.',
  keywords: 'smoke shop checkout, smoking accessories purchase, bong checkout, vape cart, glass pipe order, rolling papers buy, Smokeza Store, secure payment, smoking essentials',
  openGraph: {
    title: 'Checkout | Smokeza Store',
    description: 'Complete your purchase of premium smoking accessories',
    type: 'website',
    images: ['/og-checkout-image.jpg'], // Add your store's checkout OG image
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Checkout | Smokeza Store',
    description: 'Secure checkout for premium smoking essentials',
  },
  robots: {
    index: false, // Checkout pages shouldn't be indexed
    follow: true,
    nocache: true,
  },
  alternates: {
    canonical: 'https://smokeza-store.com/checkout',
  },
  verification: {
    google: 'your-google-verification-code', // Add if you have
  }
}

function Page() {
  return (

    <>
<Head>
<title>Payment Options | Smokenza USA</title>
<meta
  name="description"
  content="Smokenza accepts all major credit and debit cards in the USA. Enjoy a secure and convenient checkout with Visa, MasterCard, American Express, Discover, and more."
/>
</Head>


     <div className=''>
      <CheckoutPage />
    </div>
    </>
   
  )
}

export default Page