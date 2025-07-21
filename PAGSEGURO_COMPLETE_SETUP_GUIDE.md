# 🏢 Guia Completo: Configuração PagSeguro do Zero ao Funcionamento

Um guia passo a passo completo para configurar uma conta PagSeguro para receber pagamentos no Brasil, desde o registro da empresa até os testes de integração.

## 📋 Índice

1. [Pré-requisitos e Documentação](#pré-requisitos-e-documentação)
2. [Registro da Empresa](#registro-da-empresa)
3. [Criação da Conta PagSeguro](#criação-da-conta-pagseguro)
4. [Verificação da Conta](#verificação-da-conta)
5. [Configuração da API](#configuração-da-api)
6. [Configuração de Webhooks](#configuração-de-webhooks)
7. [Testes e Validação](#testes-e-validação)
8. [Solução de Problemas Comuns](#solução-de-problemas-comuns)
9. [Ambiente de Produção](#ambiente-de-produção)

---

## 1. 📄 Pré-requisitos e Documentação

### Documentos Necessários

#### Para Pessoa Física (MEI)
- ✅ **CPF** (válido e regularizado)
- ✅ **RG** ou CNH (foto frente e verso)
- ✅ **Comprovante de endereço** (máximo 3 meses)
- ✅ **Comprovante de renda** (opcional para MEI)
- ✅ **Certificado MEI** (Portal do Empreendedor)

#### Para Pessoa Jurídica
- ✅ **CNPJ** (ativo na Receita Federal)
- ✅ **Contrato Social** ou Estatuto (última alteração)
- ✅ **Cartão CNPJ** (Receita Federal)
- ✅ **Inscrição Estadual** (se aplicável)
- ✅ **Comprovante de endereço da empresa** (máximo 3 meses)
- ✅ **CPF e RG do representante legal**
- ✅ **Procuração** (se não for o próprio representante)

### Informações Bancárias
- ✅ **Banco, agência e conta corrente** (PJ ou conta do titular MEI)
- ✅ **Comprovante bancário** (extrato ou carta do banco)

---

## 2. 🏛️ Registro da Empresa

### Opção 1: MEI (Microempreendedor Individual)

**Vantagens**: Processo rápido, baixo custo, tributação simplificada
**Limite**: Faturamento até R$ 81.000/ano

**Passo a passo**:

1. **Acesse o Portal do Empreendedor**
   ```
   URL: https://www.gov.br/empresas-e-negocios/pt-br/empreendedor
   ```

2. **Clique em "Quero ser MEI"**
   - Faça login com conta gov.br
   - Preencha dados pessoais
   - Escolha atividade: **"6201-5/00 - Desenvolvimento de programas de computador sob encomenda"**

3. **Complete o registro**
   - Confirme endereço comercial
   - Escolha se terá funcionários
   - Finalize o cadastro

4. **Baixe o CCMEI**
   - Certificado de Condição de Microempreendedor Individual
   - Guarde este documento (será necessário para o PagSeguro)

### Opção 2: LTDA (Sociedade Limitada)

**Vantagens**: Maior limite de faturamento, mais credibilidade, facilita crédito
**Processo**: Mais complexo, requer contador

**Passo a passo resumido**:

1. **Consulte viabilidade do nome**
   - Site da Junta Comercial do seu estado
   - Verificar se nome está disponível

2. **Elabore contrato social**
   - Recomendado contratar contador
   - Definir objeto social, capital, participação dos sócios

3. **Registre na Junta Comercial**
   - Submeta documentos
   - Pague taxas (varia por estado: R$ 200-500)

4. **Obtenha CNPJ**
   - Receita Federal (automático após registro)
   - Inscrição Estadual (Secretaria da Fazenda)
   - Alvará de funcionamento (Prefeitura)

---

## 3. 💳 Criação da Conta PagSeguro

### Ambiente Sandbox (Testes)

1. **Acesse o Sandbox**
   ```
   URL: https://sandbox.pagseguro.uol.com.br/
   ```

2. **Clique em "Criar Conta Vendedor"**
   - **Tela de cadastro**: Preencha com dados fictícios
   - **Email**: Use um email de teste (ex: `teste@minhaempresa.com.br`)
   - **CPF/CNPJ**: Use os geradores de teste do próprio PagSeguro

3. **Confirme o email**
   - Verifique caixa de entrada
   - Clique no link de confirmação

### Ambiente Produção

1. **Acesse o site oficial**
   ```
   URL: https://pagseguro.uol.com.br/
   ```

2. **Clique em "Quero vender online"**
   - Escolha "Pessoa Jurídica" ou "Pessoa Física"
   - Clique em "Criar conta grátis"

3. **Preencha dados iniciais**
   ```
   Tela 1: Dados básicos
   - Nome completo/Razão social
   - Email empresarial
   - Senha forte (min 8 caracteres, letras, números, símbolos)
   - Confirmar senha
   - Aceitar termos de uso
   ```

4. **Confirme o email**
   - Acesse o email cadastrado
   - Clique no link "Confirmar conta"

5. **Complete o perfil**
   ```
   Tela 2: Dados pessoais/empresariais
   - CPF/CNPJ
   - Data de nascimento/abertura
   - Telefone de contato
   - Endereço completo
   ```

**🖼️ Screenshot Description**: 
*Tela mostrando formulário do PagSeguro com campos para razão social, CNPJ, email empresarial e telefone. Interface em tons azuis com logo do PagSeguro no topo.*

---

## 4. ✅ Verificação da Conta

### Processo de Verificação

**Tempo estimado**: 2-5 dias úteis

1. **Upload de documentos**
   ```
   Acesse: Minha Conta > Dados da Conta > Verificação
   ```

2. **Documentos pessoa física (MEI)**
   - **RG ou CNH**: Frente e verso em boa qualidade
   - **CPF**: Documento ou comprovante de situação cadastral
   - **Comprovante de endereço**: Máximo 3 meses
   - **Certificado MEI**: Baixado do portal do empreendedor
   - **Comprovante bancário**: Extrato ou carta do banco

3. **Documentos pessoa jurídica**
   - **Cartão CNPJ**: Receita Federal (máximo 3 meses)
   - **Contrato social**: Última alteração registrada
   - **Comprovante de endereço**: Da empresa (máximo 3 meses)
   - **RG do representante**: Frente e verso
   - **Comprovante bancário empresarial**: Extrato ou carta

4. **Verificação bancária**
   - PagSeguro fará um depósito de R$ 0,01
   - Confirme o valor exato na plataforma
   - Processo pode levar 1-2 dias úteis

**🖼️ Screenshot Description**: 
*Interface de verificação mostrando lista de documentos com status: "Enviado", "Aprovado" ou "Pendente". Ícones verdes para aprovados, amarelos para pendentes.*

### Status da Verificação

```
✅ Aprovado: Conta verificada, pode receber pagamentos
⏳ Em análise: Aguardando revisão (1-3 dias úteis)
❌ Rejeitado: Documento com problema, verificar orientações
📄 Pendente: Documento ainda não enviado
```

---

## 5. 🔧 Configuração da API

### Criando uma Aplicação

1. **Acesse as Configurações**
   ```
   Painel PagSeguro > Integrações > Suas aplicações
   ```

2. **Crie nova aplicação**
   - **Nome**: "PlayCode Agency - Sistema de Pagamentos"
   - **Descrição**: "Sistema de cobrança recorrente para planos de desenvolvimento"
   - **URL da aplicação**: `https://suaempresa.com.br`
   - **URL de notificação**: `https://suaempresa.com.br/api/webhooks/pagseguro`

3. **Configurações da aplicação**
   ```
   ✅ Receber pagamentos
   ✅ Criar planos de assinatura
   ✅ Gerenciar assinaturas
   ✅ Receber notificações
   ```

### Obtendo as Credenciais

Após criar a aplicação, você receberá:

```javascript
// Credenciais de Sandbox
PAGSEGURO_APPLICATION_ID: "app1234567890"
PAGSEGURO_APPLICATION_KEY: "key1234567890abcdef"
PAGSEGURO_PUBLIC_KEY: "pub1234567890abcdef"

// Credenciais de Produção (após aprovação)
PAGSEGURO_APPLICATION_ID: "appPROD1234567890"
PAGSEGURO_APPLICATION_KEY: "keyPROD1234567890abcdef"
PAGSEGURO_PUBLIC_KEY: "pubPROD1234567890abcdef"
```

### Configuração no Projeto

1. **Crie arquivo `.env.local`**
   ```bash
   # PagSeguro Configuration
   NEXT_PUBLIC_PAGSEGURO_APPLICATION_ID=seu_application_id
   PAGSEGURO_APPLICATION_KEY=sua_application_key
   NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY=sua_public_key
   PAGSEGURO_WEBHOOK_SECRET=sua_chave_secreta_webhook
   
   # Environment
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   
   # PagSeguro URLs
   NEXT_PUBLIC_PAGSEGURO_API_URL=https://sandbox.api.pagseguro.com
   NEXT_PUBLIC_PAGSEGURO_JS_URL=https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js
   ```

2. **Teste as credenciais**
   ```bash
   # Execute um teste simples
   curl -X GET \
     "https://sandbox.api.pagseguro.com/public-keys/SUAS_CREDENCIAIS" \
     -H "Authorization: Bearer SEU_TOKEN"
   ```

**🖼️ Screenshot Description**: 
*Painel de aplicações do PagSeguro mostrando lista de apps criadas com botões "Editar", "Credenciais" e status "Ativa". Destaque para botão "Nova Aplicação" no canto superior direito.*

---

## 6. 🔗 Configuração de Webhooks

### O que são Webhooks

Webhooks são notificações automáticas que o PagSeguro envia para sua aplicação quando eventos importantes acontecem (pagamento aprovado, cancelado, etc.).

### Configurando no PagSeguro

1. **Acesse configurações da aplicação**
   ```
   Suas aplicações > [Nome da App] > Editar
   ```

2. **Configure a URL de notificação**
   ```
   URL de produção: https://suaempresa.com.br/api/webhooks/pagseguro
   URL de desenvolvimento: https://abc123.ngrok.io/api/webhooks/pagseguro
   ```

3. **Selecione os eventos**
   ```
   ✅ application.authorization.created
   ✅ subscription.created
   ✅ subscription.activated
   ✅ subscription.payment.success
   ✅ subscription.payment.failed
   ✅ subscription.canceled
   ✅ subscription.suspended
   ✅ payment.created
   ✅ payment.paid
   ✅ payment.canceled
   ```

### Implementação do Webhook

O webhook já está implementado no projeto em `src/app/api/webhooks/pagseguro/route.ts`, mas aqui está um resumo:

```typescript
// Estrutura básica do webhook
export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-pagseguro-signature')
    
    // 1. Verificar assinatura
    if (!verifySignature(body, signature)) {
      return new Response('Invalid signature', { status: 401 })
    }
    
    // 2. Processar evento
    const webhook = JSON.parse(body)
    await processWebhookEvent(webhook)
    
    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response('Error', { status: 500 })
  }
}
```

### Testando Webhooks Localmente

1. **Instale ngrok**
   ```bash
   # Windows
   choco install ngrok
   
   # Mac
   brew install ngrok
   
   # Linux
   sudo apt install ngrok
   ```

2. **Execute sua aplicação**
   ```bash
   npm run dev
   ```

3. **Exponha localhost com ngrok**
   ```bash
   ngrok http 3000
   ```

4. **Use a URL gerada**
   ```
   Exemplo: https://abc123.ngrok.io
   Configure no PagSeguro: https://abc123.ngrok.io/api/webhooks/pagseguro
   ```

**🖼️ Screenshot Description**: 
*Terminal mostrando output do ngrok com URL https://abc123.ngrok.io sendo encaminhada para localhost:3000. Interface do PagSeguro ao lado com campo URL de notificação preenchido.*

---

## 7. 🧪 Testes e Validação

### Dados de Teste (Sandbox)

#### Cartões de Crédito para Teste
```javascript
// Transações aprovadas
const aprovados = {
  visa: "4111111111111111",
  mastercard: "5555666677778884",
  elo: "4514160123456789",
  cvv: "123",
  validade: "12/2030"
}

// Transações negadas
const negados = {
  visa: "4000000000000002",
  mastercard: "5555555555554444",
  cvv: "123",
  validade: "12/2030"
}
```

#### Dados de Cliente para Teste
```javascript
const clienteTeste = {
  nome: "João Silva",
  email: "joao.teste@email.com",
  telefone: "(11) 99999-9999",
  cpf: "11144477735", // CPF válido de teste
  endereco: {
    rua: "Rua dos Testes, 123",
    bairro: "Centro",
    cidade: "São Paulo",
    uf: "SP",
    cep: "01234-567"
  }
}
```

### Fluxo de Teste Completo

1. **Teste de criação de plano**
   ```bash
   curl -X POST http://localhost:3000/api/payment/plans \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Plano Teste",
       "description": "Plano para testes",
       "amount": 2997,
       "frequency": "monthly"
     }'
   ```

2. **Teste de checkout**
   - Acesse: `http://localhost:3000/planos`
   - Clique em "Assinar" em qualquer plano
   - Preencha com dados de teste
   - Use cartão de teste aprovado

3. **Verificação de webhook**
   ```bash
   # Monitore os logs
   npm run dev
   
   # Em outro terminal, verifique se webhooks chegam
   tail -f logs/webhook.log
   ```

### Checklist de Validação

```
✅ Conta PagSeguro criada e verificada
✅ Aplicação criada com credenciais obtidas
✅ Variáveis de ambiente configuradas
✅ Webhook endpoint configurado
✅ Planos criados no PagSeguro
✅ Teste de pagamento com cartão aprovado
✅ Teste de pagamento com cartão negado
✅ Webhooks recebidos e processados
✅ Página de sucesso funcionando
✅ Tratamento de erros implementado
```

**🖼️ Screenshot Description**: 
*Dashboard de testes mostrando lista de transações com status "Aprovada" em verde e "Negada" em vermelho. Coluna com valores, datas e métodos de pagamento.*

---

## 8. 🔧 Solução de Problemas Comuns

### Problemas de Conta

#### ❌ "Conta não verificada"
**Solução**:
- Verifique se todos os documentos foram enviados
- Confirme que as fotos estão legíveis
- Aguarde 2-5 dias úteis para análise
- Entre em contato: atendimento@pagseguro.uol.com.br

#### ❌ "Documento rejeitado"
**Solução**:
- Foto nítida, sem reflexo ou sombra
- Documento dentro da validade
- Todas as informações visíveis
- Formato aceito: JPG, PNG (máx 5MB)

### Problemas de API

#### ❌ "401 Unauthorized"
**Soluções**:
```javascript
// Verificar credenciais
console.log('Application ID:', process.env.PAGSEGURO_APPLICATION_ID)
console.log('Application Key:', process.env.PAGSEGURO_APPLICATION_KEY)

// Verificar ambiente
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://api.pagseguro.com' 
  : 'https://sandbox.api.pagseguro.com'
```

#### ❌ "403 Forbidden"
**Soluções**:
- Verificar se aplicação está ativa
- Confirmar permissões da aplicação
- Verificar se conta está verificada

#### ❌ "Webhook não recebido"
**Soluções**:
```javascript
// 1. Verificar URL pública
const webhookURL = 'https://abc123.ngrok.io/api/webhooks/pagseguro'

// 2. Verificar se endpoint responde
curl -X POST https://abc123.ngrok.io/api/webhooks/pagseguro

// 3. Verificar logs
console.log('Webhook received:', request.headers)
```

### Problemas de Pagamento

#### ❌ "Cartão recusado" (em produção)
**Soluções**:
- Verificar dados do cartão
- Confirmar limite disponível
- Tentar outro cartão
- Verificar com banco emissor

#### ❌ "CPF inválido"
**Soluções**:
```javascript
// Validação de CPF
function validarCPF(cpf) {
  const cleaned = cpf.replace(/\D/g, '')
  if (cleaned.length !== 11) return false
  
  // Algoritmo de validação
  // ... implementação completa
}
```

### Problemas de Integração

#### ❌ "CORS Error"
**Solução**:
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ]
  },
}
```

#### ❌ "Timeout na API"
**Solução**:
```javascript
// Configurar timeout
const controller = new AbortController()
setTimeout(() => controller.abort(), 30000) // 30s

fetch(url, {
  signal: controller.signal,
  timeout: 30000
})
```

---

## 9. 🚀 Ambiente de Produção

### Preparação para Produção

1. **Validação final do sandbox**
   ```bash
   # Execute todos os testes
   npm run test:payment
   npm run test:webhook
   npm run test:integration
   ```

2. **Solicitação de credenciais de produção**
   - Acesse: Painel PagSeguro > Suas aplicações
   - Clique em "Solicitar aprovação para produção"
   - Aguarde análise (2-5 dias úteis)

3. **Configuração de produção**
   ```bash
   # .env.production
   NODE_ENV=production
   NEXT_PUBLIC_PAGSEGURO_APPLICATION_ID=prod_app_id
   PAGSEGURO_APPLICATION_KEY=prod_app_key
   NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY=prod_public_key
   NEXT_PUBLIC_APP_URL=https://suaempresa.com.br
   NEXT_PUBLIC_PAGSEGURO_API_URL=https://api.pagseguro.com
   ```

### Checklist Produção

```
✅ SSL certificado instalado (HTTPS)
✅ Domínio próprio configurado
✅ Webhook URL atualizada para produção
✅ Variáveis de ambiente de produção
✅ Monitoring/alertas configurados
✅ Backup dos dados implementado
✅ Políticas de segurança aplicadas
✅ Termos de uso e privacidade publicados
✅ Teste com cartão real (pequeno valor)
✅ Processo de reembolso documentado
```

### Monitoramento

1. **Métricas importantes**
   ```javascript
   // KPIs de pagamento
   const metrics = {
     conversionRate: 'Taxa de conversão por plano',
     averageTicket: 'Ticket médio',
     churnRate: 'Taxa de cancelamento',
     paymentFailures: 'Falhas de pagamento',
     webhookLatency: 'Latência dos webhooks'
   }
   ```

2. **Alertas recomendados**
   ```yaml
   # Alertas críticos
   payment_failures:
     threshold: "> 5% em 1 hora"
     action: "Notificar equipe técnica"
   
   webhook_failures:
     threshold: "> 3 falhas consecutivas"
     action: "Investigar imediatamente"
   
   api_latency:
     threshold: "> 5 segundos"
     action: "Verificar infraestrutura"
   ```

### Backup e Recuperação

```javascript
// Backup diário das transações
const backupTransactions = async () => {
  const transactions = await getTransactionsLastDay()
  await saveToBackup(transactions)
  await uploadToCloud(transactions)
}

// Executar diariamente às 2h
cron.schedule('0 2 * * *', backupTransactions)
```

---

## 📞 Suporte e Recursos

### Contatos PagSeguro

- **Atendimento**: 0800-740-7340
- **Email**: atendimento@pagseguro.uol.com.br
- **Chat**: Disponível no painel (8h às 20h)
- **WhatsApp**: (11) 4003-4031

### Documentação Oficial

- **API Reference**: https://dev.pagseguro.uol.com.br/reference
- **Guias**: https://dev.pagseguro.uol.com.br/docs
- **Status da API**: https://status.pagseguro.uol.com.br/
- **Simulador**: https://dev.pagseguro.uol.com.br/simulator

### Comunidade

- **GitHub**: https://github.com/pagseguro
- **Stack Overflow**: Tag `pagseguro`
- **Discord**: Comunidade de desenvolvedores PagSeguro

---

## 🎉 Conclusão

Parabéns! Você agora tem um guia completo para configurar o PagSeguro do zero. Este processo, quando seguido corretamente, resulta em uma integração robusta e confiável para receber pagamentos online.

### Próximos Passos Recomendados

1. **📊 Analytics**: Implementar Google Analytics para acompanhar conversões
2. **🔄 Dunning**: Sistema inteligente para retenção de clientes
3. **📱 App Mobile**: Versão mobile da área do cliente
4. **🤖 Chatbot**: Atendimento automatizado para dúvidas de pagamento
5. **📈 Dashboard**: Painel administrativo com métricas de negócio

### Lembre-se

- ✅ **Sempre teste no sandbox primeiro**
- ✅ **Mantenha os webhooks seguros**
- ✅ **Monitore constantemente as transações**
- ✅ **Documente todos os processos**
- ✅ **Tenha um plano de contingência**

---

**💡 Dica Final**: Este documento é vivo! Atualize-o conforme sua integração evolui e novos casos de uso surgem.

**🎮 PlayCode Agency** - Tornando os pagamentos épicos, uma transação por vez!