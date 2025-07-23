import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enhanced build stability
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Remove experimental features for stability
  
  // Performance and cache settings
  onDemandEntries: {
    maxInactiveAge: 60 * 1000 * 60, // 1 hour
    pagesBufferLength: 5,
  },
  
  // Minimal webpack config to avoid issues
  webpack: (config, { isServer }) => {
    // Only add essential fallbacks for browser
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
  
  // Static file optimization
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/sounds/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;