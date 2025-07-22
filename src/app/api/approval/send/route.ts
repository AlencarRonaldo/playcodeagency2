import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { emailApprovalService } from '@/lib/services/email-approval';
import { tokenManager } from '@/lib/security/token-manager';
import { IPSecurity, SecurityMonitor } from '@/lib/security/input-validation';

// Schema de validação para envio de proposta
const sendApprovalSchema = z.object({
  // Dados do cliente
  customerName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  customerEmail: z.string().email('Email inválido'),
  
  // Dados do projeto
  projectType: z.string().min(1, 'Tipo de projeto é obrigatório'),
  projectDescription: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  budgetRange: z.string().min(1, 'Faixa de orçamento é obrigatória'),
  
  // Dados da proposta
  estimatedValue: z.number().min(1, 'Valor deve ser maior que zero'),
  timeline: z.string().min(1, 'Prazo é obrigatório'),
  services: z.array(z.string()).min(1, 'Selecione pelo menos um serviço'),
  powerUps: z.array(z.string()).optional(),
  
  // Autenticação da equipe
  adminToken: z.string().min(1, 'Token de administrador é obrigatório')
});

export async function POST(request: NextRequest) {
  try {
    // Verificações de segurança
    const ip = IPSecurity.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log da tentativa
    SecurityMonitor.logSecurityEvent({
      type: 'approval_send_attempt',
      ip,
      userAgent,
      details: { endpoint: 'approval/send' }
    });
    
    // Parse e validação dos dados
    const body = await request.json();
    const validatedData = sendApprovalSchema.parse(body);
    
    // Verificar token de administrador
    const expectedAdminToken = process.env.ADMIN_APPROVAL_TOKEN;
    if (!expectedAdminToken) {
      return NextResponse.json({
        error: 'Sistema não configurado',
        message: 'Token de administrador não configurado no servidor'
      }, { status: 500 });
    }
    
    if (validatedData.adminToken !== expectedAdminToken) {
      SecurityMonitor.logSecurityEvent({
        type: 'invalid_admin_token',
        ip,
        userAgent,
        details: { provided_token: validatedData.adminToken.substr(0, 5) + '...' }
      });
      
      return NextResponse.json({
        error: 'Token inválido',
        message: 'Token de administrador inválido'
      }, { status: 401 });
    }
    
    // Gerar token de aprovação seguro
    const customerId = tokenManager.generateCustomerId(validatedData.customerEmail);
    const approvalToken = tokenManager.generateToken({
      customerId,
      email: validatedData.customerEmail,
      projectType: validatedData.projectType
    });
    
    // Preparar dados para o email
    const emailData = {
      to: validatedData.customerEmail,
      customerName: validatedData.customerName,
      projectType: validatedData.projectType,
      budgetRange: validatedData.budgetRange,
      message: validatedData.projectDescription,
      estimatedValue: validatedData.estimatedValue,
      timeline: validatedData.timeline,
      services: validatedData.services,
      powerUps: validatedData.powerUps
    };
    
    // Enviar email de aprovação
    const emailResult = await emailApprovalService.sendApprovalEmail(emailData, approvalToken);
    
    if (!emailResult.success) {
      SecurityMonitor.logSecurityEvent({
        type: 'email_send_failure',
        ip,
        userAgent,
        details: { error: emailResult.error, customer: validatedData.customerEmail }
      });
      
      return NextResponse.json({
        error: 'Falha no envio',
        message: 'Erro ao enviar email de aprovação'
      }, { status: 500 });
    }
    
    // Log de sucesso
    SecurityMonitor.logSecurityEvent({
      type: 'approval_sent_success',
      ip,
      userAgent,
      details: { 
        customer: validatedData.customerEmail,
        project: validatedData.projectType,
        value: validatedData.estimatedValue,
        token_id: approvalToken.substr(0, 8)
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Proposta enviada com sucesso!',
      data: {
        customerId,
        customerEmail: validatedData.customerEmail,
        projectType: validatedData.projectType,
        estimatedValue: validatedData.estimatedValue,
        tokenId: approvalToken.substr(0, 8), // Apenas parte do token para tracking
        sentAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na API de envio de aprovação:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        message: 'Verifique os dados enviados',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Erro interno',
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}