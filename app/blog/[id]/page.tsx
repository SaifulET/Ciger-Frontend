import BlogDetailsClient from "./BlogDetailsClient";
import type { Metadata } from "next";
import api from "@/lib/axios";
import Footer from "@/app/components/FooterSection/Footer";
import Navbar from "@/app/components/LeadingPage/Navbar2";
import Advertise from "@/app/components/LeadingPage/Advertise";

interface BlogItem {
  _id: string;
  name: string;
  description: string;
  image: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params; // <-- unwrap the promise
  const id = resolvedParams.id;
  console.log("generateMetadata ID:", id);

  if (!id) {
    return {
      title: "Blog Not Found | Smokenza",
      description: "Blog ID missing",
      robots: { index: false },
    };
  }

  let blog: BlogItem | null = null;

  try {
    const res = await api.get(`/blog/getBlogById/${id}`);
    if (res.data.success) blog = res.data.data;
  } catch (err) {
    console.error("Error fetching blog for metadata:", err);
  }

  if (!blog) {
    return {
      title: "Blog Not Found | Smokenza",
      description: "Blog does not exist",
      robots: { index: false },
    };
  }

  const cleanDescription = blog.description?.replace(/<[^>]+>/g, "").slice(0, 160);

  return {
    title: `${blog.name} | Smokenza Blog`,
    description: cleanDescription,
    alternates: { canonical: `https://smokenza.com/blog/${id}` },
    openGraph: {
      title: blog.name,
      description: cleanDescription,
      url: `https://smokenza.com/blog/${id}`,
      siteName: "Smokenza",
      images: [{ url: blog.image, width: 1200, height: 630, alt: blog.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.name,
      description: cleanDescription,
      images: [blog.image],
    },
  };
}

// Server component
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params; // <-- unwrap promise
  const id = resolvedParams.id;

  return(
          <>
      <div className="bg-[#f1eeee] p-0 m-0">
        <div>
          <Advertise/>
        </div>
        <div>
          <Navbar />
        </div>
      </div>
      <div className="bg-[#f1eeee] m-0 p-0 ">
        <BlogDetailsClient id={id} />
      </div>
      <div className="">
        <Footer/>

      </div>

    </>
   
  ) 
  
  
}
