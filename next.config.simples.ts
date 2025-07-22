import type { NextConfig } from "next";

// Configuração mais simples para hospedagem compartilhada
const nextConfig: NextConfig = {
  // Export estático
  output: 'export',
  trailingSlash: true,
  
  // Images sem otimização
  images: {
    unoptimized: true,
  },
  
  // Ignorar erros para build de produção
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Webpack simples
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;