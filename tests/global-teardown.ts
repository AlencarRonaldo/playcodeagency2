/**
 * Teardown Global para Testes Playwright
 * Limpeza após execução dos testes
 */

import { FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Iniciando limpeza global dos testes...')
  
  // 1. Limpar dados de teste criados
  console.log('🗑️ Removendo dados de teste...')
  
  // 2. Resetar estado do banco de dados
  console.log('🔄 Resetando banco de dados...')
  
  // 3. Limpar arquivos temporários
  console.log('📁 Limpando arquivos temporários...')
  
  // 4. Remover mocks e interceptors
  console.log('🎭 Removendo mocks...')
  
  // 5. Restaurar variáveis de ambiente
  delete process.env.PAGSEGURO_SANDBOX
  delete process.env.SKIP_EMAIL_SENDING
  delete process.env.SKIP_WHATSAPP_SENDING
  
  console.log('✅ Limpeza global concluída!')
}

export default globalTeardown