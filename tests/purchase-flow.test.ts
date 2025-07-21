/**
 * Testes do Fluxo de Compra - Do Checkout à Aprovação
 * Cobre todo o processo: seleção → pagamento → aprovação → confirmação
 */

import { test, expect } from '@playwright/test'

// Dados de teste para diferentes cenários
const testData = {
  validCard: {
    number: '4111111111111111', // Visa test card
    cvv: '123',
    expiry: '12/25',
    name: 'João Silva'
  },
  validPix: {
    email: 'joao@teste.com',
    cpf: '12345678901'
  },
  customerData: {
    name: 'João Silva',
    email: 'joao@teste.com',
    phone: '11999999999',
    company: 'Empresa Teste LTDA'
  }
}

test.describe('Fluxo de Compra - Aprovação de Pagamento', () => {
  
  // Teste 1: Compra com Cartão de Crédito
  test('deve processar compra com cartão e confirmar aprovação', async ({ page }) => {
    // 1. Navegar para a página de planos
    await page.goto('/planos')
    
    // 2. Selecionar um plano (Pro Guild por exemplo)
    await page.click('[data-testid="plano-pro-guild"] .gaming-button')
    
    // 3. Verificar redirecionamento para checkout
    await expect(page).toHaveURL(/\/checkout/)
    
    // 4. Preencher dados do cliente
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    await page.fill('[data-testid="customer-phone"]', testData.customerData.phone)
    await page.fill('[data-testid="customer-company"]', testData.customerData.company)
    
    // 5. Selecionar pagamento com cartão
    await page.click('[data-testid="payment-method-card"]')
    
    // 6. Preencher dados do cartão
    await page.fill('[data-testid="card-number"]', testData.validCard.number)
    await page.fill('[data-testid="card-cvv"]', testData.validCard.cvv)
    await page.fill('[data-testid="card-expiry"]', testData.validCard.expiry)
    await page.fill('[data-testid="card-name"]', testData.validCard.name)
    
    // 7. Confirmar compra
    await page.click('[data-testid="confirm-purchase"]')
    
    // 8. Aguardar processamento
    await page.waitForSelector('[data-testid="payment-processing"]')
    await expect(page.locator('[data-testid="payment-processing"]')).toBeVisible()
    
    // 9. Verificar aprovação
    await page.waitForSelector('[data-testid="payment-approved"]', { timeout: 30000 })
    await expect(page.locator('[data-testid="payment-approved"]')).toBeVisible()
    
    // 10. Verificar dados da confirmação
    await expect(page.locator('[data-testid="order-id"]')).toBeVisible()
    await expect(page.locator('[data-testid="purchase-amount"]')).toContainText('R$ 2.497')
    
    // 11. Verificar email de confirmação (mock)
    // Aqui você verificaria se o webhook foi chamado e email enviado
    
    // 12. Verificar redirecionamento para página de sucesso
    await expect(page).toHaveURL(/\/checkout\/sucesso/)
  })

  // Teste 2: Compra com PIX
  test('deve processar compra com PIX e confirmar após pagamento', async ({ page }) => {
    await page.goto('/planos')
    
    // Selecionar plano Starter Pack
    await page.click('[data-testid="plano-starter"] .gaming-button')
    
    // Preencher dados
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    await page.fill('[data-testid="customer-phone"]', testData.customerData.phone)
    
    // Selecionar PIX
    await page.click('[data-testid="payment-method-pix"]')
    
    // Confirmar compra
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar QR Code PIX
    await page.waitForSelector('[data-testid="pix-qrcode"]')
    await expect(page.locator('[data-testid="pix-qrcode"]')).toBeVisible()
    await expect(page.locator('[data-testid="pix-copy-paste"]')).toBeVisible()
    
    // Simular pagamento PIX (via webhook mock)
    await page.evaluate(() => {
      // Simular webhook de confirmação PIX
      fetch('/api/webhooks/pagseguro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationType: 'transaction',
          notificationCode: 'test-pix-payment'
        })
      })
    })
    
    // Verificar aprovação
    await page.waitForSelector('[data-testid="payment-approved"]', { timeout: 60000 })
    await expect(page.locator('[data-testid="purchase-amount"]')).toContainText('R$ 797')
  })

  // Teste 3: Falha no Pagamento
  test('deve tratar falha no pagamento adequadamente', async ({ page }) => {
    await page.goto('/checkout')
    
    // Usar cartão que falha (número inválido)
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', '4000000000000002') // Cartão que falha
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar erro
    await page.waitForSelector('[data-testid="payment-error"]')
    await expect(page.locator('[data-testid="payment-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="payment-error"]')).toContainText('Pagamento recusado')
    
    // Verificar que ainda está na página de checkout
    await expect(page).toHaveURL(/\/checkout/)
  })

  // Teste 4: Timeout no Pagamento
  test('deve tratar timeout no pagamento', async ({ page }) => {
    // Configurar timeout mais baixo para teste
    await page.goto('/checkout')
    
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    
    // Simular demora no processamento
    await page.route('**/api/payment/**', route => {
      setTimeout(() => route.continue(), 35000) // Simula timeout
    })
    
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', testData.validCard.number)
    await page.fill('[data-testid="card-cvv"]', testData.validCard.cvv)
    await page.fill('[data-testid="card-expiry"]', testData.validCard.expiry)
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar timeout
    await page.waitForSelector('[data-testid="payment-timeout"]', { timeout: 40000 })
    await expect(page.locator('[data-testid="payment-timeout"]')).toBeVisible()
  })

  // Teste 5: Validação de Campos Obrigatórios
  test('deve validar campos obrigatórios antes do pagamento', async ({ page }) => {
    await page.goto('/checkout')
    
    // Tentar submeter sem preencher dados
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar validação
    await expect(page.locator('[data-testid="error-customer-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-customer-email"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-payment-method"]')).toBeVisible()
  })

  // Teste 6: Cancelamento Durante o Processo
  test('deve permitir cancelar durante o processamento', async ({ page }) => {
    await page.goto('/checkout')
    
    // Preencher dados
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', testData.validCard.number)
    
    // Iniciar processamento
    await page.click('[data-testid="confirm-purchase"]')
    await page.waitForSelector('[data-testid="payment-processing"]')
    
    // Cancelar
    await page.click('[data-testid="cancel-payment"]')
    
    // Verificar cancelamento
    await expect(page.locator('[data-testid="payment-cancelled"]')).toBeVisible()
    await expect(page).toHaveURL(/\/planos/)
  })

  // Teste 7: Verificação de Webhook
  test('deve processar webhook de confirmação corretamente', async ({ page, request }) => {
    // Primeiro, criar uma compra
    await page.goto('/checkout')
    // ... preencher dados e submeter ...
    
    // Obter ID da transação
    const transactionId = await page.getAttribute('[data-testid="transaction-id"]', 'data-value')
    
    // Simular webhook do PagSeguro
    const webhookResponse = await request.post('/api/webhooks/pagseguro', {
      data: {
        notificationType: 'transaction',
        notificationCode: transactionId,
        status: 'approved'
      }
    })
    
    expect(webhookResponse.status()).toBe(200)
    
    // Verificar que o status foi atualizado
    await page.reload()
    await expect(page.locator('[data-testid="payment-status"]')).toContainText('Aprovado')
  })

  // Teste 8: Múltiplas Tentativas de Pagamento
  test('deve permitir múltiplas tentativas após falha', async ({ page }) => {
    await page.goto('/checkout')
    
    // Primeira tentativa (falha)
    await page.fill('[data-testid="customer-name"]', testData.customerData.name)
    await page.fill('[data-testid="customer-email"]', testData.customerData.email)
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', '4000000000000002') // Falha
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    await page.click('[data-testid="confirm-purchase"]')
    await page.waitForSelector('[data-testid="payment-error"]')
    
    // Segunda tentativa (sucesso)
    await page.click('[data-testid="try-again"]')
    await page.fill('[data-testid="card-number"]', testData.validCard.number) // Válido
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar sucesso
    await page.waitForSelector('[data-testid="payment-approved"]')
    await expect(page.locator('[data-testid="payment-approved"]')).toBeVisible()
  })
})

// Testes de Integração com APIs
test.describe('Integração com PagSeguro/APIs', () => {
  
  test('deve conectar com API do PagSeguro corretamente', async ({ request }) => {
    const response = await request.post('/api/payment/create-session', {
      data: {
        amount: 79700, // R$ 797,00
        customer: testData.customerData
      }
    })
    
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data.sessionId).toBeDefined()
    expect(data.paymentUrl).toBeDefined()
  })

  test('deve validar webhook de notificação', async ({ request }) => {
    const response = await request.post('/api/webhooks/pagseguro', {
      data: {
        notificationType: 'transaction',
        notificationCode: 'test-notification-123'
      }
    })
    
    expect(response.status()).toBe(200)
  })
})