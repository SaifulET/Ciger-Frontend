import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { RelatedProduct } from "./product";
import ProductCard from "@/app/components/Product/ProductCard";

interface Props {
  relatedProducts: RelatedProduct[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onAddCart: (id: number) => void; // Add this prop
}

export default function RelatedProducts({
  relatedProducts,
  currentIndex,
  setCurrentIndex,
  onAddCart, // Destructure it
}: Props) {
  const handleNext = () => {
    if (currentIndex < relatedProducts.length - 3)
      setCurrentIndex(currentIndex + 1);
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  return (
    <div className="mb-12 bg-white p-8 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Products related to this item
      </h2>
      <div className="relative">
        {/* ✅ Responsive Grid Applied */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-10 lg:px-16 w-full ">
          {relatedProducts
            .slice(currentIndex, currentIndex + 3)
            .map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} // Pass as product prop
                onAddCart={onAddCart} // Pass the function
              />
            ))}
        </div>

        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex >= relatedProducts.length - 3}
          className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 p-2 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}