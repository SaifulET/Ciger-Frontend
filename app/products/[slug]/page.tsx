// app/products/[slug]/page.tsx
import { Suspense } from "react";
import { redirect, notFound } from "next/navigation";
import ProductDetailPage from "@/app/components/ProductDetails/ProductDetailspage";
import Navbar from "@/app/components/LeadingPage/Navbar2";
import Advertise from "@/app/components/LeadingPage/Advertise";
import Footer from "@/app/components/FooterSection/Footer";
import Head from "next/head";

export const dynamic = "force-dynamic";

interface Params {
  slug: string;
}

// Helper: fetch product by ID
async function fetchProductById(id: string) {
  try {
    const response = await fetch(
      `https://backend.smokenza.com/product/getProductById/${id}`,
      { cache: "no-store" }
    );

    if (!response.ok) return null;

    const result = await response.json();
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export default async function SingleProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  
  
  if (!slug) {
    notFound();
  }
  
  // Split the slug to extract ID and slug parts
  const [id, ...slugParts] = slug.split('-');
  const productSlug = slugParts.join('-');
  
  
  // Validate ID format (MongoDB ObjectId)
  if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
    notFound();
  }
  
  const product = await fetchProductById(id);
  
  
  if (!product) {
    notFound();
  }
  
  // Debug: Check what properties exist

  
  // Use correct ID property (MongoDB often uses _id)
  const productId = product.id || product._id;
  
  // Check if slug from URL matches product slug
  if (productSlug !== product.slug) {
   
    
    // Make sure we have both ID and slug before redirecting
    if (productId && product.slug) {
      redirect(`/products/${productId}-${product.slug}`);
    } else {
      
      // notFound();
    }
  }

  
  return (

    <>

    <Head>

<title>{product.name} | Smokenza</title>
<meta
  name="description"
  content={`Discover ${product.name}at Smokenza. Check detailed specifications, features, and pricing. Order online and enjoy fast delivery of this premium smoking product.`}
/>

    </Head>
    <div>
      {/* Uncomment this when ready */}
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
        <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetailPage  />
      </Suspense>
     
      </div>
      <div className="">
        <Footer/>

      </div>

    </>

      
     
    </div>
    </>
    
  );
}