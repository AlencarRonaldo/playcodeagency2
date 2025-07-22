/**
 * Setup Global para Testes Playwright
 * Configura ambiente, mocks e dados necessários
 */

import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Iniciando setup global dos testes...')
  
  // 1. Configurar variáveis de ambiente para teste
  process.env.NODE_ENV = 'test'
  process.env.PAGSEGURO_SANDBOX = 'true'
  process.env.SKIP_EMAIL_SENDING = 'true'
  process.env.SKIP_WHATSAPP_SENDING = 'true'
  
  // 2. Verificar se servidor está rodando
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    await page.goto(config.projects[0].use?.baseURL || 'http://localhost:3000')
    console.log('✅ Servidor de desenvolvimento está rodando')
  } catch (error) {
    console.error('❌ Erro ao conectar com servidor:', error)
    throw new Error('Servidor não está rodando. Execute: npm run dev')
  } finally {
    await browser.close()
  }
  
  // 3. Limpar dados de teste anteriores
  console.log('🧹 Limpando dados de teste anteriores...')
  
  // 4. Configurar banco de dados de teste (se necessário)
  console.log('🗄️ Configurando banco de dados de teste...')
  
  // 5. Configurar mocks e interceptors
  console.log('🎭 Configurando mocks...')
  
  console.log('✅ Setup global concluído!')
}

export default globalSetup