import MainBlogPage from "@/app/components/Blogpage/MainBlogPage"


import type { Metadata } from "next";
import Advertise from "../components/LeadingPage/Advertise";
import Navbar from "../components/LeadingPage/Navbar2";
import Footer from "../components/FooterSection/Footer";


export const metadata: Metadata = {
  title: "Smokenza Blog | Cigar Guides, Tips & Industry News",
  description:
    "Read the latest Smokenza blog posts on premium cigars, smoking tips, cigar care guides, and industry news.",
  alternates: {
    canonical: "https://smokenza.com/blog",
  },
  robots: {
    index: true,
    follow: true,
  },
};



function Page() {
 

  return (
      <>
      <div className="bg-[#f1eeee] p-0 m-0">
        <div>
          <Advertise/>
        </div>
        <div>
          <Navbar />
        </div>
      </div>
      <div className="bg-[#f1eeee] m-0 p-0 ">
        <MainBlogPage/>
      </div>
      <div className="">
        <Footer/>

      </div>

    </>
   
  )
}

export default Page