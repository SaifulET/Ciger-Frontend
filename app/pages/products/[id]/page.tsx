// app/pages/product/[id]/page.tsx
import { Suspense } from "react";
import ProductDetailPage from "@/app/components/ProductDetails/ProductDetailspage";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

interface Params {
  id: string;
}

// Debug function to see what's happening
async function fetchProductForMetadata(id: string) {
  
  try {
    // First, let's check what URL we're trying to fetch
    const apiUrl = `https://backend.smokenza.com/product/getProductById/${id}`;
    
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
  const { id } = await params;
  
  return (
    <div>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetailPage />
      </Suspense>
    </div>
  );
}

// Generate metadata for product details
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<Params> 
}): Promise<Metadata> {
  const { id } = await params;
  
  try {
    const product = await fetchProductForMetadata(id);
    
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