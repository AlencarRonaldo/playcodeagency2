// CSP Configuration for PlayCode Agency
// Handles Three.js, Framer Motion, and other framework requirements

export interface CSPConfig {
  development: string
  production: string
}

export const CSP_POLICIES: CSPConfig = {
  development: [
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
  ].join('; '),

  production: [
    "default-src 'self'",
    // Three.js and Framer Motion require unsafe-eval for WebGL shaders and animations
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
}

// Alternative strict CSP for high-security environments (disables Three.js)
export const STRICT_CSP_POLICIES: CSPConfig = {
  development: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://api.openai.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "media-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "connect-src 'self' https://api.openai.com ws://localhost:*"
  ].join('; '),

  production: [
    "default-src 'self'",
    "script-src 'self' https://api.openai.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "media-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
    "connect-src 'self' https://api.openai.com"
  ].join('; ')
}