import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: false, // Disable LightningCSS (fixes Vercel build error)
  },

  images: {
    domains: ['smokenza.s3.us-east-1.amazonaws.com'],

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'smokenza.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
