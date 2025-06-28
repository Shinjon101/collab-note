import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ⚠️ suppresses all ESLint build errors
  },
};

export default nextConfig;
