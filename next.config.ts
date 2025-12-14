import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow local images from uploads folder
    remotePatterns: [],
    // For local development with uploaded files
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
