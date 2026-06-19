import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This tells Next.js to load the PDF workers correctly in a modern server environment
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
};

export default nextConfig;