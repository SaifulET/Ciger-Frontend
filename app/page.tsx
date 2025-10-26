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





export default function Home() {
  return (
    <div className="bg-[#f1eeee]">
      <div>
        <Advertise/>
      </div>
      <div >
        <Navbar1 />
      </div>
      <div >
       
        <div className="mt-4 mb-16">
          <Slider />
        </div>
      </div>
      <div className="mt-16">
        <FeaturedBrand/>
      </div>
      <div className="mt-16">
        <Discount/>
      </div>
      <div className="mt-16">
        <BestSeller/>
      </div>
      <div className="mt-16">
        <NewArrival/>
      </div>
      <div className="mt-16">
        <BlogCarousal/>
      </div>
      <div className="mt-16">
        <ValueSection/>
      </div>
      <div className="mt-16">
        <ReviewSection/>
      </div>
      <div className="mt-16">
        <FaqSection/>
      </div>
      <div className="">
        <Footer/>
      </div>
    </div>
  );
}
