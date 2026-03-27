import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/db", "@repo/app-config"],
  // satori and resvg-js use native Node.js modules — keep them server-side only
  serverExternalPackages: ["satori", "@resvg/resvg-js"],
};

export default nextConfig;
