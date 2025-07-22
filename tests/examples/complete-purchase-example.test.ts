/**
 * Exemplo Completo - Teste de Fluxo de Compra
 * Demonstra como usar todos os mocks e helpers
 */

import { test, expect } from '@playwright/test'
import { TestHelpers, TestData } from '../utils/test-helpers'

test.describe('Exemplo Completo - Fluxo de Compra', () => {
  
  test('Pessoa Física compra Starter Pack com Cartão Visa', async ({ page }) => {
    // 1. Setup dos helpers e mocks
    const helpers = new TestHelpers(page)
    await helpers.setupAllMocks()
    
    // 2. Log de requests para debug (opcional)
    await helpers.logConsoleErrors()
    
    // 3. Selecionar plano
    await helpers.selectPlan('starter')
    
    // 4. Verificar que chegou no checkout
    await expect(page.locator('[data-testid="selected-plan-name"]')).toContainText('Starter Pack')
    await expect(page.locator('[data-testid="selected-plan-price"]')).toContainText('R$ 797')
    
    // 5. Preencher dados do cliente
    await helpers.fillCustomerData(TestData.customers.pessoaFisica)
    
    // 6. Preencher dados do cartão
    await helpers.fillCreditCardData({
      ...TestData.cards.visa,
      cvv: '123',
      expiry: '12/25',
      name: TestData.customers.pessoaFisica.name
    })
    
    // 7. Confirmar compra
    await page.click('[data-testid="confirm-purchase"]')
    
    // 8. Aguardar processamento
    await helpers.waitForProcessing()
    
    // 9. Verificar aprovação
    await helpers.verifyPaymentApproved()
    
    // 10. Verificar dados da confirmação
    const transactionId = await helpers.getTransactionId()
    expect(transactionId).toBeTruthy()
    
    await expect(page.locator('[data-testid="customer-name-confirmation"]'))
      .toContainText(TestData.customers.pessoaFisica.name)
    
    // 11. Verificar que emails foram enviados
    await helpers.verifyEmailSent('confirmation', TestData.customers.pessoaFisica.email)
    await helpers.verifyEmailSent('welcome', TestData.customers.pessoaFisica.email)
    
    // 12. Verificar que WhatsApp foi enviado
    await helpers.verifyWhatsAppSent('purchase_confirmation', TestData.customers.pessoaFisica.phone)
    
    // 13. Verificar redirecionamento para sucesso
    await expect(page).toHaveURL(/\/checkout\/sucesso/)
    
    // 14. Screenshot para documentação
    await helpers.takeScreenshot('purchase-success-starter-visa')
    
    // 15. Cleanup
    await helpers.cleanup()
  })

  test('Pessoa Jurídica compra Pro Guild com PIX', async ({ page }) => {
    const helpers = new TestHelpers(page)
    await helpers.setupAllMocks()
    
    // Selecionar plano Pro
    await helpers.selectPlan('pro')
    
    // Dados PJ
    await helpers.fillCustomerData(TestData.customers.pessoaJuridica)
    
    // Selecionar PIX
    await page.click('[data-testid="payment-method-pix"]')
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar geração do PIX
    await helpers.verifyPixGenerated()
    
    // Verificar valor
    await expect(page.locator('[data-testid="pix-amount"]')).toContainText('R$ 2.497')
    
    // Simular pagamento PIX
    const transactionId = await helpers.getTransactionId()
    await helpers.simulatePixPayment(transactionId!)
    
    // Verificar aprovação
    await helpers.verifyPaymentApproved()
    
    // Verificar comunicações
    await helpers.verifyEmailSent('confirmation', TestData.customers.pessoaJuridica.email)
    await helpers.verifyWhatsAppSent('purchase_confirmation', TestData.customers.pessoaJuridica.phone)
    
    await helpers.cleanup()
  })

  test('Cenário de Erro - Cartão Recusado com Recuperação', async ({ page }) => {
    const helpers = new TestHelpers(page)
    await helpers.setupAllMocks()
    
    await helpers.goToCheckout()
    
    // Dados básicos
    await helpers.fillCustomerData(TestData.customers.pessoaFisica)
    
    // Cartão que será recusado
    await helpers.fillCreditCardData({
      ...TestData.cards.declined,
      cvv: '123',
      expiry: '12/25',
      name: TestData.customers.pessoaFisica.name
    })
    
    // Tentar processar
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar erro
    await helpers.verifyPaymentFailed('Cartão recusado')
    
    // Tentar novamente com cartão válido
    await page.click('[data-testid="try-again"]')
    await page.fill('[data-testid="card-number"]', TestData.cards.visa.number)
    await page.click('[data-testid="confirm-purchase"]')
    
    // Verificar sucesso na segunda tentativa
    await helpers.verifyPaymentApproved()
    await expect(page.locator('[data-testid="retry-success"]')).toBeVisible()
    
    await helpers.cleanup()
  })

  test('Teste de Performance - Múltiplas Compras Simultâneas', async ({ browser }) => {
    // Criar múltiplos contextos para simular usuários diferentes
    const contexts = await Promise.all([
      browser.newContext(),
      browser.newContext(),
      browser.newContext()
    ])
    
    const pages = await Promise.all(contexts.map(context => context.newPage()))
    
    // Executar compras simultâneas
    const purchases = pages.map(async (page, index) => {
      const helpers = new TestHelpers(page)
      await helpers.setupAllMocks()
      
      // Cada usuário compra um plano diferente
      const plan = index % 2 === 0 ? 'starter' : 'pro'
      await helpers.selectPlan(plan)
      
      // Dados únicos para cada usuário
      const customer = {
        ...TestData.customers.pessoaFisica,
        name: `Cliente ${index + 1}`,
        email: `cliente${index + 1}@test.com`,
        phone: `1199999999${index}`
      }
      
      await helpers.fillCustomerData(customer)
      await helpers.fillCreditCardData({
        ...TestData.cards.visa,
        cvv: '123',
        expiry: '12/25',
        name: customer.name
      })
      
      await page.click('[data-testid="confirm-purchase"]')
      await helpers.verifyPaymentApproved()
      
      return { index, customer, plan, page }
    })
    
    // Aguardar todas as compras
    const results = await Promise.all(purchases)
    
    // Verificar que todas foram bem-sucedidas
    expect(results).toHaveLength(3)
    
    for (const result of results) {
      await expect(result.page.locator('[data-testid="payment-approved"]')).toBeVisible()
    }
    
    // Cleanup
    await Promise.all(contexts.map(context => context.close()))
  })

  test('Teste Completo com Falhas e Recuperação de APIs', async ({ page }) => {
    const helpers = new TestHelpers(page)
    await helpers.setupAllMocks()
    
    await helpers.selectPlan('starter')
    await helpers.fillCustomerData(TestData.customers.pessoaFisica)
    await helpers.fillCreditCardData(TestData.cards.visa)
    
    // Simular falha no email primeiro
    await helpers.emailMock.simulateEmailFailure()
    
    await page.click('[data-testid="confirm-purchase"]')
    
    // Pagamento deve ser aprovado mesmo com falha no email
    await helpers.verifyPaymentApproved()
    
    // Deve mostrar aviso sobre falha no email
    await expect(page.locator('[data-testid="email-warning"]')).toBeVisible()
    
    // Deve ter tentativa de reenvio
    await page.click('[data-testid="resend-email"]')
    
    // Remover mock de falha e tentar novamente
    await helpers.emailMock.setupMocks()
    await page.click('[data-testid="resend-email"]')
    
    // Verificar que email foi enviado na segunda tentativa
    await expect(page.locator('[data-testid="email-sent"]')).toBeVisible()
    
    await helpers.cleanup()
  })
})