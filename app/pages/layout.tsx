
import { ReactNode } from "react";
import Advertise from "../components/LeadingPage/Advertise";
import Navbar from "../components/LeadingPage/Navbar2";
import Footer from "../components/FooterSection/Footer";

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