"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import blogImg from "@/public/blog.svg"

interface BlogItem {
  id: number;
  title: string;
  description: string;
  content: string;
  tag?: string;
  image: string;
}

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogItem | null>(null);

  // Simulating Fetch - Replace with actual API or data source
  useEffect(() => {
    const storedBlogs: BlogItem[] = [
      {
        id: 1,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      {
        id: 2,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      {
        id: 3,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      {
        id: 4,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      {
        id: 5,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      {
        id: 6,
        title: "Cigar is the best product",
        description: "Short description here...",
        content:
          "A little change in your smoking routine won't hurt you. The Good Stuff Puff Oops Tobacco 160z bags are designed...",
        tag: "Lifestyle, Smoking, Premium",
        image:blogImg,
      },
      // More blogs here...
    ];

    const found = storedBlogs.find((item) => item.id === Number(id));
    if (found) setBlog(found);
  }, [id]);

  if (!blog)
    return <p className="text-center text-gray-500 py-10">Loading Blog...</p>;

  return (
    <div className="pt-5 md:pt-16">
      <div className="flex flex-col items-center px-8 py-10 gap-8 lg:w-[1376px] bg-white rounded-xl md:mx-auto ">
      <h2 className="text-center text-[32px] md:text-[40px] font-semibold leading-[48px]">
        {blog.title}
      </h2>

      {/* Image */}
      <div className="w-full h-[350px] relative rounded-lg overflow-hidden">
        <Image src={blog.image} alt={blog.title} fill className="object-contain"  />
      </div>

      {/* Description Section */}
      <div className="w-full">
        <h3 className="text-[28px] font-semibold leading-[36px] mb-2">Description</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{blog.content}</p>
      </div>

      {/* Tag Section */}
      {blog.tag && (
        <div className="w-full">
          <h3 className="text-[28px] font-semibold leading-[36px] mb-2">Tag</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{blog.tag}</p>
        </div>
      )}
    </div>   
    </div>
   
  );
}
