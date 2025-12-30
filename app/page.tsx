import Navbar1 from "./components/LeadingPage/Navbar2";

import Slider from "./components/LeadingPage/slider";
import FeaturedBrand from "./components/LeadingPage/FeaturedBrand";
import FaqSection from "./components/LeadingPage/Faq";
import Footer from "./components/FooterSection/Footer";
import ValueSection from "./components/LeadingPage/WhyChoose";
import BlogCarousal from "./components/LeadingPage/BlogPreview";
import BestSeller from "./components/LeadingPage/BestSeller";
import NewArrival from "./components/LeadingPage/NewArrivals";
import Discount from "./components/LeadingPage/Discount";
import ReviewSection from "./components/LeadingPage/ReviewSection";
import Advertise from "./components/LeadingPage/Advertise";
import Head from "next/head";





export default function Home() {
  return (

    <>
    <Head>
      <link rel="preconnect" href="https://backend.smokenza.com" />

      <title>Smokenza | Premium Smoking Products & Accessories</title>
<meta
  name="description"
  content="Welcome to Smokenza! Explore our latest arrivals, best sellers, exclusive discounts, and premium smoking products. Read reviews, check our blog, FAQs, and browse top brands—all in one place."
/>

    </Head>
     <div className="bg-[#f1eeee]">
      <div>
        <Advertise/>
      </div>
      <div >
        <Navbar1 />
      </div>
      <div >
       
        <div className="">
          <Slider />
        </div>
      </div>
      <div className="">
        <FeaturedBrand/>
      </div>
      <div className="">
        <Discount/>
      </div>
      <div className="">
        <BestSeller/>
      </div>
      <div className="">
        <NewArrival/>
      </div>
      <div className="">
        <BlogCarousal/>
      </div>
      <div className="">
        <ValueSection/>
      </div>
      <div className="">
        <ReviewSection/>
      </div>
      <div className="pb-[16px] md:pb-[32px]">
        <FaqSection/>
      </div>
      <div className="">
        <Footer/>
      </div>
    </div>
    </>
   
  );
}
