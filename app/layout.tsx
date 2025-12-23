
import type { Metadata } from "next";
import { ReactNode } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: {
    default: "Smokenza: Buy Premium Cigars, Hookah , Vapes & More",
    template: "%s | Smokenza",
  },
  description: "Shop premium cigars, hookah, nicotine vapes & accessories online. Fast delivery & secure checkout.",
  metadataBase: new URL("https://smokenza.com"),
  openGraph: {
    title: "Smokenza: Buy Premium Cigars , Vapes & more",
    description: "Shop premium cigars, hookah & nicotine vapes online with fast delivery.",
    url: "https://smokenza.com",
    siteName: "Smokenza",
    images: [
      {
        url: "https://smokenza.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
  <html lang="en" className={poppins.className} suppressHydrationWarning>
   
    <body suppressHydrationWarning>
      <div  className="bg-white text-[#212121]">
          
        
        {children}
        
      </div>

    </body>
  </html>
);
}