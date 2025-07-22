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

interface ContactEmailData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: string;
  budget_range?: string;
  urgency: string;
  message: string;
  lead_score: number;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Log SMTP config for debugging (remove in production)
    console.log('📧 SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      hasPass: !!process.env.SMTP_PASS
    });
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendContactFormEmail(data: ContactEmailData): Promise<void> {
    const template = this.generateContactFormTemplate(data);
    
    console.log('📧 Tentando enviar email de contato...');

    try {
      console.log('📧 Verificando conexão SMTP...');
      await this.transporter.verify();
      console.log('✅ Conexão SMTP verificada com sucesso para email de contato');

      const mailOptions = {
        from: `"Formulário Contato 👽" <${process.env.SMTP_FROM}>`,
        to: 'contato@playcodeagency.xyz',
        replyTo: data.email,
        subject: `🎮 Nova Missão (Lead Score: ${data.lead_score}): ${data.project_type}`,
        html: template,
      };
      
      console.log('📧 Enviando email com opções:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const info = await this.transporter.sendMail(mailOptions);

      console.log('✅ Email de contato enviado com sucesso - Message ID:', info.messageId);
      console.log('📧 Response:', info.response);
    } catch (error) {
      console.error('❌ Erro detalhado ao enviar email de contato:');
      console.error('   - Error object:', error);
      console.error('   - Error message:', error instanceof Error ? error.message : 'Unknown error');
      console.error('   - Error code:', (error as any)?.code);
      console.error('   - Error response:', (error as any)?.response);
      
      // Relança o erro para que a API possa tratar adequadamente
      throw error;
    }
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

    console.log('📧 Tentando enviar email para:', data.to);
    console.log('📧 SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      from: process.env.SMTP_FROM
    });

    try {
      // Verificar conexão SMTP primeiro
      await this.transporter.verify();
      console.log('✅ Conexão SMTP verificada com sucesso');

      const info = await this.transporter.sendMail({
        from: `"PlayCode Agency 🎮" <${process.env.SMTP_FROM}>`,
        to: data.to,
        subject: `🎮 Bem-vindo à PlayCode! Vamos começar seu ${serviceNames[data.serviceType]}`,
        html: template,
      });

      console.log('📧 Email enviado - Message ID:', info.messageId);
      console.log('📧 Response:', info.response);
      console.log('📧 Accepted:', info.accepted);
      console.log('📧 Rejected:', info.rejected);
      
      if (info.rejected && info.rejected.length > 0) {
        console.error('❌ Emails rejeitados:', info.rejected);
        throw new Error(`Email rejeitado pelo servidor: ${info.rejected.join(', ')}`);
      }

    } catch (error) {
      console.error('❌ Erro detalhado ao enviar email:', error);
      throw error;
    }
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

  private generateContactFormTemplate(data: ContactEmailData): string {
    // Mapear tipos de projeto para labels mais amigáveis
    const projectTypes: Record<string, string> = {
      'website': '🌐 Website/Landing Page',
      'webapp': '⚡ Web Application', 
      'mobile': '📱 Mobile App',
      'ai': '🤖 AI Integration',
      'ecommerce': '🛒 E-commerce',
      'custom': '🚀 Custom Solution'
    };

    // Mapear níveis de urgência
    const urgencyLevels: Record<string, string> = {
      'low': '🐌 Standard (30-60 dias)',
      'normal': '⚡ Fast Track (15-30 dias)', 
      'high': '🚀 Rush (7-15 dias)',
      'critical': '🔥 Emergency (< 7 dias)'
    };

    // Determinar cor da urgência
    const urgencyColors: Record<string, string> = {
      'low': '#22c55e',
      'normal': '#3b82f6',
      'high': '#f59e0b', 
      'critical': '#ef4444'
    };

    // Determinar cor do lead score
    const getLeadScoreColor = (score: number): string => {
      if (score >= 2000) return '#10b981'; // green
      if (score >= 1000) return '#3b82f6'; // blue
      if (score >= 500) return '#f59e0b';   // amber
      return '#6b7280'; // gray
    };

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Missão - PlayCode Agency</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f8fafc;
                color: #1e293b;
                line-height: 1.6;
                padding: 20px;
                margin: 0;
            }
            
            .container { 
                max-width: 700px; 
                margin: 0 auto; 
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                border: 2px solid #e2e8f0;
            }
            
            .header { 
                background: linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #06b6d4 100%);
                padding: 30px 20px;
                text-align: center;
                color: #ffffff;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="circuit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 10h20M10 0v20" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23circuit)"/></svg>');
                opacity: 0.3;
            }
            
            .header h1 { 
                font-size: 28px; 
                font-weight: bold;
                margin-bottom: 8px;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            
            .logo-text {
                font-size: 32px;
                font-weight: 900;
                margin-bottom: 15px;
                color: #ffffff;
                text-shadow: 0 4px 8px rgba(0,0,0,0.5);
                letter-spacing: 1px;
                position: relative;
                z-index: 1;
            }
            
            .logo-text .play {
                color: #00d4ff;
            }
            
            .logo-text .code {
                color: #ff6b6b;
            }
            
            .logo-text .agency {
                color: #4ecdc4;
            }
            
            .lead-score-badge {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                color: #ffffff !important;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
                backdrop-filter: blur(10px);
                border: 2px solid rgba(255, 255, 255, 0.5);
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            }
            
            .content { 
                padding: 30px;
                background: #ffffff;
            }
            
            .section {
                margin-bottom: 30px;
            }
            
            .section-title { 
                font-size: 20px; 
                font-weight: bold;
                color: #0f172a;
                margin-bottom: 16px;
                display: flex;
                align-items: center;
                gap: 10px;
                padding-bottom: 8px;
                border-bottom: 2px solid #cbd5e1;
            }
            
            .info-grid {
                display: grid;
                gap: 12px;
            }
            
            .info-item { 
                background: #f9fafb;
                padding: 16px 20px;
                border-radius: 12px;
                border-left: 4px solid #0ea5e9;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s ease;
            }
            
            .info-item:hover {
                background: #f3f4f6;
                transform: translateX(4px);
            }
            
            .info-label { 
                font-weight: 600;
                color: #475569;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .info-value { 
                font-weight: bold;
                color: #0f172a;
                font-size: 16px;
                text-align: right;
            }
            
            .email-link {
                color: #0ea5e9;
                text-decoration: none;
                font-weight: bold;
            }
            
            .email-link:hover {
                color: #0284c7;
                text-decoration: underline;
            }
            
            .urgency-badge {
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
                color: #ffffff !important;
                text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .message-box {
                background: #f9fafb;
                border: 2px solid #d1d5db;
                border-radius: 12px;
                padding: 20px;
                font-size: 16px;
                line-height: 1.7;
                color: #0f172a;
                position: relative;
            }
            
            .message-box::before {
                content: '💬';
                position: absolute;
                top: -10px;
                left: 20px;
                background: #ffffff;
                padding: 0 8px;
                font-size: 20px;
            }
            
            .project-type-badge {
                display: inline-block;
                background: #059669 !important;
                color: #000000 !important;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                font-size: 14px;
                text-shadow: none;
                border: 2px solid #047857;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            }
            
            .footer {
                background: #f9fafb;
                padding: 20px 30px;
                border-top: 1px solid #d1d5db;
                text-align: center;
                color: #4b5563;
                font-size: 14px;
            }
            
            .gaming-emoji {
                font-size: 24px;
                margin-right: 8px;
            }
            
            @media (max-width: 600px) {
                body { padding: 10px; }
                .container { border-radius: 8px; }
                .header { padding: 20px 15px; }
                .content { padding: 20px 15px; }
                .header h1 { font-size: 24px; }
                .section-title { font-size: 18px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-text">
                    🎮 <span class="play">Play</span><span class="code">Code</span> <span class="agency">Agency</span>
                </div>
                <h1><span class="gaming-emoji">🎯</span>Nova Missão Recebida!</h1>
                <div class="lead-score-badge" style="color: #ffffff !important;">
                    ⭐ Lead Score: <strong style="color: #ffffff !important;">${data.lead_score}</strong>
                </div>
            </div>
            
            <div class="content">
                <!-- Informações do Contato -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="gaming-emoji">👤</span>Informações do Player
                    </h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Nome</span>
                            <span class="info-value">${data.name}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Email</span>
                            <span class="info-value">
                                <a href="mailto:${data.email}" class="email-link">${data.email}</a>
                            </span>
                        </div>
                        ${data.phone ? `
                        <div class="info-item">
                            <span class="info-label">Telefone</span>
                            <span class="info-value">${data.phone}</span>
                        </div>` : ''}
                        ${data.company ? `
                        <div class="info-item">
                            <span class="info-label">Empresa</span>
                            <span class="info-value">${data.company}</span>
                        </div>` : ''}
                    </div>
                </div>

                <!-- Detalhes da Missão -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="gaming-emoji">🚀</span>Detalhes da Missão
                    </h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Tipo de Projeto</span>
                            <span class="info-value">
                                <span class="project-type-badge" style="background: #059669 !important; color: #000000 !important; font-weight: bold; border: 2px solid #047857;">
                                    ${projectTypes[data.project_type] || data.project_type}
                                </span>
                            </span>
                        </div>
                        ${data.budget_range ? `
                        <div class="info-item">
                            <span class="info-label">Orçamento</span>
                            <span class="info-value">${data.budget_range}</span>
                        </div>` : ''}
                        <div class="info-item">
                            <span class="info-label">Nível de Urgência</span>
                            <span class="info-value">
                                <span class="urgency-badge" style="background-color: ${urgencyColors[data.urgency] || urgencyColors.normal}; color: #ffffff !important;">
                                    ${urgencyLevels[data.urgency] || data.urgency}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Mensagem do Cliente -->
                <div class="section">
                    <h2 class="section-title">
                        <span class="gaming-emoji">📝</span>Briefing da Missão
                    </h2>
                    <div class="message-box">
                        ${data.message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>🎮 PlayCode Agency</strong> - Sistema de CRM Gamificado</p>
                <p>Este email foi gerado automaticamente pelo sistema de contato do site.</p>
            </div>
        </div>
    </body>
    </html>
    `;
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
