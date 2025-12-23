
import { ReactNode } from "react";
import Advertise from "../components/LeadingPage/Advertise";
import Navbar from "../components/LeadingPage/Navbar2";
import Footer from "../components/FooterSection/Footer";

export const metadata = {
  title: "Smokenza",
  description: "Welcome to Smokenza! Buy premium cigars, hookah & vapes online with fast delivery.",
  openGraph: {
    title: "Smokenza | Premium Cigars & Vapes",
    description: "Shop cigars, hookah & vapes online with fast delivery.",
    url: "https://smokenza.com",
    images: [
      {
        url: "https://smokenza.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};


export default function LayoutWrapper({ children }: { children: ReactNode }) {
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
        {children}
      </div>
      <div className="">
        <Footer/>

      </div>

    </>
  );
}