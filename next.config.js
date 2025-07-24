/** @type {import('next').NextConfig} */
const nextConfig = {
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

module.exports = nextConfig;