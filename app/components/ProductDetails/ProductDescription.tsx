import React from "react";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <h2 className="text-[28px] font-semibold leading-[36px] mb-4">Product Description</h2>
      <p className="text-base font-normal leading-6">{description}</p>
    </div>
  );
}
