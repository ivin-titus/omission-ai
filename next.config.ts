import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com", // Required to render user avatars from Clerk
      },
    ],
  },
};

export default nextConfig;
