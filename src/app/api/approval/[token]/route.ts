import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { tokenManager } from '@/lib/security/token-manager';
import { emailApprovalService } from '@/lib/services/email-approval';
import { IPSecurity, SecurityMonitor } from '@/lib/security/input-validation';

// Schema de validação para decisão de aprovação
const approvalDecisionSchema = z.object({
  action: z.enum(['approve', 'reject'], { message: 'Ação deve ser approve ou reject' }),
  feedback: z.string().optional()
});

interface ApprovalPageData {
  customerName: string;
  projectType: string;
  budgetRange: string;
  message: string;
  estimatedValue: number;
  timeline: string;
  services: string[];
  powerUps?: string[];
}

// Simulação de banco de dados - em produção usar banco real
const approvalDatabase = new Map<string, ApprovalPageData>();

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    // Verificações de segurança
    const ip = IPSecurity.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Log da tentativa de acesso
    SecurityMonitor.logSecurityEvent({
      type: 'approval_page_access',
      ip,
      userAgent,
      details: { token_id: token.substr(0, 8) }
    });
    
    // Validar token
    const tokenValidation = tokenManager.validateToken(token);
    if (!tokenValidation.valid) {
      SecurityMonitor.logSecurityEvent({
        type: 'invalid_approval_token',
        ip,
        userAgent,
        details: { token_id: token.substr(0, 8), error: tokenValidation.error }
      });
      
      return NextResponse.json({
        error: 'Token inválido',
        message: tokenValidation.error || 'Token de aprovação inválido ou expirado'
      }, { status: 400 });
    }
    
    // Buscar dados da aprovação (simulado - em produção buscar do banco)
    const approvalData = approvalDatabase.get(token);
    if (!approvalData) {
      return NextResponse.json({
        error: 'Dados não encontrados',
        message: 'Dados da proposta não encontrados'
      }, { status: 404 });
    }
    
    // Log de acesso bem-sucedido
    SecurityMonitor.logSecurityEvent({
      type: 'approval_page_loaded',
      ip,
      userAgent,
      details: { 
        customer: tokenValidation.data?.email,
        project: tokenValidation.data?.projectType,
        token_id: token.substr(0, 8)
      }
    });
    
    // Retornar dados para a página
    return NextResponse.json({
      success: true,
      data: {
        tokenData: tokenValidation.data,
        approvalData,
        expiresAt: new Date(tokenValidation.data.expiresAt).toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na API de validação de token:', error);
    
    return NextResponse.json({
      error: 'Erro interno',
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;
    
    // Verificações de segurança
    const ip = IPSecurity.getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Validar token
    const tokenValidation = tokenManager.validateToken(token);
    if (!tokenValidation.valid) {
      SecurityMonitor.logSecurityEvent({
        type: 'invalid_approval_submission',
        ip,
        userAgent,
        details: { token_id: token.substr(0, 8), error: tokenValidation.error }
      });
      
      return NextResponse.json({
        error: 'Token inválido',
        message: tokenValidation.error || 'Token de aprovação inválido ou expirado'
      }, { status: 400 });
    }
    
    // Parse e validação da decisão
    const body = await request.json();
    const validatedDecision = approvalDecisionSchema.parse(body);
    
    // Buscar dados da aprovação
    const approvalData = approvalDatabase.get(token);
    if (!approvalData) {
      return NextResponse.json({
        error: 'Dados não encontrados',
        message: 'Dados da proposta não encontrados'
      }, { status: 404 });
    }
    
    // Log da decisão
    SecurityMonitor.logSecurityEvent({
      type: 'approval_decision_made',
      ip,
      userAgent,
      details: { 
        customer: tokenValidation.data.email,
        project: tokenValidation.data.projectType,
        action: validatedDecision.action,
        token_id: token.substr(0, 8),
        feedback: validatedDecision.feedback ? 'provided' : 'none'
      }
    });
    
    // Enviar notificações por email
    try {
      // Notificar equipe
      await emailApprovalService.sendTeamNotification(
        tokenValidation.data,
        approvalData,
        validatedDecision.action
      );
      
      // Confirmar com cliente
      await emailApprovalService.sendClientConfirmation(
        approvalData,
        validatedDecision.action
      );
      
      console.log(`✅ Decisão processada: ${validatedDecision.action} para ${tokenValidation.data.email}`);
      
    } catch (emailError) {
      console.error('❌ Erro ao enviar emails:', emailError);
      // Não falhar a operação se o email falhar
    }
    
    // Invalidar token (removê-lo do banco de dados)
    approvalDatabase.delete(token);
    
    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: validatedDecision.action === 'approve' ? 
        '🎉 Proposta aprovada com sucesso!' : 
        '📝 Decisão registrada. Obrigado pelo seu tempo.',
      data: {
        action: validatedDecision.action,
        customerEmail: tokenValidation.data.email,
        projectType: tokenValidation.data.projectType,
        processedAt: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Erro na API de decisão de aprovação:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Dados inválidos',
        message: 'Ação deve ser approve ou reject',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Erro interno',
      message: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Função auxiliar para salvar dados da aprovação (simula banco de dados)
export function saveApprovalData(token: string, data: ApprovalPageData) {
  approvalDatabase.set(token, data);
}