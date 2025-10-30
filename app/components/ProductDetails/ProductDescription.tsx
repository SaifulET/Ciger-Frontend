import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm mt-[16px] md:mt-[32px] p-[16px] md:p-[32px]">
      <h2 className="text-[28px] font-semibold leading-[36px] mb-[16] md:mb-[32px]">Product Description</h2>
      <p className="text-[14px] font-normal leading-6">{description}</p>
    </div>
  );
}
