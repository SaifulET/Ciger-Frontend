import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  
    images: {
    domains: ['smokenza.s3.us-east-1.amazonaws.com'],
    // Or if you're using Next.js 13+ with remotePatterns (recommended):
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
