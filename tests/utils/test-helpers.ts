/**
 * Utilitários e Helpers para Testes
 * Funções auxiliares reutilizáveis
 */

import { Page, expect } from '@playwright/test'
import { PagSeguroMock } from '../mocks/pagseguro-mock'
import { EmailMock } from '../mocks/email-mock'
import { WhatsAppMock } from '../mocks/whatsapp-mock'

export class TestHelpers {
  private page: Page
  private pagSeguroMock: PagSeguroMock
  private emailMock: EmailMock
  private whatsAppMock: WhatsAppMock

  constructor(page: Page) {
    this.page = page
    this.pagSeguroMock = new PagSeguroMock(page)
    this.emailMock = new EmailMock(page)
    this.whatsAppMock = new WhatsAppMock(page)
  }

  async setupAllMocks() {
    await this.pagSeguroMock.setupMocks()
    await this.emailMock.setupMocks()
    await this.whatsAppMock.setupMocks()
  }

  // Helpers para preenchimento de formulários
  async fillCustomerData(customerData: any) {
    if (customerData.type) {
      await this.page.selectOption('[data-testid="customer-type"]', customerData.type)
    }
    
    await this.page.fill('[data-testid="customer-name"]', customerData.name)
    await this.page.fill('[data-testid="customer-email"]', customerData.email)
    await this.page.fill('[data-testid="customer-phone"]', customerData.phone)
    
    if (customerData.cpf) {
      await this.page.fill('[data-testid="customer-cpf"]', customerData.cpf)
    }
    
    if (customerData.cnpj) {
      await this.page.fill('[data-testid="customer-cnpj"]', customerData.cnpj)
    }
    
    if (customerData.company) {
      await this.page.fill('[data-testid="company-name"]', customerData.company)
    }
  }

  async fillCreditCardData(cardData: any) {
    await this.page.click('[data-testid="payment-method-card"]')
    await this.page.fill('[data-testid="card-number"]', cardData.number)
    await this.page.fill('[data-testid="card-cvv"]', cardData.cvv || '123')
    await this.page.fill('[data-testid="card-expiry"]', cardData.expiry || '12/25')
    await this.page.fill('[data-testid="card-name"]', cardData.name || 'Teste Usuario')
    
    if (cardData.installments) {
      await this.page.selectOption('[data-testid="installments"]', cardData.installments.toString())
    }
  }

  async selectPlan(planType: 'starter' | 'pro') {
    await this.page.goto('/planos')
    
    const planSelector = planType === 'starter' 
      ? '[data-testid="plano-starter"] .gaming-button'
      : '[data-testid="plano-pro-guild"] .gaming-button'
    
    await this.page.click(planSelector)
    await expect(this.page).toHaveURL(/\/checkout/)
  }

  // Helpers para verificações
  async verifyPaymentApproved() {
    await this.page.waitForSelector('[data-testid="payment-approved"]', { timeout: 30000 })
    await expect(this.page.locator('[data-testid="payment-approved"]')).toBeVisible()
    await expect(this.page.locator('[data-testid="success-message"]')).toContainText('Pagamento aprovado')
  }

  async verifyPaymentFailed(expectedError?: string) {
    await this.page.waitForSelector('[data-testid="payment-error"]')
    await expect(this.page.locator('[data-testid="payment-error"]')).toBeVisible()
    
    if (expectedError) {
      await expect(this.page.locator('[data-testid="error-message"]')).toContainText(expectedError)
    }
  }

  async verifyPixGenerated() {
    await this.page.waitForSelector('[data-testid="pix-qrcode"]')
    await expect(this.page.locator('[data-testid="pix-qrcode"]')).toBeVisible()
    await expect(this.page.locator('[data-testid="pix-copy-paste"]')).toBeVisible()
    await expect(this.page.locator('[data-testid="pix-expiry"]')).toBeVisible()
  }

  async verifyBoletoGenerated() {
    await this.page.waitForSelector('[data-testid="boleto-generated"]')
    await expect(this.page.locator('[data-testid="boleto-barcode"]')).toBeVisible()
    await expect(this.page.locator('[data-testid="boleto-due-date"]')).toBeVisible()
    await expect(this.page.locator('[data-testid="download-boleto"]')).toBeVisible()
  }

  async verifyEmailSent(type: string, recipient: string) {
    const emails = this.emailMock.getEmailsByType(type)
    const recipientEmails = emails.filter(email => 
      email.to === recipient || email.email === recipient
    )
    
    expect(recipientEmails.length).toBeGreaterThan(0)
  }

  async verifyWhatsAppSent(type: string, phone: string) {
    const messages = this.whatsAppMock.getMessagesByType(type)
    const phoneMessages = messages.filter(msg => msg.to === phone)
    
    expect(phoneMessages.length).toBeGreaterThan(0)
  }

  // Helpers para navegação
  async goToCheckout() {
    await this.page.goto('/checkout')
  }

  async goToPlans() {
    await this.page.goto('/planos')
  }

  async goToSuccess() {
    await this.page.goto('/checkout/sucesso')
  }

  // Helpers para esperas e timeouts
  async waitForProcessing() {
    await this.page.waitForSelector('[data-testid="payment-processing"]')
    await expect(this.page.locator('[data-testid="payment-processing"]')).toBeVisible()
  }

  async waitForElement(selector: string, timeout: number = 10000) {
    await this.page.waitForSelector(selector, { timeout })
  }

  // Helpers para simulação de eventos
  async simulatePixPayment(transactionId?: string) {
    const txId = transactionId || await this.page.getAttribute('[data-testid="transaction-id"]', 'data-value')
    if (txId) {
      await this.pagSeguroMock.simulatePixPayment(txId)
    }
  }

  async simulateBoletoPayment(transactionId?: string) {
    const txId = transactionId || await this.page.getAttribute('[data-testid="transaction-id"]', 'data-value')
    if (txId) {
      await this.pagSeguroMock.simulateBoletoPayment(txId)
    }
  }

  // Helpers para captura de dados
  async getTransactionId(): Promise<string | null> {
    return await this.page.getAttribute('[data-testid="transaction-id"]', 'data-value')
  }

  async getOrderTotal(): Promise<string | null> {
    return await this.page.textContent('[data-testid="order-total"]')
  }

  async getSelectedPlan(): Promise<string | null> {
    return await this.page.textContent('[data-testid="selected-plan-name"]')
  }

  // Helpers para debug
  async takeScreenshot(name: string) {
    await this.page.screenshot({ 
      path: `test-results/screenshots/${name}-${Date.now()}.png`,
      fullPage: true 
    })
  }

  async logConsoleErrors() {
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console Error:', msg.text())
      }
    })
  }

  async logNetworkRequests() {
    this.page.on('request', request => {
      console.log('Request:', request.method(), request.url())
    })
    
    this.page.on('response', response => {
      console.log('Response:', response.status(), response.url())
    })
  }

  // Cleanup
  async cleanup() {
    this.emailMock.clearEmailHistory()
    this.whatsAppMock.clearMessageHistory()
  }
}

// Dados de teste padronizados
export const TestData = {
  customers: {
    pessoaFisica: {
      name: 'João Silva',
      email: 'joao.silva@test.com',
      phone: '11999999999',
      cpf: '123.456.789-01',
      type: 'pessoa_fisica'
    },
    pessoaJuridica: {
      name: 'Maria Santos',
      email: 'contato@empresa.test',
      phone: '11888888888',
      cnpj: '12.345.678/0001-90',
      company: 'Empresa Test LTDA',
      type: 'pessoa_juridica'
    }
  },
  
  cards: {
    visa: { number: '4111111111111111', brand: 'visa' },
    mastercard: { number: '5555555555554444', brand: 'mastercard' },
    declined: { number: '4000000000000002', brand: 'visa' },
    insufficient: { number: '4000000000000119', brand: 'visa' }
  },
  
  plans: {
    starter: { id: 'starter', price: 797, name: 'Starter Pack' },
    pro: { id: 'pro-guild', price: 2497, name: 'Pro Guild' }
  }
}