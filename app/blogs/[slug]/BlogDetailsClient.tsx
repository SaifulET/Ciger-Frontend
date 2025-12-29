"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // alternative to catch ID
import api from "@/lib/axios";

interface BlogItem {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export default function BlogDetailsClient({ id }: { id?: string }) {
  const params = useParams();
  
  const blogId = id || params.id; // fallback to useParams

  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!blogId) {
      setError("Blog ID missing");
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blog/getBlogById/${blogId}`);
        if (res.data.success) setBlog(res.data.data);
        else setError("Blog not found");
      } catch {
        setError("Error fetching blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (!blogId) return <p className="text-center py-10 text-red-500">Blog ID missing</p>;
  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;
  if (!blog) return <p className="text-center py-10">Blog not found</p>;

  return (
      <div className="mx-[16px] md:mx-[32px] py-[16px] md:py-[32px]">
        <div className="flex flex-col items-center px-8 py-10 gap-8 bg-white rounded-xl">
          <h2 className="text-center text-[24px] font-semibold ">
            {blog.name}
          </h2>
  
          {/* Image */}
         <div className="w-full lg:w-3/5 xl:w-1/3 h-[350px] relative rounded-lg overflow-hidden">
  <img
    src={blog.image}
    alt={blog.name}
    className="w-full h-full object-fit rounded-lg"
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
