import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors: true,
  },
  output: 'export',
  images: {
    unoptimized: true, // Disable Image Optimization API for static builds
  },
};

export default nextConfig;
