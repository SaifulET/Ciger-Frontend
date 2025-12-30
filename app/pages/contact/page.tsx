import ContactForm from '@/app/components/ContactForm/ContactForm'
import React from 'react'
import type { Metadata } from "next";
import Head from 'next/head';

export const metadata: Metadata = {
  title: "Contact Smokenza | Customer Support & Assistance",
  description:
    "Contact Smokenza for order support, product inquiries, or general questions. Email our support team and get fast assistance.",
  keywords: [
    "contact Smokenza",
    "Smokenza customer support",
    "email Smokenza",
    "Smokenza help",
    "Smokenza contact page",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://smokenza.com/pages/contact",
  },
  openGraph: {
    title: "Contact Smokenza | We're Here to Help",
    description:
      "Need help with your order or products? Contact Smokenza support and our team will assist you.",
    url: "https://smokenza.com/contact",
    siteName: "Smokenza",
    images: [
      {
        url: "https://smokenza.com/og-contact.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Smokenza Support",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Smokenza Support",
    description:
      "Reach out to Smokenza for customer support, orders, or general inquiries.",
    images: ["https://smokenza.com/og-contact.jpg"],
  },
};


function page() {
  return (

    <>


    <Head>
<title>Contact Admin | Smokenza</title>
<meta
  name="description"
  content="Get in touch with the Smokenza team for support, inquiries, or feedback. Our admin is ready to assist you with any questions about orders, products, or services."
/>

    </Head>
     <div className='mx-[16px] md:mx-[32px] py-[16px] md:py-[32px]'>
     
       <ContactForm/>
        
    </div>
    </>
   
  )
}

export default page