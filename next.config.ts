import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Disable optimization for uploaded images
    // This ensures /uploads/* images work correctly
    unoptimized: true,
  },
};

export default nextConfig;
