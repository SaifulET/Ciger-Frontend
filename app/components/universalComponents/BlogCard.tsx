"use client";

import Image from "next/image";
import Link from "next/link";

interface Product {
  image: string;
  title: string;
  description: string;
  link?: string;
}

interface BlogCardProps {
  product: Product;
}

const BlogCard: React.FC<BlogCardProps> = ({ product }) => {
  const { image, title, description, link } = product;

  return (
    <div className="flex flex-col items-start   border border-[#B0B0B0] rounded-[12px] overflow-hidden bg-white ">
      {/* Image */}
      <div className="relative w-full  bg-[#D9D9D9]">
        <Image
          src={image}
          alt={title}
          className="object-cover w-full rounded-t-[12px]"
          sizes="(max-width: 362px) 100vw, 362px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col items-center p-6 gap-3 w-full ">
        <h4 className=" text-[18px] leading-[26px] font-semibold f text-[#0C0C0C] ">
          {title}
        </h4>

        <p className=" text-[16px] leading-[24px] font-normal font-[Open_Sans] text-[#0C0C0C]">
          {description}
        </p>

        <Link
              href="/pages/blog/1"
            >
              <button className="flex justify-center items-center gap-2 w-60 md:w-80 h-[52px] bg-[#C9A040] rounded-[12px] hover:bg-[#B78E35] transition-colors">
          <span className="text-[16px] leading-[24px] font-semibold font-[Open_Sans] text-[#0C0C0C]">
           
              View
            
          </span>
        </button>
            </Link>
      </div>
    </div>
  );
};

export default BlogCard;
