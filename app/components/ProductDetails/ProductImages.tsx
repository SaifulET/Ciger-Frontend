import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImagesProps {
  images: string[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
}

export default function ProductImages({ images, currentImageIndex, setCurrentImageIndex }: ProductImagesProps) {
  const handlePrev = () => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length);
  const handleNext = () => setCurrentImageIndex((currentImageIndex + 1) % images.length);

  return (
    <div className="mb-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4">
        <div className="relative bg-gray-100 aspect-square flex items-center justify-center">
          <img src={images[currentImageIndex]} alt="Product" className="object-cover w-3/4 h-3/4 rounded-2xl" />
          

          <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full transition">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="flex gap-2 p-4 bg-white">
          {images.map((img, idx) => (
            <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-24 h-24 rounded border-2 overflow-hidden ${currentImageIndex === idx ? "border-yellow-600" : "border-gray-200"}`}>
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
