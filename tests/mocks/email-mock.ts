/**
 * Mocks para Sistema de Email
 * Simula envio de emails para testes
 */

import { Page, Route } from '@playwright/test'

export class EmailMock {
  private page: Page
  private sentEmails: any[] = []

  constructor(page: Page) {
    this.page = page
  }

  async setupMocks() {
    // Mock para envio de email de confirmação
    await this.page.route('**/api/email/send-confirmation', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      // Armazenar email "enviado" para verificação
      this.sentEmails.push({
        type: 'confirmation',
        to: postData.to,
        subject: postData.subject,
        template: postData.template,
        data: postData.data,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-email-' + Date.now(),
        recipient: postData.to,
        template: postData.template
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para email de boas-vindas
    await this.page.route('**/api/email/send-welcome', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentEmails.push({
        type: 'welcome',
        to: postData.to,
        customerName: postData.customerName,
        planName: postData.planName,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-welcome-' + Date.now(),
        recipient: postData.to
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para email de boleto
    await this.page.route('**/api/email/send-boleto', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentEmails.push({
        type: 'boleto',
        to: postData.to,
        boletoUrl: postData.boletoUrl,
        dueDate: postData.dueDate,
        amount: postData.amount,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-boleto-' + Date.now(),
        recipient: postData.to,
        attachments: ['boleto.pdf']
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para email de onboarding
    await this.page.route('**/api/email/send-onboarding', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentEmails.push({
        type: 'onboarding',
        to: postData.to,
        onboardingUrl: postData.onboardingUrl,
        customerName: postData.customerName,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        messageId: 'mock-onboarding-' + Date.now(),
        recipient: postData.to
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para newsletter/marketing
    await this.page.route('**/api/email/subscribe-newsletter', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      this.sentEmails.push({
        type: 'newsletter_subscription',
        email: postData.email,
        preferences: postData.preferences,
        timestamp: new Date().toISOString()
      })

      const response = {
        success: true,
        subscribed: true,
        email: postData.email
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  // Métodos para verificar emails enviados
  getEmailsSent(): any[] {
    return this.sentEmails
  }

  getEmailsByType(type: string): any[] {
    return this.sentEmails.filter(email => email.type === type)
  }

  getEmailsByRecipient(recipient: string): any[] {
    return this.sentEmails.filter(email => 
      email.to === recipient || email.email === recipient
    )
  }

  getLastEmail(): any | null {
    return this.sentEmails.length > 0 ? 
      this.sentEmails[this.sentEmails.length - 1] : null
  }

  clearEmailHistory(): void {
    this.sentEmails = []
  }

  // Simular falha no envio de email
  async simulateEmailFailure() {
    await this.page.route('**/api/email/**', async (route: Route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          error: 'Falha no servidor de email',
          errorCode: 'EMAIL_SERVER_ERROR'
        })
      })
    })
  }

  // Simular delay no envio
  async simulateEmailDelay(delayMs: number = 5000) {
    await this.page.route('**/api/email/**', async (route: Route) => {
      setTimeout(async () => {
        await route.continue()
      }, delayMs)
    })
  }
}