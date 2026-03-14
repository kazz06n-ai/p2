import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/workflow',
        destination: '/workflow/index.html',
      },
    ];
  },
};

export default nextConfig;
