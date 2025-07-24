/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de produção otimizadas para AWS
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  images: {
    unoptimized: false,
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Headers para cache otimizado no CloudFront
  async headers() {
    return [
      {
        source: '/(.*)\\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Webpack otimizado para ambiente AWS
  webpack: (config, { dev, isServer }) => {
    if (dev) {
      // Configurações de desenvolvimento
      config.cache = false;
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    } else {
      // Otimizações para produção
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };
    }
    
    // Otimizações específicas para Three.js e grandes dependências
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  // Experimental features para melhor performance
  experimental: {
    optimizeCss: process.env.NODE_ENV === 'production',
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot',
      'framer-motion',
    ],
  },
  // Configurações de build otimizadas
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Output para melhor compatibilidade com AWS
  trailingSlash: false,
  generateEtags: false,
  poweredByHeader: false,
};

module.exports = nextConfig;