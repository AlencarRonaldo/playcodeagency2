# 💳 Integração PagSeguro - PlayCode Agency

Sistema completo de pagamentos recorrentes integrado ao PagSeguro para cobrança dos planos da PlayCode Agency.

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Pagamentos
- ✅ Cobrança recorrente de planos (mensal/anual)
- ✅ Taxa de setup única
- ✅ Múltiplas formas de pagamento (Cartão, Boleto, PIX)
- ✅ Desconto para pagamento anual
- ✅ Período de teste gratuito (7 dias para Starter Pack)
- ✅ Webhooks para atualizações automáticas de status

### ✅ Interface de Checkout
- ✅ Modal de checkout integrado na página de planos
- ✅ Validação completa de dados do cliente
- ✅ Formulário de cartão de crédito seguro
- ✅ Página de sucesso personalizada
- ✅ Tratamento de erros e fallbacks

### ✅ Estrutura Backend
- ✅ APIs para criação de planos e assinaturas
- ✅ Sistema de webhooks para processamento automático
- ✅ Validação de assinatura dos webhooks
- ✅ Logging e tratamento de erros

## 🔧 Configuração

### 1. Credenciais do PagSeguro

1. **Acesse o painel do PagSeguro**: https://sandbox.pagseguro.uol.com.br/ (sandbox) ou https://pagseguro.uol.com.br/ (produção)

2. **Crie uma aplicação** e obtenha as credenciais:
   - Application ID
   - Application Key  
   - Public Key

3. **Configure as variáveis de ambiente** no arquivo `.env.local`:

```bash
# PagSeguro Configuration
NEXT_PUBLIC_PAGSEGURO_APPLICATION_ID=your_application_id_here
PAGSEGURO_APPLICATION_KEY=your_application_key_here
NEXT_PUBLIC_PAGSEGURO_PUBLIC_KEY=your_public_key_here
PAGSEGURO_WEBHOOK_SECRET=your_webhook_secret_here

# Base URL (importante para webhooks)
NEXT_PUBLIC_APP_URL=https://sua-aplicacao.com
```

### 2. Configuração de Webhooks

1. **No painel do PagSeguro**, configure o webhook endpoint:
   ```
   https://sua-aplicacao.com/api/webhooks/pagseguro
   ```

2. **Eventos que o webhook deve escutar**:
   - `SUBSCRIPTION_CREATED`
   - `SUBSCRIPTION_ACTIVATED`
   - `SUBSCRIPTION_PAYMENT_SUCCESS`
   - `SUBSCRIPTION_PAYMENT_FAILED`
   - `SUBSCRIPTION_CANCELED`

### 3. Criação dos Planos no PagSeguro

Execute o comando para criar os planos automaticamente:

```bash
curl -X POST http://localhost:3000/api/payment/plans/create \
  -H "Content-Type: application/json" \
  -d '{
    "plan_ids": ["starter-pack", "pro-guild", "enterprise-legend"]
  }'
```

## 📋 Planos Configurados

### 🥉 Starter Pack (R$ 797 setup + R$ 197/mês)
- **Rarity**: Rare
- **Trial**: 7 dias gratuitos
- **Recursos**: 3 projetos, suporte básico, hospedagem
- **Desconto anual**: 20%

### 🥈 Pro Guild (R$ 2.497 setup + R$ 497/mês) - POPULAR
- **Rarity**: Epic  
- **Recursos**: 10 projetos, suporte prioritário, e-commerce
- **Desconto anual**: 25%

### 🥇 Enterprise Legend (R$ 9.997 setup + R$ 1.997/mês)
- **Rarity**: Legendary
- **Recursos**: Projetos ilimitados, suporte dedicado, recursos enterprise
- **Desconto anual**: 30%

## 🚀 Como Usar

### 1. Fluxo do Cliente

1. **Cliente acessa `/planos`**
2. **Seleciona um plano** → Abre modal de checkout
3. **Preenche dados pessoais** (nome, email, telefone, CPF/CNPJ)
4. **Escolhe forma de pagamento** (cartão, boleto ou PIX)
5. **Revisa e confirma** → Aceita termos de uso
6. **É redirecionado para PagSeguro** para finalizar pagamento
7. **Volta para página de sucesso** com confirmação

### 2. Fluxo Backend

1. **API `/api/payment/checkout`** cria assinatura no PagSeguro
2. **Webhook `/api/webhooks/pagseguro`** recebe atualizações
3. **Sistema processa eventos** e atualiza status interno
4. **Cliente recebe notificações** por email

## 🔐 Segurança

### Validação de Webhooks
```typescript
// Verificação de assinatura HMAC-SHA256
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}
```

### Validação de Dados
- ✅ Sanitização de inputs do cliente
- ✅ Validação de CPF/CNPJ
- ✅ Validação de cartão de crédito (lado cliente)
- ✅ Verificação de domínio de email

## 📊 Monitoramento

### Logs de Pagamento
```typescript
// Todos os eventos são logados com contexto completo
console.log('Payment processed:', {
  subscription_id: webhook.data.subscription.id,
  customer_email: webhook.data.subscription.customer_id,
  amount: webhook.data.payment?.amount,
  status: webhook.data.payment?.status
})
```

### Métricas de Conversão
- Tracking de cada etapa do checkout
- Abandono por etapa do funil
- Taxa de conversão por plano
- Tempo médio de checkout

## 🛠️ Desenvolvimento

### Estrutura de Arquivos
```
src/
├── lib/payments/
│   ├── types.ts              # Tipos TypeScript
│   ├── pagseguro-client.ts   # Cliente da API
│   └── plans-config.ts       # Configuração dos planos
├── components/payment/
│   └── CheckoutModal.tsx     # Modal de checkout
├── app/api/payment/
│   ├── plans/route.ts        # Gestão de planos
│   └── checkout/route.ts     # Criação de assinaturas
├── app/api/webhooks/
│   └── pagseguro/route.ts    # Processamento de webhooks
└── app/checkout/
    └── success/page.tsx      # Página de sucesso
```

### Testando Localmente

1. **Use ngrok** para expor localhost:
   ```bash
   ngrok http 3000
   ```

2. **Configure webhook URL** no PagSeguro:
   ```
   https://abc123.ngrok.io/api/webhooks/pagseguro
   ```

3. **Teste com cartões sandbox**:
   - **Aprovado**: 4111111111111111
   - **Negado**: 4000000000000002

## 🔄 Próximos Passos

### Melhorias Futuras
- [ ] **Dashboard de Assinaturas**: Painel para clientes gerenciarem suas assinaturas
- [ ] **Dunning Management**: Cobrança inteligente para pagamentos falhados
- [ ] **Planos Customizados**: Criação dinâmica de planos personalizados
- [ ] **Relatórios Avançados**: Dashboard de métricas financeiras
- [ ] **Multi-tenant**: Suporte a multiple organizações
- [ ] **API de Faturas**: Geração automática de faturas e recibos

### Integrações Adicionais
- [ ] **Stripe**: Alternativa internacional
- [ ] **Mercado Pago**: Opção para marketplace
- [ ] **PIX Automático**: Cobrança via PIX recorrente
- [ ] **Boleto Registrado**: Melhor rastreamento de boletos

## 📞 Suporte

Para dúvidas sobre a implementação:
- **Email**: dev@playcodeagency.xyz
- **WhatsApp**: (11) 95653-4963
- **Documentação PagSeguro**: https://dev.pagseguro.uol.com.br/

---

💡 **Dica**: Sempre teste no ambiente sandbox antes de colocar em produção!

🎮 **PlayCode Agency** - Transformando pagamentos em experiência épica!