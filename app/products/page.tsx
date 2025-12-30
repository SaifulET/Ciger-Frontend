import React, { Suspense } from "react";
import ProductsPage from "@/app/components/Products/ProductPages";
import { Metadata } from "next";
import Navbar from "../components/LeadingPage/Navbar2";
import Advertise from "../components/LeadingPage/Advertise";
import Footer from "../components/FooterSection/Footer";
import Head from "next/head";

// Force the page to be dynamic so metadata updates per request
export const dynamic = "force-dynamic";

interface SearchParams {
  sub?: string;
  subPro?: string;
  brand?: string;
  discount?: string;
  new?: string;
  best?: string;
  keyword?: string;
}

const ProductPage = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;

  return (

    <>

    <Head>

<title>All Products with Filters | Smokenza</title>
<meta
  name="description"
  content="Explore all products at Smokenza with advanced filters. Browse smoking accessories, e-liquids, and more by category, brand, price, and features to find exactly what you need."
/>

    </Head>
    <div className="md:p-8">
      

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
        <Suspense fallback={<div>Loading...</div>}>   <ProductsPage />
        </Suspense>
     
      </div>
      <div className="">
        <Footer/>

      </div>

    </>

       
      
    </div>
    </>
    
  );
};

export default ProductPage;

// Generate metadata using the `searchParams` variable
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const { sub, subPro, brand, discount, new: isNew, best, keyword } = params;

  // Build title
  let title = "";

  if (keyword) title = `Search results for "${keyword}"`;
  else if (sub && subPro) title = `Explore ${subPro} in ${sub}`;
  else if (sub) title = `Shop ${sub} `;

  if (brand) title += `Brand: ${brand}`;
  if (discount === "true") title += "Discounted Product";
  if (isNew === "true") title += "New Arrival Product";
  if (best === "true") title += "Best Seller Product";
  title += " | Discover Amazing Products";
  // Build description
  let description = "Find the best products that match your needs.";

  if (keyword)
    description = `Results for "${keyword}" across all categories and brands.`;
  else if (sub && subPro)
    description = `Browse ${subPro} in ${sub} and discover top products.`;
  else if (sub)
    description = `Browse products in ${sub} and find your favorites.`;

  if (brand) description += ` Featuring products by ${brand}.`;
  if (discount === "true") description += " Enjoy special discounted prices!";
  if (isNew === "true") description += " Check out the latest arrivals!";
  if (best === "true") description += " See our best-selling products!";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/pages/product${keyword ? `?keyword=${keyword}` : ""}`,
      type: "website",
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
    },
  };
}
