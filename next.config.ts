import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // 🔥 ativa o uso de src/app como sistema de rotas
  },
};

export default nextConfig;