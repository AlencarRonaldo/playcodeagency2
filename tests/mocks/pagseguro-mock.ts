/**
 * Mocks para API do PagSeguro
 * Simula respostas para diferentes cenários de teste
 */

import { Page, Route } from '@playwright/test'

export class PagSeguroMock {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  async setupMocks() {
    // Mock para criação de sessão
    await this.page.route('**/api/payment/create-session', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          sessionId: 'mock-session-' + Date.now(),
          paymentUrl: 'https://sandbox.pagseguro.uol.com.br/checkout/payment.html',
          success: true
        })
      })
    })

    // Mock para processamento de cartão
    await this.page.route('**/api/payment/process-card', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')
      
      // Simular diferentes cenários baseado no número do cartão
      const cardNumber = postData.cardNumber
      let response

      if (cardNumber === '4000000000000002') {
        // Cartão recusado
        response = {
          status: 'failed',
          error: 'Cartão recusado pela operadora',
          errorCode: 'CARD_DECLINED',
          transactionId: 'declined-' + Date.now()
        }
      } else if (cardNumber === '4000000000000119') {
        // Saldo insuficiente
        response = {
          status: 'failed',
          error: 'Saldo insuficiente',
          errorCode: 'INSUFFICIENT_FUNDS',
          transactionId: 'insufficient-' + Date.now()
        }
      } else {
        // Cartão aprovado
        response = {
          status: 'approved',
          transactionId: 'approved-' + Date.now(),
          authorizationCode: 'AUTH123456',
          amount: postData.amount,
          installments: postData.installments || 1,
          paymentMethod: 'creditCard',
          brand: this.getCardBrand(cardNumber)
        }
      }

      await route.fulfill({
        status: response.status === 'failed' ? 400 : 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para PIX
    await this.page.route('**/api/payment/process-pix', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      const response = {
        status: 'pending',
        transactionId: 'pix-' + Date.now(),
        qrCode: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        qrCodeText: '00020101021243650016COM.MERCADOLIVRE02013063204C398AB5F1D0C4E5C6905CD28964AC',
        expiryDate: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
        amount: postData.amount
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para boleto
    await this.page.route('**/api/payment/process-boleto', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      const response = {
        status: 'pending',
        transactionId: 'boleto-' + Date.now(),
        boletoUrl: 'https://mock-boleto-url.com/boleto.pdf',
        barCode: '34191790010104351004791020150008291070026000',
        digitalLine: '34191.79001 01043.510047 91020.150008 2 91070026000',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 dias
        amount: postData.amount
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para webhooks
    await this.page.route('**/api/webhooks/pagseguro', async (route: Route) => {
      const request = route.request()
      const postData = JSON.parse(request.postData() || '{}')

      // Simular processamento do webhook
      const response = {
        received: true,
        notificationType: postData.notificationType,
        processed: true,
        timestamp: new Date().toISOString()
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })

    // Mock para consulta de transação
    await this.page.route('**/api/payment/status/**', async (route: Route) => {
      const url = route.request().url()
      const transactionId = url.split('/').pop()

      let status = 'approved'
      if (transactionId?.includes('declined')) {
        status = 'failed'
      } else if (transactionId?.includes('pending')) {
        status = 'pending'
      }

      const response = {
        transactionId,
        status,
        amount: '797.00',
        paymentMethod: transactionId?.includes('pix') ? 'pix' : 'creditCard',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    })
  }

  private getCardBrand(cardNumber: string): string {
    const firstDigit = cardNumber.charAt(0)
    const firstTwoDigits = cardNumber.substring(0, 2)
    const firstFourDigits = cardNumber.substring(0, 4)

    if (firstDigit === '4') {
      return 'visa'
    } else if (['51', '52', '53', '54', '55'].includes(firstTwoDigits)) {
      return 'mastercard'
    } else if (['34', '37'].includes(firstTwoDigits)) {
      return 'amex'
    } else if (firstFourDigits === '6011') {
      return 'discover'
    } else {
      return 'unknown'
    }
  }

  async simulatePixPayment(transactionId: string) {
    // Simular pagamento PIX após alguns segundos
    setTimeout(async () => {
      await this.page.evaluate((txId) => {
        fetch('/api/webhooks/pagseguro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationType: 'transaction',
            notificationCode: txId,
            status: 'paid'
          })
        })
      }, transactionId)
    }, 3000)
  }

  async simulateBoletoPayment(transactionId: string) {
    // Simular pagamento de boleto após alguns segundos
    setTimeout(async () => {
      await this.page.evaluate((txId) => {
        fetch('/api/webhooks/pagseguro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notificationType: 'transaction',
            notificationCode: txId,
            status: 'paid'
          })
        })
      }, transactionId)
    }, 5000)
  }
}