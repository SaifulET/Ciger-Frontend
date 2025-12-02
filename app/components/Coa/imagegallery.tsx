'use client'
import React from 'react';

interface ImageItem {
  id: string;
  name: string;
  image: string;
  link: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
 const handleImageClick = (link: string) => {
  // Open link in new tab
  window.open(link, '_blank', 'noopener,noreferrer');
};

  return (
   <div className="space-y-10 p-4 md:p-6 2xl:p-8">
  {/* THCa Flowers Section */}
  <div className="">
    <h2 className="py-[32px] text-[24px] font-semibold text-gray-800 text-center">
      THCa Flowers
    </h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3 2xl:gap-12">
      {images.slice(0, 3).map((image) => (
        <div 
          key={image.id}
          className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg "
          onClick={() => handleImageClick(image.link)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image.image} 
              alt={image.name}
              className="object-fill  transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>
          <div className="bg-gray-50 px-4 py-3 text-center transition-colors duration-300 group-hover:bg-gray-100 md:px-6 md:py-4">
            <h3 className="text-lg font-semibold text-gray-800 md:text-xl">
              {image.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Pre-Rolls Section */}
  <div className="">
    <h2 className="pb-[32px] text-[24px] font-semibold text-gray-800 text-center ">
      Pre-Rolls
    </h2>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-10 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-12">
      {images.slice(3, 7).map((image) => (
        <div 
          key={image.id}
          className="group cursor-pointer overflow-hidden rounded-xl bg-white shadow-lg"
          onClick={() => handleImageClick(image.link)}
        >
          <div className="relative aspect-[4/3] overflow-hidden">
            <img 
              src={image.image} 
              alt={image.name}
              className="object-fit m-auto transition-transform duration-300 group-hover:scale-105  pt-[100px]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </div>
          <div className="bg-gray-50 px-4 py-3 text-center transition-colors duration-300 group-hover:bg-gray-100 md:px-6 md:py-4">
            <h3 className="text-lg font-semibold text-gray-800 md:text-xl">
              {image.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
  );
};

export default ImageGallery;