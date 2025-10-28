import BlogPage from '@/app/components/Blogpage/BlogComponent'
import React from 'react'
import  blogImg from "@/public/blog.svg"

function page() {
       const blog=[
    { id: 1, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 2, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 3, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 4, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 6, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 7, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 8, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    { id: 9, title: "Cigar is the best product", description: "Discover the art..d.", image: blogImg },
    // ... more
  ]
  return (
 
    <div className='p-8 py-16'>
        <BlogPage
  blogs={blog}
/>
    </div>
  )
}

export default page