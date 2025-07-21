import nodemailer from 'nodemailer';

interface WelcomeEmailData {
  to: string;
  customerName: string;
  serviceType: 'website' | 'ecommerce' | 'mobile' | 'marketing' | 'automation';
  planType: 'starter' | 'pro' | 'enterprise';
  onboardingUrl: string;
}

interface FollowUpEmailData {
  to: string;
  customerName: string;
  serviceType: string;
  onboardingUrl: string;
  daysElapsed: number;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const serviceNames = {
      website: 'Website/Landing Page',
      ecommerce: 'E-commerce',
      mobile: 'Aplicativo Mobile',
      marketing: 'Marketing Digital',
      automation: 'Automação de Processos'
    };

    const planNames = {
      starter: 'Starter Pack',
      pro: 'Pro Guild',
      enterprise: 'Enterprise'
    };

    const template = this.generateWelcomeTemplate({
      customerName: data.customerName,
      serviceName: serviceNames[data.serviceType],
      planName: planNames[data.planType],
      onboardingUrl: data.onboardingUrl
    });

    await this.transporter.sendMail({
      from: `"PlayCode Agency 🎮" <${process.env.SMTP_FROM}>`,
      to: data.to,
      subject: `🎮 Bem-vindo à PlayCode! Vamos começar seu ${serviceNames[data.serviceType]}`,
      html: template,
    });
  }

  async sendFollowUpEmail(data: FollowUpEmailData): Promise<void> {
    const template = this.generateFollowUpTemplate(data);

    await this.transporter.sendMail({
      from: `"PlayCode Agency 🎮" <${process.env.SMTP_FROM}>`,
      to: data.to,
      subject: `🚀 Continue seu projeto ${data.serviceType} - PlayCode Agency`,
      html: template,
    });
  }

  private generateWelcomeTemplate(data: {
    customerName: string;
    serviceName: string;
    planName: string;
    onboardingUrl: string;
  }): string {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bem-vindo à PlayCode Agency</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #ffffff;
                line-height: 1.6;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0, 255, 255, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #00d4ff 0%, #ff00ff 100%);
                padding: 30px 20px;
                text-align: center;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #000;
                margin-bottom: 10px;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 24px;
                color: #00d4ff;
                margin-bottom: 20px;
            }
            .service-badge {
                display: inline-block;
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: #000;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                margin: 10px 0;
            }
            .cta-button {
                display: inline-block;
                background: linear-gradient(45deg, #00d4ff, #ff00ff);
                color: #000;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                font-size: 18px;
                margin: 30px 0;
                transition: transform 0.3s ease;
            }
            .cta-button:hover {
                transform: translateY(-2px);
            }
            .features {
                background: rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 20px;
                margin: 20px 0;
            }
            .feature-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
            }
            .feature-icon {
                background: #00d4ff;
                color: #000;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-weight: bold;
            }
            .footer {
                background: rgba(0, 0, 0, 0.5);
                padding: 20px;
                text-align: center;
                font-size: 14px;
                color: #888;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎮 PlayCode Agency</div>
                <div>Transformando ideias em realidade digital</div>
            </div>
            
            <div class="content">
                <h1 class="greeting">Olá, ${data.customerName}! 🚀</h1>
                
                <p>Bem-vindo à PlayCode Agency! Seu pagamento foi confirmado e estamos prontos para começar uma jornada épica juntos.</p>
                
                <div class="service-badge">
                    ${data.serviceName} - ${data.planName}
                </div>
                
                <p>Para iniciarmos seu projeto da melhor forma, precisamos conhecer melhor suas necessidades e objetivos. Preparamos um formulário personalizado que levará apenas alguns minutos para preencher.</p>
                
                <div class="features">
                    <h3>🎯 O que acontece agora:</h3>
                    <div class="feature-item">
                        <div class="feature-icon">1</div>
                        <div>Preencha o formulário de onboarding personalizado</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">2</div>
                        <div>Nossa equipe analisará suas informações</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">3</div>
                        <div>Agendaremos uma reunião de kickoff</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">4</div>
                        <div>Começaremos o desenvolvimento do seu projeto</div>
                    </div>
                </div>
                
                <center>
                    <a href="${data.onboardingUrl}" class="cta-button">
                        🎮 Iniciar Onboarding
                    </a>
                </center>
                
                <p><strong>⚡ Importante:</strong> Complete o onboarding em até 7 dias para garantirmos o início imediato do seu projeto.</p>
                
                <p>Dúvidas? Responda este email ou entre em contato via WhatsApp.</p>
                
                <p>Vamos criar algo incrível juntos! 🎮✨</p>
                
                <p><strong>Team PlayCode Agency</strong><br>
                Onde a tecnologia encontra a criatividade</p>
            </div>
            
            <div class="footer">
                <p>PlayCode Agency - Transformando ideias em realidade digital</p>
                <p>Este é um email automático. Para suporte, responda esta mensagem.</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateFollowUpTemplate(data: FollowUpEmailData): string {
    const urgencyLevel = data.daysElapsed >= 5 ? 'high' : data.daysElapsed >= 3 ? 'medium' : 'low';
    
    const urgencyMessages = {
      low: {
        subject: '🎮 Que tal continuarmos seu projeto?',
        message: 'Notamos que você ainda não finalizou o onboarding. Que tal continuarmos?'
      },
      medium: {
        subject: '⚡ Seu projeto está esperando!',
        message: 'Seu projeto está esperando para decolar! Complete o onboarding e vamos começar.'
      },
      high: {
        subject: '🚨 Últimos dias para completar seu onboarding',
        message: 'Restam poucos dias para completar seu onboarding. Não perca a oportunidade!'
      }
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Continue seu projeto - PlayCode Agency</title>
        <style>
            /* Same styles as welcome email */
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎮 PlayCode Agency</div>
                <div>${urgencyMessages[urgencyLevel].subject}</div>
            </div>
            
            <div class="content">
                <h1 class="greeting">Olá, ${data.customerName}! 👋</h1>
                
                <p>${urgencyMessages[urgencyLevel].message}</p>
                
                <p>Faltam apenas alguns passos para começarmos seu ${data.serviceType}. O formulário leva apenas 5-10 minutos para ser concluído.</p>
                
                <center>
                    <a href="${data.onboardingUrl}" class="cta-button">
                        🚀 Continuar Onboarding
                    </a>
                </center>
                
                <p>Precisa de ajuda? Nossa equipe está aqui para apoiar você!</p>
                
                <p><strong>Team PlayCode Agency</strong></p>
            </div>
            
            <div class="footer">
                <p>PlayCode Agency - Transformando ideias em realidade digital</p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}