'use client'

import BlogPage from '@/app/components/Blogpage/BlogComponent'
import api from '@/lib/axios'
import React, { useState, useEffect } from 'react'
import blogImg from "@/public/blog.jpg" // Your local placeholder image
import Head from 'next/head';
// Your API response interfaces
interface Blog {
  _id: number
  name: string
  description?: string
  image: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  success: boolean
  count: number
  data: Blog[]
}

function Page() {
  const [blogs, setBlogs] = useState<React.ComponentProps<typeof BlogPage>['blogs']>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError, ] = useState<string | null>(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true)
        const response = await api.get<ApiResponse>('/blog/getAllBlogs')
        
        if (!response.data) {
          throw new Error('Failed to fetch blogs')
        }
        
        const result = response.data
        
        if (!result.success) {
          throw new Error('API request failed')
        }

        // Transform the API data to match BlogPage expectations
        // Use local placeholder image since we can't convert URLs to StaticImageData
        const transformedBlogs = result.data.map((blog, index) => ({
          id: blog._id, // Generate numeric ID
          title: blog.name,
          description: blog.description || 'No description available',
          image: blog.image // Use local placeholder instead of remote URL
        }))
        
        setBlogs(transformedBlogs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  if (loading) {
    return <div>Loading blogs...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <>

<Head>
       <title>Blog | Smokenza</title>
<meta
  name="description"
  content="Read Smokenza blogs for the latest updates, tips, and insights on smoking accessories, lifestyle, and more. Discover guides, reviews, and news all in one place."
/>
      </Head>
     <div className=''>
      
      <BlogPage blogs={blogs} />
    </div>
    </>
   
  )
}

export default Page