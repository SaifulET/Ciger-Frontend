"use client";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string|StaticImageData;
}
const getFirstNWords = (html: string, wordCount: number = 40): string => {
  // Remove HTML tags and get plain text
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Split into words and take first N words
  const words = text.split(' ').slice(0, wordCount);
  
  return words.join(' ') + (words.length >= wordCount ? '...' : '');
};
interface BlogPageProps {
  blogs: BlogItem[]; // Passed from another page or fetched
}

export default function BlogPage({ blogs }: BlogPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(blogs.length / perPage);

  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className=" mx-[16px] md:mx-[32px] py-[16px] md:py-[32px]">
        <div className="flex flex-col items-center gap-2  bg-white rounded-xl  p-[16px] md:p-[32px]  ">
      <h2 className="pb-[16px] md:pb-[32px] bg-white rounded-lg  text-[28px] font-semibold leading-[48px] text-gray-900 text-center      ">
        Blogs
      </h2>

      {/* Blog List */}
      <div className="grid grid-cols-1 w-full gap-6">
        {paginatedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-col flex-1 md:flex-row md:gap-4 bg-white rounded-lg border overflow-hidden"
          >
            {/* Image */}
            <div className=" relative w-[220px] md:w-[320px] h-[120px] md:h-[220px] m-auto md:m-0  ">
              <Image
                src={blog.image}
                alt={blog.title}
              fill
                className="object-fill md:object-fit"
               
              />
            </div>

            {/* Content */}
            <div className="md:w-1/2 flex flex-col justify-between p-6">
            
              <div className="text-[16px]">
                <h3 className="text-[24px]  font-medium text-[#0C0C0C] mb-2">{blog.title}</h3>
                {getFirstNWords(blog.description, 20)}
                
              </div>

              <Link href={`/blog/${blog.id}`}>
                <button className="bg-[#D5A23E] mt-4 w-full md:w-auto py-2 px-4 rounded-md font-poppins text-white text-sm hover:opacity-90 ">
                  View
                </button>
              </Link>
              
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pagination */}
      <div className="flex   justify-between w-full items-center ">
        <p className="text-sm text-gray-500">
          Showing {paginatedBlogs.length + (currentPage - 1) * 5} of{" "}
          {blogs.length} results
        </p>
        <div className="flex items-center ">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="w-8 h-8 mr-2 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50"
          >
            &lt;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`w-8 h-8 mr-2 flex items-center justify-center border rounded-lg ${
                currentPage === index + 1
                  ? "bg-[#D5A23E] text-white"
                  : "text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="w-8 h-8 flex items-center justify-center border rounded-full text-gray-600 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div> 
    </div>
   
  );
}
