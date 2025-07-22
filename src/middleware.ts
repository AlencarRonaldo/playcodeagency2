import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Admin route protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Skip protection for login page
    if (request.nextUrl.pathname === '/admin/login') {
      // If already authenticated, redirect to admin dashboard
      const adminAuth = request.cookies.get('playcode_admin')?.value
      if (adminAuth) {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
    } else {
      // Basic protection - in production, implement proper authentication
      const adminAuth = request.cookies.get('playcode_admin')?.value
      const isDev = process.env.NODE_ENV === 'development'
      
      // Allow in development or with admin cookie
      if (!isDev && !adminAuth) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    }
  }

  // Create response
  const response = NextResponse.next()

  // Enhanced Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('X-Download-Options', 'noopen')
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  // Strict Transport Security (HTTPS only)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }
  
  // Enhanced CSP - Allowing unsafe-eval for Three.js and animation libraries
  const isDevelopment = process.env.NODE_ENV === 'development'
  
  const csp = isDevelopment 
    ? [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.openai.com",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "media-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "connect-src 'self' https://api.openai.com ws://localhost:* wss://localhost:*"
      ].join('; ')
    : [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' https://api.openai.com https://vercel.live",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "media-src 'self' blob: data:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'",
        "upgrade-insecure-requests",
        "connect-src 'self' https://api.openai.com"
      ].join('; ')
  
  response.headers.set('Content-Security-Policy', csp)
  
  // Permissions Policy (Feature Policy)
  response.headers.set('Permissions-Policy', [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'bluetooth=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '))

  // Generate nonce for scripts (if needed in future)
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  response.headers.set('X-CSP-Nonce', nonce)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - sounds (audio files)
     * - team (team images)
     */
    '/((?!api|_next/static|_next/image|_next/webpack-hmr|favicon.ico|sounds|team|.*\\.).*)',
  ],
}