import ContactForm from "../components/ContactForm/ContactForm";
import Footer from "../components/FooterSection/Footer";
import BestSeller from "../components/LeadingPage/BestSeller";
import BlogCarousal from "../components/LeadingPage/BlogPreview";
import Discount from "../components/LeadingPage/Discount";
import FaqSection from "../components/LeadingPage/Faq";
import ProductCarousel from "../components/LeadingPage/FeaturedBrand";
import NewArrival from "../components/LeadingPage/NewArrivals";
import ReviewSection from "../components/LeadingPage/ReviewSection";
import Slider from "../components/LeadingPage/slider";
import ValueSection from "../components/LeadingPage/WhyChoose";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Smokenza | Premium Cigars, Hookah & Nicotine Vapes",
    template: "%s | Smokenza",
  },
  description: "Smokenza offers premium cigars, hookah, nicotine vapes, smoking accessories & supplies. Shop online with fast shipping, secure checkout, and competitive prices. Age verification required.",
  keywords: [
    "premium cigars",
    "hookah supplies",
    "nicotine vapes",
    "smoking accessories",
    "vape shop online",
    "cigar store",
    "shisha products",
    "rolling papers",
    "smoke shop",
    "vape juice",
    "e-cigarettes",
    "tobacco products",
    "smoking pipes",
    "vape accessories",
    "cigar accessories"
  ].join(", "),
  authors: [{ name: "Smokenza" }],
  creator: "Smokenza",
  publisher: "Smokenza",
  formatDetection: {
    email: false,
    address: false,
    telephone: true,
  },
  metadataBase: new URL("https://smokenza.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://smokenza.com",
    title: "Smokenza | Premium Cigars, Hookah & Nicotine Vapes Online",
    description: "Shop the finest cigars, hookah supplies, nicotine vapes and smoking accessories. Fast delivery & secure checkout.",
    siteName: "Smokenza",
    images: [
      {
        url: "https://smokenza.com/_next/image?url=https%3A%2F%2Fsmokenza.s3.us-east-1.amazonaws.com%2Fuploads%2F1765824937950-Artboard-3.jpg&w=1920&q=75",
        width: 1200,
        height: 630,
        alt: "Smokenza Premium Smoking Products",
      },
      {
        url: "https://smokenza.com/_next/image?url=https%3A%2F%2Fsmokenza.s3.us-east-1.amazonaws.com%2Fuploads%2F1765824987230-Artboard-2.jpg&w=1920&q=75",
        width: 1200,
        height: 630,
        alt: "Smokenza Cigars & Vapes Collection",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smokenza | Premium Cigars & Vapes",
    description: "Shop cigars, hookah & nicotine vapes online with fast delivery and secure checkout.",
    images: ["https://smokenza.com/_next/image?url=https%3A%2F%2Fsmokenza.s3.us-east-1.amazonaws.com%2Fuploads%2F1765824987230-Artboard-2.jpg&w=1920&q=75"],
    site: "@Smokenza",
    creator: "@Smokenza",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-search-console-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification",
    // otherVerification: {
    //   name: "facebook-domain-verification",
    //   content: "your-facebook-verification",
    // },
  },
  category: "smoking accessories",
  other: {
    "og:price:currency": "USD",
    "product:brand": "Smokenza",
    "age-restriction": "18+",
    "restricted-countries": "check local laws",
  },
};

export default function Home() {
  return (
    <div className="bg-[#f1eeee]">
      <div className=" ">
        <Slider />
      </div>
      <div className="">
        <ProductCarousel />
      </div>
      <div className="">
        <Discount />
      </div>
      <div className="">
        <BestSeller />
      </div>
      <div className="">
        <NewArrival />
      </div>
      <div className="">
        <BlogCarousal />
      </div>
      <div className="">
        <ValueSection />
      </div>
      <div className="">
        <ReviewSection />
      </div>
      <div className="pb-[16px] md:pb-[32px] ">
        <FaqSection />
      </div>
    </div>
  );
}