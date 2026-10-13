import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backendUrl = (process.env.BACKEND_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

    return [
      {
        source: "/api/backend/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
