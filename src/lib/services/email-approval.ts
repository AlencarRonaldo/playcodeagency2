import nodemailer from 'nodemailer';

interface ApprovalEmailData {
  to: string;
  customerName: string;
  projectType: string;
  budgetRange: string;
  message: string;
  estimatedValue: number;
  timeline: string;
  services: string[];
  powerUps?: string[];
}

export class EmailApprovalService {
  private transporter: nodemailer.Transporter;

  constructor() {
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

  /**
   * Envia email de aprovação de orçamento para o cliente
   */
  async sendApprovalEmail(data: ApprovalEmailData, secureToken: string): Promise<{ success: boolean; error?: string }> {
    try {
      const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/aprovacao/${secureToken}`;
      const rejectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/aprovacao/${secureToken}?action=reject`;
      
      const emailTemplate = this.generateApprovalTemplate({
        ...data,
        approvalUrl,
        rejectUrl,
        approvalToken: secureToken
      });

      await this.transporter.sendMail({
        from: `"PlayCode Agency 🎮" <${process.env.SMTP_FROM}>`,
        to: data.to,
        subject: `🎮 Proposta de Orçamento - ${data.projectType} - PlayCode Agency`,
        html: emailTemplate,
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Erro ao enviar email de aprovação:', error);
      return { success: false, error: String(error) };
    }
  }

  /**
   * Envia notificação para a equipe sobre decisão do cliente
   */
  async sendTeamNotification(tokenData: any, projectData: ApprovalEmailData, action: 'approve' | 'reject'): Promise<void> {
    const status = action === 'approve' ? '✅ APROVADA' : '❌ REJEITADA';
    const bgColor = action === 'approve' ? '#4ecdc4' : '#ff6b6b';
    
    const template = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; }
            .header { background: ${bgColor}; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .customer-info { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎮 Proposta ${status}</h1>
            </div>
            <div class="content">
                <h2>Cliente: ${projectData.customerName}</h2>
                <div class="customer-info">
                    <p><strong>Email:</strong> ${projectData.to}</p>
                    <p><strong>Projeto:</strong> ${projectData.projectType}</p>
                    <p><strong>Valor:</strong> R$ ${projectData.estimatedValue.toLocaleString('pt-BR')}</p>
                    <p><strong>Orçamento:</strong> ${projectData.budgetRange}</p>
                    <p><strong>Ação:</strong> ${action === 'approve' ? 'Cliente APROVOU a proposta' : 'Cliente REJEITOU a proposta'}</p>
                </div>
                <p><strong>Próximos passos:</strong></p>
                <ul>
                    ${action === 'approve' ? `
                    <li>Entrar em contato com o cliente para assinatura do contrato</li>
                    <li>Agendar reunião de kickoff</li>
                    <li>Preparar documentação do projeto</li>
                    ` : `
                    <li>Arquivar proposta como rejeitada</li>
                    <li>Analisar feedback se houver</li>
                    <li>Considerar follow-up futuro</li>
                    `}
                </ul>
            </div>
        </div>
    </body>
    </html>
    `;

    await this.transporter.sendMail({
      from: `"Sistema PlayCode 🎮" <${process.env.SMTP_FROM}>`,
      to: process.env.TEAM_EMAIL || 'team@playcode.agency',
      subject: `🎮 Proposta ${status} - ${projectData.customerName}`,
      html: template,
    });
  }

  /**
   * Envia confirmação para o cliente
   */
  async sendClientConfirmation(projectData: ApprovalEmailData, action: 'approve' | 'reject'): Promise<void> {
    const template = action === 'approve' ? this.generateApprovalConfirmationTemplate(projectData) : this.generateRejectionConfirmationTemplate(projectData);
    
    await this.transporter.sendMail({
      from: `"PlayCode Agency 🎮" <${process.env.SMTP_FROM}>`,
      to: projectData.to,
      subject: action === 'approve' ? 
        '🎉 Proposta Aprovada - Próximos Passos' : 
        '📝 Confirmação - Proposta Arquivada',
      html: template,
    });
  }

  private generateApprovalTemplate(data: ApprovalEmailData & { 
    approvalUrl: string; 
    rejectUrl: string; 
    approvalToken: string 
  }): string {
    const servicesList = data.services.map(service => `<li class="service-item">✅ ${service}</li>`).join('');
    const powerUpsList = data.powerUps ? data.powerUps.map(powerUp => `<span class="power-up">${powerUp}</span>`).join('') : '';

    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Proposta de Orçamento - PlayCode Agency</title>
        <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
                color: #ffffff;
                line-height: 1.6;
            }
            .container {
                max-width: 700px;
                margin: 0 auto;
                background: rgba(0, 0, 0, 0.9);
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
            .proposal-section {
                background: rgba(0, 255, 255, 0.1);
                border-radius: 12px;
                padding: 25px;
                margin: 25px 0;
                border-left: 4px solid #00d4ff;
            }
            .section-title {
                color: #00d4ff;
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 15px;
                text-transform: uppercase;
            }
            .price-highlight {
                background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
                color: #000;
                padding: 15px 25px;
                border-radius: 25px;
                font-weight: bold;
                font-size: 24px;
                text-align: center;
                margin: 20px 0;
                box-shadow: 0 10px 20px rgba(0, 255, 255, 0.3);
            }
            .service-item {
                padding: 8px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                color: #fff;
            }
            .power-up {
                display: inline-block;
                background: rgba(255, 0, 255, 0.2);
                color: #ff00ff;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 12px;
                margin: 2px;
                border: 1px solid #ff00ff;
            }
            .cta-buttons {
                text-align: center;
                margin: 40px 0;
            }
            .btn-approve {
                display: inline-block;
                background: linear-gradient(45deg, #4ecdc4, #44a08d);
                color: #000;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                font-size: 18px;
                margin: 10px;
                transition: transform 0.3s ease;
                box-shadow: 0 10px 20px rgba(76, 205, 196, 0.3);
            }
            .btn-reject {
                display: inline-block;
                background: linear-gradient(45deg, #ff6b6b, #ee5a52);
                color: #fff;
                padding: 15px 40px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: bold;
                font-size: 18px;
                margin: 10px;
                transition: transform 0.3s ease;
                box-shadow: 0 10px 20px rgba(255, 107, 107, 0.3);
            }
            .timeline-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
                padding: 10px 0;
            }
            .timeline-icon {
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
                font-size: 14px;
            }
            .footer {
                background: rgba(0, 0, 0, 0.5);
                padding: 25px;
                text-align: center;
                font-size: 14px;
                color: #888;
            }
            .expiry-notice {
                background: rgba(255, 107, 107, 0.2);
                border: 1px solid #ff6b6b;
                color: #ff6b6b;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">🎮 PlayCode Agency</div>
                <div>Proposta de Orçamento Personalizada</div>
            </div>
            
            <div class="content">
                <h1 class="greeting">Olá, ${data.customerName}! 🚀</h1>
                
                <p>Preparamos uma proposta personalizada para seu projeto <strong>${data.projectType}</strong>. Analisamos cuidadosamente suas necessidades e criamos um orçamento que oferece o melhor custo-benefício.</p>
                
                <div class="proposal-section">
                    <h3 class="section-title">💰 Valor da Proposta</h3>
                    <div class="price-highlight">
                        R$ ${data.estimatedValue.toLocaleString('pt-BR')}
                    </div>
                    <p><strong>Prazo de Entrega:</strong> ${data.timeline}</p>
                    <p><strong>Orçamento Solicitado:</strong> ${data.budgetRange}</p>
                </div>

                <div class="proposal-section">
                    <h3 class="section-title">🚀 Serviços Inclusos</h3>
                    <ul style="list-style: none; padding: 0;">
                        ${servicesList}
                    </ul>
                </div>

                ${data.powerUps && data.powerUps.length > 0 ? `
                <div class="proposal-section">
                    <h3 class="section-title">⚡ Power-ups Selecionados</h3>
                    <div>${powerUpsList}</div>
                </div>
                ` : ''}

                <div class="proposal-section">
                    <h3 class="section-title">📋 Detalhes do Projeto</h3>
                    <p><strong>Descrição:</strong></p>
                    <div style="background: rgba(0,0,0,0.3); padding: 15px; border-radius: 8px; margin: 10px 0;">
                        ${data.message}
                    </div>
                </div>

                <div class="proposal-section">
                    <h3 class="section-title">⏰ Timeline do Projeto</h3>
                    <div class="timeline-item">
                        <div class="timeline-icon">1</div>
                        <div>Aprovação da proposta e assinatura do contrato</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">2</div>
                        <div>Reunião de kickoff e briefing detalhado</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">3</div>
                        <div>Desenvolvimento e entregas parciais</div>
                    </div>
                    <div class="timeline-item">
                        <div class="timeline-icon">4</div>
                        <div>Testes, refinamentos e entrega final</div>
                    </div>
                </div>

                <div class="expiry-notice">
                    ⚠️ <strong>Esta proposta é válida por 7 dias.</strong><br>
                    Após este período, será necessário solicitar uma nova cotação.
                </div>

                <div class="cta-buttons">
                    <a href="${data.approvalUrl}" class="btn-approve">
                        ✅ APROVAR PROPOSTA
                    </a>
                    <br>
                    <a href="${data.rejectUrl}" class="btn-reject">
                        ❌ Não tenho interesse
                    </a>
                </div>

                <p style="text-align: center; margin-top: 30px;">
                    <strong>Dúvidas?</strong> Responda este email ou entre em contato:<br>
                    📞 WhatsApp: (11) 99999-9999<br>
                    📧 Email: contato@playcode.agency
                </p>
                
                <p style="text-align: center; margin-top: 20px;">
                    <strong>Team PlayCode Agency</strong><br>
                    Transformando visões em realidade digital 🎮✨
                </p>
            </div>
            
            <div class="footer">
                <p>PlayCode Agency - Soluções Digitais Gaming</p>
                <p>Proposta gerada em ${new Date().toLocaleDateString('pt-BR')}</p>
                <p style="font-size: 12px; margin-top: 10px;">
                    Código da Proposta: ${data.approvalToken.substr(0, 8).toUpperCase()}
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateApprovalConfirmationTemplate(projectData: ApprovalEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(45deg, #4ecdc4, #44a08d); padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .success-badge { background: #4ecdc4; color: #000; padding: 10px 20px; border-radius: 20px; display: inline-block; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 PROPOSTA APROVADA!</h1>
            </div>
            <div class="content">
                <h2>Parabéns, ${projectData.customerName}! 🚀</h2>
                
                <div class="success-badge">
                    Projeto: ${projectData.projectType}
                </div>
                
                <p>Sua proposta foi aprovada com sucesso! Nossa equipe entrará em contato em até 24 horas para:</p>
                
                <ul>
                    <li>📋 Enviar o contrato para assinatura</li>
                    <li>📅 Agendar reunião de kickoff</li>
                    <li>🚀 Iniciar o desenvolvimento do seu projeto</li>
                </ul>
                
                <p><strong>Valor aprovado:</strong> R$ ${projectData.estimatedValue.toLocaleString('pt-BR')}</p>
                <p><strong>Prazo estimado:</strong> ${projectData.timeline}</p>
                
                <p>Muito obrigado pela confiança! Vamos criar algo incrível juntos! 🎮✨</p>
                
                <p><strong>Team PlayCode Agency</strong></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }

  private generateRejectionConfirmationTemplate(projectData: ApprovalEmailData): string {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; background: #0a0a0a; color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a1a; border-radius: 12px; overflow: hidden; }
            .header { background: #333; padding: 30px; text-align: center; }
            .content { padding: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📝 Proposta Arquivada</h1>
            </div>
            <div class="content">
                <h2>Olá, ${projectData.customerName}!</h2>
                
                <p>Confirmamos que você optou por não prosseguir com a proposta para <strong>${projectData.projectType}</strong>.</p>
                
                <p>Entendemos que cada momento tem suas prioridades. Nossa proposta ficará disponível para consulta futura, caso mude de ideia.</p>
                
                <p>Se tiver algum feedback sobre nossa proposta ou quiser discutir alternativas, fique à vontade para entrar em contato.</p>
                
                <p>Agradecemos seu tempo e consideração. Estaremos aqui quando precisar de nossos serviços! 🎮</p>
                
                <p><strong>Team PlayCode Agency</strong></p>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}

export const emailApprovalService = new EmailApprovalService();