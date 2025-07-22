/**
 * Cenários Específicos de Teste - Fluxo de Compra Avançado
 * Testes detalhados para casos complexos e edge cases
 */

import { test, expect } from '@playwright/test'

// Configuração de dados para diferentes cenários
const scenarios = {
  planos: {
    starter: {
      name: 'Starter Pack',
      price: 797,
      testId: 'plano-starter',
      features: ['React/Next.js', 'Design Responsivo', 'SEO Básico']
    },
    pro: {
      name: 'Pro Guild',
      price: 2497,
      testId: 'plano-pro-guild',
      features: ['IA Integration', 'E-commerce', 'Analytics Avançado']
    }
  },
  customers: {
    pf: {
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '11999999999',
      cpf: '123.456.789-01',
      type: 'pessoa_fisica'
    },
    pj: {
      name: 'Maria Santos',
      email: 'contato@empresa.com',
      phone: '11888888888',
      cnpj: '12.345.678/0001-90',
      company: 'Tech Solutions LTDA',
      type: 'pessoa_juridica'
    },
    internacional: {
      name: 'John Smith',
      email: 'john@company.com',
      phone: '+1-555-123-4567',
      country: 'US',
      type: 'internacional'
    }
  },
  payments: {
    creditCard: {
      visa: { number: '4111111111111111', brand: 'visa' },
      mastercard: { number: '5555555555554444', brand: 'mastercard' },
      amex: { number: '378282246310005', brand: 'amex' },
      declined: { number: '4000000000000002', brand: 'visa' },
      insufficient: { number: '4000000000000119', brand: 'visa' }
    },
    pix: {
      email: 'pix@email.com',
      cpf: '123.456.789-01',
      phone: '11999999999'
    },
    boleto: {
      valid: true,
      expiry: 3 // dias
    }
  }
}

test.describe('Cenários Específicos - Tipos de Cliente', () => {
  
  test('Pessoa Física - Compra Starter Pack com Cartão', async ({ page }) => {
    const customer = scenarios.customers.pf
    const plano = scenarios.planos.starter
    
    await page.goto('/planos')
    
    // Selecionar plano
    await page.click(`[data-testid="${plano.testId}"] .gaming-button`)
    await expect(page).toHaveURL(/\/checkout/)
    
    // Verificar detalhes do plano selecionado
    await expect(page.locator('[data-testid="selected-plan-name"]')).toContainText(plano.name)
    await expect(page.locator('[data-testid="selected-plan-price"]')).toContainText(`R$ ${plano.price}`)
    
    // Preencher dados PF
    await page.selectOption('[data-testid="customer-type"]', customer.type)
    await page.fill('[data-testid="customer-name"]', customer.name)
    await page.fill('[data-testid="customer-email"]', customer.email)
    await page.fill('[data-testid="customer-phone"]', customer.phone)
    await page.fill('[data-testid="customer-cpf"]', customer.cpf)
    
    // Validar formato CPF
    await expect(page.locator('[data-testid="cpf-valid"]')).toBeVisible()
    
    // Pagamento com Visa
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.visa.number)
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    await page.fill('[data-testid="card-name"]', customer.name)
    
    // Confirmar compra
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar processamento
    await page.waitForSelector('[data-testid="payment-processing"]')
    await expect(page.locator('[data-testid="processing-message"]')).toContainText('Processando pagamento')
    
    // Verificar aprovação
    await page.waitForSelector('[data-testid="payment-approved"]', { timeout: 30000 })
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Pagamento aprovado')
    
    // Verificar dados da confirmação
    await expect(page.locator('[data-testid="customer-name-confirmation"]')).toContainText(customer.name)
    await expect(page.locator('[data-testid="plan-confirmation"]')).toContainText(plano.name)
    await expect(page.locator('[data-testid="amount-confirmation"]')).toContainText(`R$ ${plano.price}`)
  })

  test('Pessoa Jurídica - Compra Pro Guild com PIX', async ({ page }) => {
    const customer = scenarios.customers.pj
    const plano = scenarios.planos.pro
    
    await page.goto('/planos')
    await page.click(`[data-testid="${plano.testId}"] .gaming-button`)
    
    // Dados PJ
    await page.selectOption('[data-testid="customer-type"]', customer.type)
    await page.fill('[data-testid="customer-name"]', customer.name)
    await page.fill('[data-testid="customer-email"]', customer.email)
    await page.fill('[data-testid="customer-phone"]', customer.phone)
    await page.fill('[data-testid="customer-cnpj"]', customer.cnpj)
    await page.fill('[data-testid="company-name"]', customer.company)
    
    // Validar CNPJ
    await expect(page.locator('[data-testid="cnpj-valid"]')).toBeVisible()
    
    // PIX
    await page.click('[data-testid="payment-method-pix"]')
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar QR Code PIX
    await page.waitForSelector('[data-testid="pix-qrcode"]')
    await expect(page.locator('[data-testid="pix-amount"]')).toContainText(`R$ ${plano.price}`)
    await expect(page.locator('[data-testid="pix-expiry"]')).toBeVisible()
    
    // Copiar código PIX
    await page.click('[data-testid="pix-copy-button"]')
    await expect(page.locator('[data-testid="pix-copied"]')).toContainText('Código copiado')
    
    // Simular pagamento PIX via webhook
    await page.evaluate(async () => {
      await fetch('/api/webhooks/pagseguro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationType: 'transaction',
          notificationCode: 'pix-test-approved',
          status: 'paid'
        })
      })
    })
    
    // Verificar confirmação
    await page.waitForSelector('[data-testid="payment-approved"]', { timeout: 60000 })
    await expect(page.locator('[data-testid="company-confirmation"]')).toContainText(customer.company)
  })

  test('Cliente Internacional - Limitações e Adaptações', async ({ page }) => {
    const customer = scenarios.customers.internacional
    
    await page.goto('/checkout')
    
    // Selecionar país
    await page.selectOption('[data-testid="customer-country"]', customer.country)
    
    // Verificar adaptações para cliente internacional
    await expect(page.locator('[data-testid="international-notice"]')).toBeVisible()
    await expect(page.locator('[data-testid="payment-method-pix"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="payment-method-boleto"]')).not.toBeVisible()
    
    // Apenas cartão disponível
    await expect(page.locator('[data-testid="payment-method-card"]')).toBeVisible()
    
    // Campos adaptados
    await expect(page.locator('[data-testid="customer-cpf"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="customer-cnpj"]')).not.toBeVisible()
    await expect(page.locator('[data-testid="customer-tax-id"]')).toBeVisible()
  })
})

test.describe('Cenários de Pagamento Específicos', () => {
  
  test('Cartão Mastercard com Parcelamento', async ({ page }) => {
    await page.goto('/checkout')
    
    // Dados básicos
    await page.fill('[data-testid="customer-name"]', 'Ana Costa')
    await page.fill('[data-testid="customer-email"]', 'ana@email.com')
    
    // Mastercard
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.mastercard.number)
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    // Selecionar parcelamento
    await page.selectOption('[data-testid="installments"]', '3')
    await expect(page.locator('[data-testid="installment-amount"]')).toContainText('3x de R$')
    
    await page.click('[data-testid="confirm-purchase"]')
    await page.waitForSelector('[data-testid="payment-approved"]')
    
    // Verificar detalhes do parcelamento
    await expect(page.locator('[data-testid="installment-details"]')).toContainText('3 parcelas')
  })

  test('American Express - Taxa Diferenciada', async ({ page }) => {
    await page.goto('/checkout')
    
    await page.fill('[data-testid="customer-name"]', 'Carlos Lima')
    await page.fill('[data-testid="customer-email"]', 'carlos@email.com')
    
    // Amex
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.amex.number)
    await page.fill('[data-testid="card-cvv"]', '1234') // Amex tem 4 dígitos
    
    // Verificar taxa adicional
    await expect(page.locator('[data-testid="amex-fee-notice"]')).toBeVisible()
    await expect(page.locator('[data-testid="total-with-fee"]')).toBeVisible()
    
    await page.click('[data-testid="confirm-purchase"]')
    await page.waitForSelector('[data-testid="payment-approved"]')
  })

  test('Boleto Bancário - Vencimento e Instruções', async ({ page }) => {
    await page.goto('/checkout')
    
    await page.fill('[data-testid="customer-name"]', 'Roberto Santos')
    await page.fill('[data-testid="customer-email"]', 'roberto@email.com')
    await page.fill('[data-testid="customer-cpf"]', '123.456.789-01')
    
    // Boleto
    await page.click('[data-testid="payment-method-boleto"]')
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar geração do boleto
    await page.waitForSelector('[data-testid="boleto-generated"]')
    await expect(page.locator('[data-testid="boleto-barcode"]')).toBeVisible()
    await expect(page.locator('[data-testid="boleto-due-date"]')).toContainText('Vencimento:')
    
    // Botões de ação
    await expect(page.locator('[data-testid="download-boleto"]')).toBeVisible()
    await expect(page.locator('[data-testid="email-boleto"]')).toBeVisible()
    await expect(page.locator('[data-testid="whatsapp-boleto"]')).toBeVisible()
    
    // Instruções
    await expect(page.locator('[data-testid="boleto-instructions"]')).toContainText('Como pagar')
  })
})

test.describe('Cenários de Erro e Recuperação', () => {
  
  test('Cartão Recusado - Múltiplas Tentativas', async ({ page }) => {
    await page.goto('/checkout')
    
    // Dados básicos
    await page.fill('[data-testid="customer-name"]', 'Pedro Oliveira')
    await page.fill('[data-testid="customer-email"]', 'pedro@email.com')
    
    // Primeira tentativa - cartão recusado
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.declined.number)
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar erro
    await page.waitForSelector('[data-testid="payment-error"]')
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Cartão recusado')
    await expect(page.locator('[data-testid="error-suggestions"]')).toBeVisible()
    
    // Segunda tentativa - cartão válido
    await page.click('[data-testid="try-again"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.visa.number)
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar sucesso
    await page.waitForSelector('[data-testid="payment-approved"]')
    await expect(page.locator('[data-testid="retry-success"]')).toBeVisible()
  })

  test('Saldo Insuficiente - Sugestão de Alternativas', async ({ page }) => {
    await page.goto('/checkout')
    
    await page.fill('[data-testid="customer-name"]', 'Lucas Silva')
    await page.fill('[data-testid="customer-email"]', 'lucas@email.com')
    
    // Cartão com saldo insuficiente
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.insufficient.number)
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar erro específico
    await page.waitForSelector('[data-testid="insufficient-funds"]')
    await expect(page.locator('[data-testid="alternative-methods"]')).toBeVisible()
    
    // Sugestão para PIX
    await page.click('[data-testid="suggest-pix"]')
    await expect(page.locator('[data-testid="payment-method-pix"]')).toBeChecked()
  })

  test('Timeout de Sessão - Recuperação de Dados', async ({ page }) => {
    await page.goto('/checkout')
    
    // Preencher dados
    await page.fill('[data-testid="customer-name"]', 'Fernanda Costa')
    await page.fill('[data-testid="customer-email"]', 'fernanda@email.com')
    await page.fill('[data-testid="customer-phone"]', '11999999999')
    
    // Simular timeout de sessão
    await page.evaluate(() => {
      localStorage.setItem('checkout_timeout', 'true')
    })
    
    await page.reload()
    
    // Verificar recuperação de dados
    await expect(page.locator('[data-testid="session-recovered"]')).toBeVisible()
    await expect(page.locator('[data-testid="customer-name"]')).toHaveValue('Fernanda Costa')
    await expect(page.locator('[data-testid="customer-email"]')).toHaveValue('fernanda@email.com')
  })
})

test.describe('Integrações e Webhooks Avançados', () => {
  
  test('Webhook de Aprovação - Processamento Automático', async ({ page, request }) => {
    // Criar transação
    await page.goto('/checkout')
    await page.fill('[data-testid="customer-name"]', 'Marina Santos')
    await page.fill('[data-testid="customer-email"]', 'marina@email.com')
    await page.click('[data-testid="payment-method-card"]')
    await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.visa.number)
    await page.fill('[data-testid="card-cvv"]', '123')
    await page.fill('[data-testid="card-expiry"]', '12/25')
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Obter ID da transação
    const transactionId = await page.getAttribute('[data-testid="transaction-id"]', 'data-value')
    
    // Simular webhook de aprovação
    const webhookResponse = await request.post('/api/webhooks/pagseguro', {
      data: {
        notificationType: 'transaction',
        notificationCode: transactionId,
        status: 'approved',
        grossAmount: '797.00',
        paymentMethodType: 'creditCard'
      }
    })
    
    expect(webhookResponse.status()).toBe(200)
    
    // Verificar processamento automático
    await page.reload()
    await expect(page.locator('[data-testid="webhook-processed"]')).toBeVisible()
    await expect(page.locator('[data-testid="auto-onboarding-started"]')).toBeVisible()
  })

  test('Webhook de Cancelamento - Limpeza Automática', async ({ page, request }) => {
    // Similar ao anterior, mas testando cancelamento
    await page.goto('/checkout')
    // ... preencher dados ...
    
    const transactionId = await page.getAttribute('[data-testid="transaction-id"]', 'data-value')
    
    // Webhook de cancelamento
    await request.post('/api/webhooks/pagseguro', {
      data: {
        notificationType: 'transaction',
        notificationCode: transactionId,
        status: 'cancelled'
      }
    })
    
    await page.reload()
    await expect(page.locator('[data-testid="transaction-cancelled"]')).toBeVisible()
    await expect(page.locator('[data-testid="cleanup-completed"]')).toBeVisible()
  })
})

test.describe('Performance e Carga', () => {
  
  test('Múltiplas Transações Simultâneas', async ({ browser }) => {
    // Simular múltiplos usuários comprando ao mesmo tempo
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ])
    
    const pages = await Promise.all(contexts.map(context => context.newPage()))
    
    // Executar compras simultâneas
    await Promise.all(pages.map(async (page, index) => {
      await page.goto('/checkout')
      await page.fill('[data-testid="customer-name"]', `Cliente ${index + 1}`)
      await page.fill('[data-testid="customer-email"]', `cliente${index + 1}@email.com`)
      await page.click('[data-testid="payment-method-card"]')
      await page.fill('[data-testid="card-number"]', scenarios.payments.creditCard.visa.number)
      await page.fill('[data-testid="card-cvv"]', '123')
      await page.fill('[data-testid="card-expiry"]', '12/25')
      
      await page.click('[data-testid="confirm-purchase"]')
      await page.waitForSelector('[data-testid="payment-approved"]', { timeout: 30000 })
    }))
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()))
  })
})