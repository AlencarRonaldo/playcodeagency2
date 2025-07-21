# 🎮 Configuração dos Power-ups no PagSeguro

Guia para criar e configurar links de pagamento direto para cada power-up na plataforma PagSeguro.

## 📋 Power-ups Configurados

### 1. Chatbot Premium - R$ 1.500,00
**ID de Referência**: `CHATBOT_PREMIUM_001`
**Descrição**: IA avançada com processamento de linguagem natural

### 2. SEO Turbo Boost - R$ 2.000,00
**ID de Referência**: `SEO_BOOST_001`
**Descrição**: Otimização avançada e campanha de conteúdo

### 3. Mobile App - R$ 8.000,00
**ID de Referência**: `MOBILE_APP_001`
**Descrição**: Aplicativo nativo para iOS e Android

### 4. Suporte Prioritário - R$ 800,00
**ID de Referência**: `PRIORITY_SUPPORT_001`
**Descrição**: Atendimento VIP com resposta em 1 hora

### 5. Analytics Pro - R$ 1.200,00
**ID de Referência**: `ANALYTICS_PRO_001`
**Descrição**: Dashboards personalizados e relatórios avançados

## 🔧 Como Configurar no PagSeguro

### Opção 1: Pagamento Único (Recomendado)

1. **Acesse o Painel PagSeguro**
   ```
   https://pagseguro.uol.com.br/
   ```

2. **Navegue para "Vender" > "Link de Pagamento"**

3. **Configure cada power-up:**

   **Para Chatbot Premium:**
   ```
   Título: Chatbot Premium - PlayCode Agency
   Descrição: IA avançada com processamento de linguagem natural
   Valor: R$ 1.500,00
   Referência: CHATBOT_PREMIUM_001
   Tipo: Pagamento único
   Válido até: [sem expiração]
   ```

   **Para SEO Turbo Boost:**
   ```
   Título: SEO Turbo Boost - PlayCode Agency
   Descrição: Otimização avançada e campanha de conteúdo
   Valor: R$ 2.000,00
   Referência: SEO_BOOST_001
   Tipo: Pagamento único
   Válido até: [sem expiração]
   ```

   **Para Mobile App:**
   ```
   Título: Mobile App - PlayCode Agency
   Descrição: Aplicativo nativo para iOS e Android
   Valor: R$ 8.000,00
   Referência: MOBILE_APP_001
   Tipo: Pagamento único
   Válido até: [sem expiração]
   ```

   **Para Suporte Prioritário:**
   ```
   Título: Suporte Prioritário - PlayCode Agency
   Descrição: Atendimento VIP com resposta em 1 hora
   Valor: R$ 800,00
   Referência: PRIORITY_SUPPORT_001
   Tipo: Pagamento único
   Válido até: [sem expiração]
   ```

   **Para Analytics Pro:**
   ```
   Título: Analytics Pro - PlayCode Agency
   Descrição: Dashboards personalizados e relatórios avançados
   Valor: R$ 1.200,00
   Referência: ANALYTICS_PRO_001
   Tipo: Pagamento único
   Válido até: [sem expiração]
   ```

4. **Configurações Adicionais:**
   ```
   ✅ Permitir cartão de crédito
   ✅ Permitir boleto bancário
   ✅ Permitir PIX
   ✅ Permitir parcelamento (até 12x sem juros)
   
   📧 Email de confirmação: Habilitado
   🔔 Notificações webhook: https://suaempresa.com.br/api/webhooks/pagseguro
   ```

### Opção 2: API de Checkout (Avançado)

Se preferir integração programática:

```javascript
// Exemplo de criação via API
const paymentData = {
  reference_id: "CHATBOT_PREMIUM_001",
  description: "Chatbot Premium - PlayCode Agency",
  amount: {
    value: 150000, // R$ 1.500,00 em centavos
    currency: "BRL"
  },
  payment_methods: [
    { type: "CREDIT_CARD" },
    { type: "BOLETO" },
    { type: "PIX" }
  ],
  notification_urls: [
    "https://suaempresa.com.br/api/webhooks/pagseguro"
  ]
}
```

## 🔄 Atualizando os Links no Código

Após criar os links no PagSeguro, atualize os URLs no arquivo:
`src/app/planos/page.tsx`

```typescript
const ADD_ONS: AddOn[] = [
  {
    id: 'chatbot-premium',
    name: 'Chatbot Premium',
    // ... outras propriedades
    payment_link: 'COLE_AQUI_O_LINK_DO_PAGSEGURO_CHATBOT'
  },
  {
    id: 'seo-boost',
    name: 'SEO Turbo Boost',
    // ... outras propriedades
    payment_link: 'COLE_AQUI_O_LINK_DO_PAGSEGURO_SEO'
  },
  // ... outros power-ups
]
```

## 📊 Monitoramento e Análise

### Webhooks Configurados
Os webhooks já estão configurados para processar automaticamente:
- ✅ Pagamentos aprovados
- ✅ Pagamentos cancelados
- ✅ Estornos
- ✅ Disputas

### Analytics Automático
Cada clique nos power-ups é rastreado automaticamente:
```javascript
trackingHelpers.trackPurchase({
  plan_id: addon.id,
  amount: addon.price,
  currency: 'BRL',
  billing_cycle: 'one-time'
})
```

## 🎯 URLs de Exemplo (Sandbox)

Para testes, os seguintes URLs de sandbox estão configurados:

```
Chatbot Premium:
https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=CHATBOT_PREMIUM_001

SEO Turbo Boost:
https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=SEO_BOOST_001

Mobile App:
https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=MOBILE_APP_001

Suporte Prioritário:
https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=PRIORITY_SUPPORT_001

Analytics Pro:
https://sandbox.pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=ANALYTICS_PRO_001
```

## 🚀 Colocando em Produção

1. **Teste todos os links** no ambiente sandbox
2. **Crie os links reais** no ambiente de produção
3. **Atualize os URLs** no código
4. **Faça deploy** da aplicação
5. **Teste** cada power-up em produção

## 📞 Suporte

Em caso de dúvidas na configuração:
- **Email**: dev@playcodeagency.xyz
- **WhatsApp**: (11) 95653-4963
- **Documentação PagSeguro**: https://dev.pagseguro.uol.com.br/

---

🎮 **PlayCode Agency** - Power-ups que fazem a diferença!