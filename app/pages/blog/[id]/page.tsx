"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface BlogItem {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  image: string;
}

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await api.get(`/blog/getBlogById/${id}`);
        
        if (response.data.success) {
          setBlog(response.data.data);
        } else {
          setError("Failed to fetch blog");
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("Error loading blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500 py-10">Loading Blog...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-10">{error}</p>;
  }

  if (!blog) {
    return <p className="text-center text-gray-500 py-10">Blog not found</p>;
  }

  return (
    <div className="mx-[16px] md:mx-[32px] py-[16px] md:py-[32px]">
      <div className="flex flex-col items-center px-8 py-10 gap-8 bg-white rounded-xl">
        <h2 className="text-center text-[28px] font-semibold leading-[48px]">
          {blog.name}
        </h2>

        {/* Image */}
        <div className="w-full lg:w-3/5 xl:w-1/3 h-[350px] relative rounded-lg overflow-hidden">
          <Image 
            src={blog.image} 
            alt={blog.name} 
            fill 
            className="object-cover rounded-lg"  
            priority
          />
        </div>

        {/* Description Section with HTML content */}
        <div className="w-full">
         
          <div 
            className="text-sm text-gray-600 leading-relaxed prose max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </div>

      
      </div>   
    </div>
  );
}