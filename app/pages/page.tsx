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
      
      <div className=" mb-16">
          <Slider />
        </div>
      <div className="mt-16">
        <ProductCarousel/>
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
      <div className="mt-16 pb-16 ">
        <FaqSection/>
      </div>
      
      
    </div>
  );
}
