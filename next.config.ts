import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's928stl0mm.ufs.sh',
      },
      {
        protocol: 'https',
        hostname: '**.ufs.sh',
      },
    ],
  },
};

export default nextConfig;
