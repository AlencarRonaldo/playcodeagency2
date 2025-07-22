import type { NextConfig } from "next";

// Configuração específica para hospedagem compartilhada Hostinger
const nextConfig: NextConfig = {
  // Export estático para hospedagem compartilhada
  output: 'export',
  trailingSlash: true,
  
  // Images sem otimização para hospedagem compartilhada
  images: {
    unoptimized: true,
  },
  
  // Desabilitar otimizações que não funcionam em hospedagem compartilhada
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configuração simplificada do webpack
  webpack: (config, { dev, isServer }) => {
    // Fallbacks para browser
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
  
  // Base path para arquivos estáticos
  basePath: '',
  
  // Asset prefix para CDN (opcional)
  // assetPrefix: 'https://seudominio.com',
  
  // Compress na build
  compress: true,
  
  // Headers customizados (serão aplicados via .htaccess)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;