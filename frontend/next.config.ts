import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rsa-db.bobyed.com",
        port: "",
        pathname: "/api/files/**",
      },
    ],
  },
};

export default nextConfig;