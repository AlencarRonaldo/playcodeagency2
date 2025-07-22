import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Generate a proper PDF with jsPDF-like structure
    const pdfContent = generateProjectGuidePDF();
    
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Guia-Completo-Projeto-PlayCode-Agency.pdf"',
        'Cache-Control': 'no-cache',
        'Content-Length': pdfContent.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}

function generateProjectGuidePDF(): Buffer {
  // Gerar PDF estruturado e atualizado
  const pdfData = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 595 842]
/Resources <<
/Font <<
/F1 4 0 R
/F2 5 0 R
>>
>>
/Contents 6 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

6 0 obj
<<
/Length 3500
>>
stream
BT
/F1 28 Tf
50 800 Td
(🎮 PLAYCODE AGENCY) Tj
0 -35 Td
/F1 20 Tf
(Guia Completo do Projeto) Tj
0 -25 Td
/F2 14 Tf
(Metodologia Gaming para Desenvolvimento Web) Tj
0 -50 Td

/F1 16 Tf
(🔍 FASE 1: QUEST BRIEFING \\(2-3 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Analise detalhada do onboarding) Tj
0 -15 Td
(✓ Definicao de objetivos e metas) Tj
0 -15 Td
(✓ Planejamento de arquitetura tecnica) Tj
0 -15 Td
(✓ Cronograma personalizado do projeto) Tj
0 -15 Td
(✓ Analise de concorrencia e mercado) Tj
0 -30 Td

/F1 16 Tf
(🎨 FASE 2: DESIGN LEVEL \\(5-8 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Criacao de wireframes interativos) Tj
0 -15 Td
(✓ Design UI/UX personalizado) Tj
0 -15 Td
(✓ Identidade visual gaming) Tj
0 -15 Td
(✓ Prototipo navegavel para validacao) Tj
0 -15 Td
(✓ Responsive design mobile-first) Tj
0 -15 Td
(✓ Sistema de cores e tipografia) Tj
0 -30 Td

/F1 16 Tf
(⚡ FASE 3: CODING BATTLE \\(10-20 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Desenvolvimento frontend React/Next.js) Tj
0 -15 Td
(✓ Backend API Node.js/TypeScript) Tj
0 -15 Td
(✓ Banco de dados otimizado) Tj
0 -15 Td
(✓ Integracoes de pagamento e email) Tj
0 -15 Td
(✓ Sistema de SEO avancado) Tj
0 -15 Td
(✓ Performance e otimizacao) Tj
0 -30 Td

/F1 16 Tf
(🛡️ FASE 4: QUALITY CHECKPOINT \\(3-5 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Testes automatizados E2E) Tj
0 -15 Td
(✓ Auditoria de seguranca) Tj
0 -15 Td
(✓ Performance testing) Tj
0 -15 Td
(✓ Cross-browser compatibility) Tj
0 -15 Td
(✓ Acessibilidade WCAG) Tj
0 -15 Td
(✓ Mobile testing) Tj
0 -30 Td

/F1 16 Tf
(🚀 FASE 5: DEPLOYMENT MISSION \\(2-4 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Deploy em ambiente de producao) Tj
0 -15 Td
(✓ Configuracao de dominio e SSL) Tj
0 -15 Td
(✓ CDN e otimizacao de cache) Tj
0 -15 Td
(✓ Monitoramento e analytics) Tj
0 -15 Td
(✓ Backup automatico) Tj
0 -15 Td
(✓ Treinamento da equipe) Tj
0 -30 Td

/F1 16 Tf
(🎯 FASE 6: SUPORTE PREMIUM \\(30 dias\\)) Tj
0 -25 Td
/F2 12 Tf
(✓ Suporte tecnico 24/7) Tj
0 -15 Td
(✓ Correcoes sem custo adicional) Tj
0 -15 Td
(✓ Atualizacoes de seguranca) Tj
0 -15 Td
(✓ Monitoramento de uptime) Tj
0 -15 Td
(✓ Relatorios de performance) Tj
0 -40 Td

/F1 18 Tf
(🏆 Vamos levar seu projeto ao proximo level!) Tj
0 -30 Td
/F2 14 Tf
(📧 contato@playcodeagency.xyz) Tj
0 -15 Td
(📱 WhatsApp: \\(11\\) 95653-4963) Tj
0 -15 Td
(🌐 PlayCode Agency - Gaming meets Technology) Tj
0 -20 Td
/F2 10 Tf
(Documento gerado em ${new Date().toLocaleDateString('pt-BR')}) Tj
ET
endstream
endobj

xref
0 7
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000136 00000 n 
0000000277 00000 n 
0000000355 00000 n 
0000000428 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
3980
%%EOF`;

  return Buffer.from(pdfData, 'binary');
}