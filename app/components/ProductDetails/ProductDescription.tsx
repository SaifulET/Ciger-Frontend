import React from "react";
import { useProductsStore } from "../../store/productDetailsStore";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const { currentProduct } = useProductsStore();

  const displayDescription = description || currentProduct?.description || "No description available.";

  return (
    <div className="bg-white rounded-lg shadow-sm mt-[16px] md:mt-[32px] p-[16px] md:p-[32px]">
      <h2 className="text-[28px] font-semibold leading-[36px] mb-[16px] md:mb-[32px]">Product Description</h2>
      <p className="text-[14px] font-normal leading-6">{displayDescription}</p>
    </div>
  );
}