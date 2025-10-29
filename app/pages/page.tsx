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






export default function Home() {
  return (
    <div className="bg-[#f1eeee]">
      
      <div className=" ">
          <Slider />
      </div>
      <div className="">
        <ProductCarousel/>
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
      <div className="pb-[16px] md:pb-[32px] ">
        <FaqSection/>
      </div>
      
      
    </div>
  );
}
