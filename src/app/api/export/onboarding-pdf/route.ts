import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { onboardingData } = await request.json();
    
    if (!onboardingData) {
      return NextResponse.json(
        { error: 'Dados do onboarding são obrigatórios' },
        { status: 400 }
      );
    }
    
    // Gerar PDF com os dados reais do onboarding
    const pdfContent = generateOnboardingPDF(onboardingData);
    
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="onboarding-${onboardingData.customerName.replace(/\s+/g, '-')}-${onboardingData.id}.pdf"`,
        'Cache-Control': 'no-cache',
        'Content-Length': pdfContent.length.toString(),
      },
    });
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar PDF' },
      { status: 500 }
    );
  }
}

function generateOnboardingPDF(onboarding: any): Buffer {
  // Extrair dados do formulário
  const formData = onboarding.formData || {};
  const domain = formData.domain || {};
  const design = formData.design || {};
  const content = formData.content || {};
  const features = formData.features || {};
  const seo = formData.seo || {};
  const hosting = formData.hosting || {};

  // Mapear nomes de serviços
  const serviceNames = {
    website: 'Website/Landing Page',
    ecommerce: 'E-commerce',
    mobile: 'Aplicativo Mobile', 
    marketing: 'Marketing Digital',
    automation: 'Automação de Processos'
  };

  const planNames = {
    starter: 'Starter Pack - R$ 797',
    pro: 'Pro Guild - R$ 2.497',
    enterprise: 'Enterprise - Sob consulta'
  };

  // Função helper para formatar texto
  const formatText = (text: string) => {
    if (!text) return 'Nao informado';
    return text.replace(/[()]/g, '\\\\$&')
              .replace(/[àáâãäå]/g, 'a')
              .replace(/[èéêë]/g, 'e')
              .replace(/[ìíîï]/g, 'i')
              .replace(/[òóôõö]/g, 'o')
              .replace(/[ùúûü]/g, 'u')
              .replace(/[ç]/g, 'c')
              .replace(/[ñ]/g, 'n');
  };

  // Função para listar features ativas
  const getActiveFeatures = () => {
    const activeFeatures = [];
    if (features.contactForm) activeFeatures.push('Formulario de Contato');
    if (features.livechat) activeFeatures.push('Chat Online');
    if (features.newsletter) activeFeatures.push('Newsletter');
    if (features.blog) activeFeatures.push('Blog');
    if (features.ecommerce) activeFeatures.push('E-commerce');
    if (features.multiLanguage) activeFeatures.push('Multi-idiomas');
    return activeFeatures.length > 0 ? activeFeatures.join(', ') : 'Funcionalidades padrao do plano';
  };

  // Função para listar áreas de conteúdo
  const getContentAreas = () => {
    return content.contentAreas && content.contentAreas.length > 0 
      ? content.contentAreas.join(', ') 
      : 'Estrutura padrao do servico';
  };

  // Gerar conteúdo do PDF estruturado e estilizado
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
/Length 6500
>>
stream
BT
/F1 28 Tf
50 800 Td
(PLAYCODE AGENCY) Tj
0 -35 Td
/F1 20 Tf
(RELATORIO DE ONBOARDING) Tj
0 -20 Td
/F2 14 Tf
(Gaming Development Solutions) Tj
0 -50 Td

/F1 16 Tf
(INFORMACOES DO CLIENTE) Tj
0 -25 Td
/F2 12 Tf
(Cliente: ${formatText(onboarding.customerName)}) Tj
0 -15 Td
(Email: ${formatText(onboarding.customerEmail)}) Tj
0 -15 Td
(Telefone: ${formatText(onboarding.customerPhone)}) Tj
0 -15 Td
(Servico: ${formatText(serviceNames[onboarding.serviceType] || onboarding.serviceType)}) Tj
0 -15 Td
(Plano: ${formatText(planNames[onboarding.planType] || onboarding.planType)}) Tj
0 -15 Td
(Status: ${onboarding.isCompleted ? 'CONCLUIDO' : 'EM ANDAMENTO'}) Tj
0 -15 Td
(Data: ${new Date(onboarding.createdAt).toLocaleDateString('pt-BR')}) Tj
0 -30 Td

/F1 16 Tf
(DOMINIO E HOSPEDAGEM) Tj
0 -25 Td
/F2 12 Tf
(Dominio existente: ${domain.hasExisting ? 'Sim' : 'Nao'}) Tj
0 -15 Td
(Dominio atual: ${formatText(domain.currentDomain)}) Tj
0 -15 Td
(Novo dominio: ${domain.needsNew ? 'Sim' : 'Nao'}) Tj
0 -15 Td
(Dominio desejado: ${formatText(domain.preferredDomain)}) Tj
0 -15 Td
(Performance: ${formatText(hosting.performanceRequirements)}) Tj
0 -15 Td
(Hospedagem existente: ${hosting.hasExisting ? 'Sim' : 'Nao'}) Tj
0 -25 Td

/F1 16 Tf
(DESIGN E IDENTIDADE VISUAL) Tj
0 -25 Td
/F2 12 Tf
(Logo existente: ${design.hasLogo ? 'Sim' : 'Nao - Sera criado'}) Tj
0 -15 Td
(Paleta de cores: ${formatText(design.colorPreferences)}) Tj
0 -15 Td
(Estilo preferido: ${formatText(design.stylePreference)}) Tj
0 -15 Td
(Sites de referencia: ${design.designReferences ? 'Fornecidos pelo cliente' : 'Nao fornecidos'}) Tj
0 -25 Td

/F1 16 Tf
(ESTRATEGIA DE CONTEUDO) Tj
0 -25 Td
/F2 12 Tf
(Conteudo existente: ${content.hasExistingContent ? 'Cliente possui' : 'Sera criado'}) Tj
0 -15 Td
(Criacao necessaria: ${content.needsContentCreation ? 'Sim' : 'Nao'}) Tj
0 -15 Td
(Publico-alvo: ${formatText(content.targetAudience)}) Tj
0 -15 Td
(Areas de conteudo: ${formatText(getContentAreas())}) Tj
0 -25 Td

/F1 16 Tf
(FUNCIONALIDADES E RECURSOS) Tj
0 -25 Td
/F2 12 Tf
(Recursos selecionados: ${formatText(getActiveFeatures())}) Tj
0 -15 Td
(Customizacoes: ${formatText(features.customFeatures)}) Tj
0 -25 Td

/F1 16 Tf
(SEO E MARKETING DIGITAL) Tj
0 -25 Td
/F2 12 Tf
(Palavras-chave: ${formatText(seo.keywords)}) Tj
0 -15 Td
(Analise concorrencia: ${formatText(seo.competitors)}) Tj
0 -15 Td
(Google Analytics: ${seo.hasGoogleAnalytics ? 'Configurar' : 'Nao solicitado'}) Tj
0 -15 Td
(Google Ads: ${seo.hasGoogleAds ? 'Preparar' : 'Nao solicitado'}) Tj
0 -15 Td
(Objetivos SEO: ${formatText(seo.seoGoals)}) Tj
0 -40 Td

/F1 18 Tf
(PROXIMOS PASSOS) Tj
0 -25 Td
/F2 12 Tf
(1. Kickoff Meeting - Alinhamento detalhado) Tj
0 -15 Td
(2. Wireframes - Estrutura e layout) Tj
0 -15 Td
(3. Design - Identidade visual completa) Tj
0 -15 Td
(4. Desenvolvimento - Codificacao e testes) Tj
0 -15 Td
(5. Deploy - Lancamento e configuracao) Tj
0 -15 Td
(6. Suporte - 30 dias pos-lancamento) Tj
0 -40 Td

/F1 14 Tf
(Relatorio gerado em ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}) Tj
0 -20 Td
/F2 10 Tf
(contato@playcodeagency.xyz) Tj
0 -12 Td
(WhatsApp: \\(11\\) 95653-4963) Tj
0 -12 Td
(PlayCode Agency - Gaming meets Technology) Tj
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
6980
%%EOF`;

  return Buffer.from(pdfData, 'binary');
}