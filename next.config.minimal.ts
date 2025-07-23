import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração absolutamente mínima
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remove todas as customizações que podem causar problemas
  images: {
    unoptimized: true,
  },
};

export default nextConfig;