import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Server Actions default to a 1MB body limit. PDF lessons are uploaded
      // through a server action as multipart FormData and can be up to 300MB
      // (backend cap) — raise the limit so uploads aren't rejected before
      // they even reach our code.
      bodySizeLimit: "305mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
