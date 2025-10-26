"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface BlogItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

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
    <div className="">
        <div className="flex flex-col items-center md:px-8 gap-8  bg-white rounded-xl md:mx-auto pt-16">
      <h2 className="text-center font-montserrat text-[40px] font-semibold leading-[48px] pb-8">
        Blog
      </h2>

      {/* Blog List */}
      <div className="flex flex-col w-full gap-6">
        {paginatedBlogs.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-row bg-white rounded-lg border overflow-hidden"
          >
            {/* Image */}
            <div className="w-1/2 h-[200px] md:h-[260px] relative">
              <Image
                src={blog.image}
                alt={blog.title}
               fill
                className="object-cover"
               
              />
            </div>

            {/* Content */}
            <div className="w-1/2 flex flex-col justify-between p-6">
            
              <div>
                <h3 className="text-lg font-semibold mb-2">{blog.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {blog.description}
                </p>
              </div>

              <Link href={`/pages/blog/${blog.id}`}>
                <button className="bg-[#D5A23E] mt-4 py-2 px-4 rounded-md text-white text-sm hover:opacity-90 ">
                  View
                </button>
              </Link>
              
            </div>
          </div>
        ))}
      </div>

      {/* Footer Pagination */}
      <div className="flex   justify-between w-full items-center pb-16">
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
