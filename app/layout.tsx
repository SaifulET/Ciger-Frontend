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
  metadataBase: new URL("https://smokenza.com"),

  title: {
    default: "Smokenza: Buy Premium Cigars, Hookah, Vapes & More",
    template: "%s | Smokenza",
  },

  description:
    "Shop premium cigars, hookah, nicotine vapes & accessories online. Fast delivery & secure checkout.",

  icons: {
    icon: [
      {
        url: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
    apple: "/favicon.png",
    shortcut: "/favicon.png",
  },

  openGraph: {
    title: "Smokenza: Buy Premium Cigars, Vapes & More",
    description:
      "Shop premium cigars, hookah & nicotine vapes online with fast delivery.",
    url: "https://smokenza.com",
    siteName: "Smokenza",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={poppins.className} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div className="bg-white text-[#212121]">{children}</div>
      </body>
    </html>
  );
}
