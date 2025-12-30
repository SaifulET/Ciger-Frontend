// app/pages/product/[slug]/page.tsx
import { Suspense } from "react";
import ProductDetailPage from "@/app/components/ProductDetails/ProductDetailspage";
import { Metadata } from "next";
import Head from "next/head";

export const dynamic = "force-dynamic";

interface Params {
  slug: string;
}

// Debug function to see what's happening
async function fetchProductForMetadata(slug: string) {
  
  try {
    // First, let's check what URL we're trying to fetch
    // Assuming your API accepts slugs, you might need to update the endpoint
    const apiUrl = `https://backend.smokenza.com/product/getProductBySlug/${slug}`;
    // If your API doesn't have a slug endpoint, you might need to use:
    // const apiUrl = `https://backend.smokenza.com/product/getProductBySlug/${slug}`;
    
    const response = await fetch(apiUrl, {
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    
    if (!response.ok) {
      
      return null;
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Main page component
export default async function SingleProductPage({ 
  params 
}: { 
  params: Promise<Params> 
}) {
  const { slug } = await params;
  
  // Pass the slug to your product detail component if needed
  return (
    <>
    <Head>

<title>{slug} | Smokenza</title>
<meta
  name="description"
  content={`Discover ${slug} at Smokenza. Check detailed specifications, features, and pricing of this top-quality smoking accessory. Order now for fast delivery!`}
/>

    </Head>
    
      <div>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetailPage  />
      </Suspense>
    </div>
    </>
  
  );
}

// Generate metadata for product details
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const product = await fetchProductForMetadata(slug);
    
    if (!product) {
      return {
        title: "Product | Our Store",
        description: "View product details",
      };
    }

    const productName = product.name || product.title || "Product";
    const description = product.description 
      ? `${product.description.substring(0, 155)}...`
      : `Shop ${productName} online`;
    
    return {
      title: `${productName} | Our Store`,
      description,
      openGraph: {
        title: `${productName} | Our Store`,
        description,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Product | Our Store",
      description: "View product details",
    };
  }
}