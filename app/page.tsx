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
      <div className="">
        <FaqSection/>
      </div>
      <div className="">
        <Footer/>
      </div>
    </div>
  );
}
