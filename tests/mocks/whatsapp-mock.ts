/**
 * Mocks para WhatsApp API
 * Simula envio de mensagens WhatsApp para testes
 */

import { Page, Route } from '@playwright/test'

export class WhatsAppMock {
  private page: Page
  private sentMessages: any[] = []

  constructor(page: Page) {
    this.page = page
  }

  async setupMocks() {
    // Mock para envio de confirmação de compra via WhatsApp
    await this.page.route('**/api/whatsapp/send-confirmation', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentMessages.push({
        type: 'purchase_confirmation',
        to: postData.phone,
        customerName: postData.customerName,
        planName: postData.planName,
        amount: postData.amount,
        transactionId: postData.transactionId,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-whatsapp-' + Date.now(),
        recipient: postData.phone,
        status: 'sent'
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para envio de boleto via WhatsApp
    await this.page.route('**/api/whatsapp/send-boleto', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentMessages.push({
        type: 'boleto',
        to: postData.phone,
        boletoUrl: postData.boletoUrl,
        digitalLine: postData.digitalLine,
        dueDate: postData.dueDate,
        amount: postData.amount,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-boleto-whatsapp-' + Date.now(),
        recipient: postData.phone,
        attachments: ['boleto.pdf']
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para lembrete de pagamento PIX
    await this.page.route('**/api/whatsapp/send-pix-reminder', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentMessages.push({
        type: 'pix_reminder',
        to: postData.phone,
        qrCodeText: postData.qrCodeText,
        amount: postData.amount,
        expiryTime: postData.expiryTime,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-pix-reminder-' + Date.now(),
        recipient: postData.phone
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para link de onboarding
    await this.page.route('**/api/whatsapp/send-onboarding', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentMessages.push({
        type: 'onboarding',
        to: postData.phone,
        onboardingUrl: postData.onboardingUrl,
        customerName: postData.customerName,
        planName: postData.planName,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-onboarding-whatsapp-' + Date.now(),
        recipient: postData.phone
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para suporte/atendimento
    await this.page.route('**/api/whatsapp/create-support-chat', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentMessages.push({
        type: 'support_chat',
        to: postData.phone,
        customerName: postData.customerName,
        issue: postData.issue,
        priority: postData.priority,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        chatId: 'mock-chat-' + Date.now(),
        supportAgent: 'PlayCode Bot',
        estimatedResponse: '5 minutos'
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para status de entrega de mensagem
    await this.page.route('**/api/whatsapp/message-status/**', async (route: Route) => {
      const url = route.request().url()
      const messageId = url.split('/').pop()

      const response = {
        messageId,
        status: 'delivered',
        deliveredAt: new Date().toISOString(),
        readAt: new Date(Date.now() + 60000).toISOString() // 1 minuto depois
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  // Métodos para verificar mensagens enviadas
  getMessagesSent(): any[] {
    return this.sentMessages
  }

  getMessagesByType(type: string): any[] {
    return this.sentMessages.filter(msg => msg.type === type)
  }

  getMessagesByRecipient(phone: string): any[] {
    return this.sentMessages.filter(msg => msg.to === phone)
  }

  getLastMessage(): any | null {
    return this.sentMessages.length > 0 ? 
      this.sentMessages[this.sentMessages.length - 1] : null
  }

  clearMessageHistory(): void {
    this.sentMessages = []
  }

  // Simular falha no WhatsApp
  async simulateWhatsAppFailure() {
    await this.page.route('**/api/whatsapp/**', async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Falha na API do WhatsApp',
          errorCode: 'WHATSAPP_API_ERROR'
        })
      })
    })
  }

  // Simular número inválido
  async simulateInvalidNumber() {
    await this.page.route('**/api/whatsapp/**', async (route: Route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Número de telefone inválido',
          errorCode: 'INVALID_PHONE_NUMBER'
        })
      })
    })
  }

  // Simular delay na entrega
  async simulateDeliveryDelay(delayMs: number = 3000) {
    await this.page.route('**/api/whatsapp/**', async (route: Route) => {
      setTimeout(async () => {
        await route.continue()
      }, delayMs)
    })
  }

  // Simular resposta do cliente
  async simulateCustomerReply(phone: string, message: string) {
    // Simula uma resposta do cliente após alguns segundos
    setTimeout(async () => {
      await this.page.evaluate(({ phone, message }) => {
        // Simular webhook de mensagem recebida
        fetch('/api/whatsapp/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'message_received',
            from: phone,
            message: message,
            timestamp: new Date().toISOString()
          })
        })
      }, { phone, message })
    }, 2000)
  }
}