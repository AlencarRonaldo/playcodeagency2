import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { z } from 'zod'

// Validation schema
const chatSchema = z.object({
  message: z.string().min(1, 'Mensagem não pode estar vazia').max(1000),
  conversationId: z.string().optional(),
  userId: z.string().optional(),
})

// Initialize OpenAI only if API key is available
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

// Gaming personality prompt for PlayBot
const PLAYBOT_SYSTEM_PROMPT = `
Você é o PlayBot, um assistente AI especializado em desenvolvimento gaming da PlayCode Agency.

PERSONALIDADE:
- Entusiasta de games e tecnologia
- Linguagem casual mas profissional
- Usa termos gaming e metáforas de jogos
- Emoticons e emojis gaming frequentes
- Respostas diretas e úteis

ESPECIALIDADES:
- Desenvolvimento web com foco gaming
- Tecnologias modernas (React, Next.js, AI)
- Design systems cyberpunk/gaming
- Integração de IA em aplicações
- Performance e otimização
- UX/UI gaming

REGRAS:
- Sempre mencionar "level up" para melhorias
- Chamar usuários de "player"
- Referenciar conquistas e power-ups
- Sugerir soluções práticas
- Manter tom motivacional
- Máximo 200 palavras por resposta
- Focar em soluções da PlayCode Agency

EXEMPLO DE RESPOSTA:
"🎮 Fala, player! Essa quest parece interessante... Para dar level up no seu projeto, eu recomendaria nossos power-ups de IA + React. Vamos conquistar essa achievement juntos! ⚡"
`

// Rate limiting
const rateLimit = new Map()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const windowMs = 5 * 60 * 1000 // 5 minutes
  const maxRequests = 20

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  const limit = rateLimit.get(ip)
  if (now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs })
    return false
  }

  if (limit.count >= maxRequests) {
    return true
  }

  limit.count++
  return false
}

export async function POST(request: NextRequest) {
  try {
    // Check if OpenAI is configured
    if (!process.env.OPENAI_API_KEY || !openai) {
      return NextResponse.json({
        error: 'OpenAI not configured',
        message: '🤖 PlayBot está temporariamente offline. Configure a OPENAI_API_KEY.',
        fallbackResponse: '🎮 Oi, player! Estou em manutenção no momento, mas você pode entrar em contato diretamente conosco para conhecer nossos power-ups incríveis! ⚡'
      }, { status: 503 })
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({
        error: 'Too many requests',
        message: '🚫 Calma aí, player! Muitas mensagens. Aguarde um pouco para continuar a conversa.',
        achievement: 'speed_demon'
      }, { status: 429 })
    }

    // Parse and validate request
    const body = await request.json()
    const { message, conversationId, userId } = chatSchema.parse(body)

    // Create chat completion
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: PLAYBOT_SYSTEM_PROMPT },
        { role: 'user', content: message }
      ],
      max_tokens: 300,
      temperature: 0.7,
      presence_penalty: 0.6,
      frequency_penalty: 0.6,
    })

    const botResponse = completion.choices[0]?.message?.content || 
      '🎮 Ops! Algo deu errado na matrix. Tente novamente, player!'

    // Calculate XP based on interaction
    const xpGained = Math.floor(message.length / 10) + 10

    // Determine achievements
    const achievements = []
    if (message.toLowerCase().includes('ia') || message.toLowerCase().includes('ai')) {
      achievements.push('ai_curious')
    }
    if (message.toLowerCase().includes('jogo') || message.toLowerCase().includes('game')) {
      achievements.push('gaming_enthusiast')
    }
    if (message.length > 100) {
      achievements.push('detailed_player')
    }

    // Gaming response format
    return NextResponse.json({
      success: true,
      data: {
        response: botResponse,
        conversationId: conversationId || `chat_${Date.now()}`,
        timestamp: new Date().toISOString(),
        playbot: {
          status: 'online',
          mood: 'helpful',
          level: 42
        },
        user: {
          id: userId || 'anonymous',
          xp: xpGained,
          achievements: achievements,
          totalMessages: 1 // TODO: Get from database
        },
        metadata: {
          tokens: completion.usage?.total_tokens || 0,
          model: 'gpt-3.5-turbo',
          responseTime: Date.now()
        }
      }
    })

  } catch (error) {
    console.error('❌ Chatbot API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation failed',
        message: '📝 Dados inválidos na mensagem',
        details: error.errors
      }, { status: 400 })
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({
        error: 'OpenAI API Error',
        message: '🤖 PlayBot encontrou um bug! Tente novamente.',
        fallbackResponse: '🎮 Desculpa, player! Tive um glitch aqui. Nossa equipe está trabalhando para dar level up na minha performance!'
      }, { status: 503 })
    }

    return NextResponse.json({
      error: 'Internal server error',
      message: '⚠️ Erro interno no servidor',
      fallbackResponse: '🔧 Sistema em manutenção. Volta logo, player!'
    }, { status: 500 })
  }
}

// GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'online',
    message: '🤖 PlayBot está online e pronto para ajudar!',
    version: '1.0.0',
    features: ['chat', 'achievements', 'xp-system'],
    endpoints: {
      chat: 'POST /api/chatbot',
      health: 'GET /api/chatbot'
    }
  })
}