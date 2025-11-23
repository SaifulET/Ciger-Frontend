import React from 'react';
import ImageGallery from './imagegallery';
import excelbis from "@/public/excelbis.png"
// Your JSON data
const imageData = {
  imageGallery: [
    {
      id: "1",
      name: "Modi Grape",
      image:"https://excelbislabs.com/wp-content/uploads/2021/10/Excelbis-Labs-logo-250x106.png",
      link: "https://drive.google.com/file/d/1wDjmT-K61BesUhSorRbo-eUEX-D2KH3Q/view"
    },
    {
      id: "2",
      name: "Cannabis ChemLab",
      image: "https://static.wixstatic.com/media/7494ec_c8482b8d8ba640c4af2e4762de61bd09~mv2.png/v1/fill/w_535,h_525,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/7494ec_c8482b8d8ba640c4af2e4762de61bd09~mv2.png",
      link: "https://drive.google.com/file/d/1IDgJQ-mTgeHGrArKBgstHYoLB6utm6R0/view"
    },
    {
      id: "3",
      name: "Lemon Tee",
      image: "https://lemontree.se/wp-content/uploads/2023/03/Lemontree-logo_orange-2.png",
      link: "https://drive.google.com/file/d/1uHPtdWVbyS9KE_ZskRCDtQYQ6j4CgndP/view?pli=1"
    },
    {
      id: "4",
      name: "Pinnacle Analysis",
      image: "https://pinnacle-analytics.com/wp-content/uploads/2020/03/pinnacle_logo_sm.png",
      link: "http://drive.google.com/file/d/1uRPGZsS6Go-RlYeFkVX-E3RyulUrTO-5/view"
    }
  ]
};

const ImageData: React.FC = () => {
  return (
       <div className="min-h-screen p-[16px] md:p-[32px]">
      <div className="">
        <h1 className="bg-white rounded-lg font-montserrat font-semibold text-[28px] leading-[48px] tracking-normal text-center mb-[16px] md:mb-[32px] p-[16px] md:p-[32px]">
          COA
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row md:gap-4 gap-[16px] p-[16px] md:p-[32px] bg-white rounded-lg md:justify-center">
        <ImageGallery images={imageData.imageGallery} />
      </div>
    </div>
    </div>
  );
};

export default ImageData;