import { z } from 'zod'
import DOMPurify from 'isomorphic-dompurify'

// Input sanitization utilities
export class InputSanitizer {
  /**
   * Sanitize HTML content to prevent XSS
   */
  static sanitizeHTML(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    })
  }

  /**
   * Sanitize text for SQL injection prevention
   */
  static sanitizeText(input: string): string {
    return input
      .replace(/['"\\;]/g, '') // Remove dangerous SQL characters
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .trim()
      .substring(0, 1000) // Limit length
  }

  /**
   * Validate and sanitize email
   */
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const cleaned = email.toLowerCase().trim()
    
    if (!emailRegex.test(cleaned)) {
      throw new Error('Invalid email format')
    }
    
    return cleaned
  }

  /**
   * Sanitize phone number
   */
  static sanitizePhone(phone: string): string {
    return phone.replace(/[^\d+\-\s()]/g, '').trim()
  }

  /**
   * Validate and sanitize URL
   */
  static sanitizeURL(url: string): string {
    try {
      const parsed = new URL(url)
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        throw new Error('Invalid protocol')
      }
      return parsed.toString()
    } catch {
      throw new Error('Invalid URL format')
    }
  }
}

// Enhanced validation schemas with security
export const secureContactSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Nome contém caracteres inválidos')
    .transform(InputSanitizer.sanitizeText),
  
  email: z.string()
    .email('Email inválido')
    .max(320, 'Email muito longo')
    .transform(InputSanitizer.sanitizeEmail),
  
  company: z.string()
    .max(200, 'Nome da empresa muito longo')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeText(val) : val),
  
  phone: z.string()
    .max(20, 'Telefone muito longo')
    .optional()
    .transform(val => val ? InputSanitizer.sanitizePhone(val) : val),
  
  message: z.string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(2000, 'Mensagem muito longa')
    .transform(InputSanitizer.sanitizeHTML),
  
  powerUps: z.array(z.string().max(50))
    .max(10, 'Muitos power-ups selecionados')
    .optional(),
  
  gameMode: z.enum(['arcade', 'campaign', 'battle-royale', 'esports-pro'])
    .optional(),

  // Honeypot fields for bot detection
  website: z.string().max(0).optional(), // Should be empty
  confirm_email: z.string().max(0).optional(), // Should be empty
})

export const secureChatSchema = z.object({
  message: z.string()
    .min(1, 'Mensagem não pode estar vazia')
    .max(2000, 'Mensagem muito longa')
    .transform(InputSanitizer.sanitizeHTML),
  
  conversationId: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID de conversa inválido')
    .max(100)
    .optional(),
  
  userId: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/, 'ID de usuário inválido')
    .max(100)
    .optional(),

  // Bot detection
  timestamp: z.number().optional(),
  referrer: z.string().max(500).optional(),
})

export const secureAnalyticsSchema = z.object({
  event: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Nome do evento inválido'),
  
  category: z.enum(['gaming', 'ui', 'achievement', 'power-up', 'navigation', 'interaction', 'security']),
  
  action: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Ação inválida'),
  
  label: z.string()
    .max(200)
    .optional()
    .transform(val => val ? InputSanitizer.sanitizeText(val) : val),
  
  value: z.number()
    .min(0)
    .max(999999)
    .optional(),
  
  userId: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .max(100)
    .optional(),
  
  sessionId: z.string()
    .regex(/^[a-zA-Z0-9_-]+$/)
    .max(100)
    .optional(),
  
  metadata: z.record(z.union([z.string().max(500), z.number(), z.boolean()]))
    .optional(),
})

// Rate limiting with Redis-compatible interface
export interface RateLimitStore {
  get(key: string): Promise<{ count: number; resetTime: number } | null>
  set(key: string, value: { count: number; resetTime: number }): Promise<void>
  del(key: string): Promise<void>
}

export class MemoryRateLimitStore implements RateLimitStore {
  private store = new Map<string, { count: number; resetTime: number }>()

  async get(key: string) {
    return this.store.get(key) || null
  }

  async set(key: string, value: { count: number; resetTime: number }) {
    this.store.set(key, value)
  }

  async del(key: string) {
    this.store.delete(key)
  }

  // Cleanup expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, value] of this.store.entries()) {
      if (now > value.resetTime) {
        this.store.delete(key)
      }
    }
  }
}

export class EnhancedRateLimit {
  constructor(
    private store: RateLimitStore,
    private windowMs: number,
    private maxRequests: number
  ) {}

  async isRateLimited(identifier: string): Promise<boolean> {
    const now = Date.now()
    const key = `rate_limit:${identifier}`
    
    const existing = await this.store.get(key)
    
    if (!existing) {
      await this.store.set(key, { count: 1, resetTime: now + this.windowMs })
      return false
    }
    
    if (now > existing.resetTime) {
      await this.store.set(key, { count: 1, resetTime: now + this.windowMs })
      return false
    }
    
    if (existing.count >= this.maxRequests) {
      return true
    }
    
    await this.store.set(key, { 
      count: existing.count + 1, 
      resetTime: existing.resetTime 
    })
    
    return false
  }
}

// IP address validation and security
export class IPSecurity {
  private static readonly BLOCKED_IPS = new Set([
    '0.0.0.0',
    '127.0.0.1',
    '::1'
  ])

  private static readonly BLOCKED_RANGES = [
    /^10\./,          // Private networks
    /^192\.168\./,    // Private networks
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // Private networks
  ]

  static isValidIP(ip: string): boolean {
    // IPv4 validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/
    // IPv6 validation (simplified)
    const ipv6Regex = /^([0-9a-fA-F]{0,4}:){1,7}[0-9a-fA-F]{0,4}$/
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip)
  }

  static isBlockedIP(ip: string): boolean {
    // Allow all IPs in development
    if (process.env.NODE_ENV === 'development') {
      return false
    }
    
    // In production, only block known malicious IPs
    // Remove localhost and private network blocking for development
    const PRODUCTION_BLOCKED_IPS = new Set<string>([
      // Add specific malicious IPs here when needed
    ])
    
    return PRODUCTION_BLOCKED_IPS.has(ip)
  }

  static getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const realIP = request.headers.get('x-real-ip')
    const cfIP = request.headers.get('cf-connecting-ip')
    
    // Priority: Cloudflare > Real-IP > X-Forwarded-For > fallback
    const ip = cfIP || realIP || forwarded?.split(',')[0] || 'unknown'
    
    return ip.trim()
  }
}

// Security monitoring and alerting
export class SecurityMonitor {
  private static suspiciousPatterns = [
    /script/i,
    /javascript/i,
    /vbscript/i,
    /onload/i,
    /onerror/i,
    /onclick/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /document\./i,
    /window\./i,
  ]

  static detectSuspiciousContent(content: string): string[] {
    const threats = []
    
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(content)) {
        threats.push(pattern.source)
      }
    }
    
    return threats
  }

  static logSecurityEvent(event: {
    type: 'suspicious_input' | 'rate_limit' | 'blocked_ip' | 'xss_attempt' | 'bot_detected' | 'webhook_rate_limit' | 'webhook_validation_failed'
    ip: string
    userAgent?: string
    details: Record<string, unknown>
  }) {
    console.warn('🚨 Security Event:', {
      timestamp: new Date().toISOString(),
      ...event
    })
    
    // TODO: Send to security monitoring service
    // e.g., Sentry, DataDog, custom webhook
  }
}