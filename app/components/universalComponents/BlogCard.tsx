"use client";

import Image from "next/image";
import Link from "next/link";

interface StaticImageData {
  src: string;
  height: number;
  width: number;
  blurDataURL?: string;
  blurWidth?: number;
  blurHeight?: number;
}

interface Product {
  image: string| StaticImageData ; // Allow both string URLs and StaticImageData
  title: string;
  description: string;
  link?: string;
  _id?: string;
}

interface BlogCardProps {
  product: Product;
}
const getFirstNWords = (html: string, wordCount: number = 40): string => {
  // Remove HTML tags and get plain text
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Split into words and take first N words
  const words = text.split(' ').slice(0, wordCount);
  
  return words.join(' ') + (words.length >= wordCount ? '...' : '');
};

const BlogCard: React.FC<BlogCardProps> = ({ product }) => {
  const { image, title, description, link, _id } = product;

  return (
    <div className="flex flex-col items-start border border-[#B0B0B0] rounded-[14px] overflow-hidden bg-white">
      {/* Image */}
      <div className="relative w-full pt-0 md:pt-[12px]">
        <Image
          src={image}
          alt={title}
          className="object-fill h-[220px] w-[255px] m-auto rounded"
          width={362}
          height={200}
          sizes="(max-width: 362px) 100vw, 362px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col font-normal text-[16px] items-center p-6 gap-3 w-full">
        <h4 className="text-[18px]  font-medium text-[#0C0C0C] align-left">
          {title}
        </h4>
 {getFirstNWords(description, 20)}
        {/* <p className="text-[16px] leading-[24px] font-normal font-[Open_Sans] text-[#0C0C0C]">
           <div 
          className="text-[16px] leading-[24px] font-normal font-[Open_Sans] text-[#0C0C0C] w-full"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        </p> */}

        <Link
          href={link || `/pages/blog/${_id}`}
          className="w-full"
        >
          <button className="flex justify-center items-center w-full h-[52px] bg-[#C9A040] rounded-[12px] hover:bg-[#B78E35] transition-colors">
            <span className="text-[16px] leading-[24px] font-semibold font-[Open_Sans] text-[#0C0C0C] w-full">
              View
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;