import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  output: "standalone", // 👈 isto é o que faltava!
};

export default nextConfig;