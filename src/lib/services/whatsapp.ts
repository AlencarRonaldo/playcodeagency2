interface WhatsAppWelcomeData {
  to: string;
  customerName: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  onboardingUrl: string;
}

interface WhatsAppFollowUpData {
  to: string;
  customerName: string;
  serviceType: string;
  onboardingUrl: string;
  daysElapsed: number;
}

export class WhatsAppService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || '';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
  }

  async sendWelcomeMessage(data: WhatsAppWelcomeData): Promise<void> {
    const serviceNames = {
      website: 'Website/Landing Page',
      ecommerce: 'E-commerce',
      mobile: 'App Mobile',
      marketing: 'Marketing Digital',
      automation: 'Automação'
    };

    const serviceEmojis = {
      website: '🌐',
      ecommerce: '🛒',
      mobile: '📱',
      marketing: '📊',
      automation: '⚡'
    };

    const message = this.generateWelcomeMessage({
      customerName: data.customerName,
      serviceName: serviceNames[data.serviceType],
      serviceEmoji: serviceEmojis[data.serviceType],
      onboardingUrl: data.onboardingUrl
    });

    await this.sendMessage(data.to, message);
  }

  async sendFollowUpMessage(data: WhatsAppFollowUpData): Promise<void> {
    const urgencyLevel = data.daysElapsed >= 5 ? 'high' : data.daysElapsed >= 3 ? 'medium' : 'low';
    const message = this.generateFollowUpMessage({
      customerName: data.customerName,
      serviceType: data.serviceType,
      onboardingUrl: data.onboardingUrl,
      urgencyLevel,
      daysElapsed: data.daysElapsed
    });

    await this.sendMessage(data.to, message);
  }

  private async sendMessage(to: string, message: string): Promise<void> {
    try {
      // Example using WhatsApp Business API or third-party service
      const response = await fetch(`${this.apiUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/\D/g, ''), // Remove non-digits
          type: 'text',
          text: {
            body: message
          }
        })
      });

      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${response.statusText}`);
      }

      console.log('WhatsApp message sent successfully to:', to);
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      // Don't throw error to avoid breaking the webhook flow
    }
  }

  private generateWelcomeMessage(data: {
    customerName: string;
    serviceName: string;
    serviceEmoji: string;
    onboardingUrl: string;
  }): string {
    return `🎮 *Bem-vindo à PlayCode Agency!*

Olá, *${data.customerName}*! 🚀

Seu pagamento foi confirmado e estamos prontos para começar seu projeto ${data.serviceEmoji} *${data.serviceName}*!

🎯 *Próximos passos:*
1️⃣ Complete o formulário de onboarding (5-10 min)
2️⃣ Nossa equipe analisará suas informações
3️⃣ Agendaremos uma reunião de kickoff
4️⃣ Começaremos o desenvolvimento

👇 *Clique aqui para iniciar:*
${data.onboardingUrl}

⚡ *Importante:* Complete em até 7 dias para garantir o início imediato do projeto.

Dúvidas? Responda aqui mesmo! 💬

*Team PlayCode Agency* 🎮
_Onde a tecnologia encontra a criatividade_`;
  }

  private generateFollowUpMessage(data: {
    customerName: string;
    serviceType: string;
    onboardingUrl: string;
    urgencyLevel: 'low' | 'medium' | 'high';
    daysElapsed: number;
  }): string {
    const urgencyMessages = {
      low: {
        emoji: '🎮',
        title: 'Que tal continuarmos?',
        message: `Notamos que você ainda não finalizou o onboarding do seu projeto *${data.serviceType}*.`
      },
      medium: {
        emoji: '⚡',
        title: 'Seu projeto está esperando!',
        message: `Já se passaram ${data.daysElapsed} dias. Vamos acelerar seu projeto *${data.serviceType}*?`
      },
      high: {
        emoji: '🚨',
        title: 'Últimos dias!',
        message: `⏰ Restam poucos dias para completar seu onboarding. Não perca a oportunidade de ter seu *${data.serviceType}* em produção!`
      }
    };

    const msg = urgencyMessages[data.urgencyLevel];

    return `${msg.emoji} *${msg.title}*

Olá, *${data.customerName}*!

${msg.message}

O formulário leva apenas 5-10 minutos e é essencial para começarmos da forma certa! 🎯

👇 *Continue aqui:*
${data.onboardingUrl}

Precisa de ajuda? Estamos aqui! 💬

*Team PlayCode Agency* 🎮`;
  }

  // Utility method for formatting phone numbers
  static formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Add country code if missing (assuming Brazil +55)
    if (cleaned.length === 11 && !cleaned.startsWith('55')) {
      return `55${cleaned}`;
    }
    
    return cleaned;
  }

  // Method to validate phone number format
  static isValidPhoneNumber(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }
}