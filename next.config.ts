import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint:{
    ignoreDuringBuilds: true,
  },
  typescript:{
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["maruthi-sweets-bucket.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
