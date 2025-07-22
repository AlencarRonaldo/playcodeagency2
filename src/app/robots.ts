import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/_next/',
        '/static/',
        '*.json',
        '*.xml',
      ],
    },
    sitemap: 'https://playcodeagency.xyz/sitemap.xml',
    host: 'https://playcodeagency.xyz'
  }
}