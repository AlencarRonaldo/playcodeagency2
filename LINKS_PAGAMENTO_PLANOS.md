# 💳 Links de Pagamento - Planos PlayCode Agency

Guia para criar e configurar links de pagamento direto no PagSeguro para cada plano da PlayCode Agency.

## 📋 Planos Configurados

### 1. 🥉 Starter Pack
**Descrição**: Para quem está começando
**Valor Setup**: R$ 797,00 (valor único)
**Valor Mensal**: R$ 197,00/mês

**Links a criar no PagSeguro**:
```
Starter Pack - Setup: R$ 797,00 (pagamento único)
Starter Pack - Mensal: R$ 197,00 (recorrente mensal)
Starter Pack - Anual: R$ 1.970,00 (recorrente anual com 20% desconto)
```

### 2. 🥈 Pro Guild
**Descrição**: Para negócios em crescimento
**Valor Setup**: R$ 2.497,00 (valor único)
**Valor Mensal**: R$ 497,00/mês

**Links a criar no PagSeguro**:
```
Pro Guild - Setup: R$ 2.497,00 (pagamento único)
Pro Guild - Mensal: R$ 497,00 (recorrente mensal)
Pro Guild - Anual: R$ 4.970,00 (recorrente anual com 25% desconto)
```

### 3. 🥇 Elite Force (Epic)
**Descrição**: Para empresas estabelecidas
**Valor**: R$ 7.500,00/mês

**Links a criar no PagSeguro**:
```
Elite Force - Mensal: R$ 7.500,00 (recorrente mensal)
Elite Force - Anual: R$ 75.000,00 (recorrente anual)
```

### 4. 👑 Legendary Tier
**Descrição**: Para visionários digitais
**Valor**: CONSULTAR (WhatsApp configurado)

**Ação**: Não precisa criar links - já configurado para WhatsApp

## 🔧 Como Criar os Links no PagSeguro

### Passo 1: Acesse o Painel PagSeguro
```
URL: https://pagseguro.uol.com.br/
Faça login com sua conta empresarial
```

### Passo 2: Navegue para Links de Pagamento
```
Menu: Vender > Link de Pagamento
Ou: Ferramentas > Links de Pagamento
```

### Passo 3: Configure Cada Link

#### Para Pagamentos Únicos (Setup):
```yaml
Tipo: Pagamento único
Título: "[Nome do Plano] - Setup Fee"
Descrição: "Taxa de configuração inicial do plano [Nome]"
Valor: [Valor conforme tabela]
Referência: "SETUP_[PLANO_ID]_001"
Válido até: Sem expiração
```

#### Para Assinaturas Mensais:
```yaml
Tipo: Assinatura/Recorrente
Título: "[Nome do Plano] - Assinatura Mensal"
Descrição: "Assinatura mensal do plano [Nome]"
Valor: [Valor conforme tabela]
Frequência: Mensal
Referência: "MONTHLY_[PLANO_ID]_001"
Válido até: Sem expiração
```

#### Para Assinaturas Anuais:
```yaml
Tipo: Assinatura/Recorrente
Título: "[Nome do Plano] - Assinatura Anual"
Descrição: "Assinatura anual do plano [Nome] com desconto"
Valor: [Valor com desconto conforme tabela]
Frequência: Anual
Referência: "YEARLY_[PLANO_ID]_001"
Válido até: Sem expiração
```

### Passo 4: Configurações Adicionais
```yaml
Formas de Pagamento:
✅ Cartão de crédito (até 12x)
✅ Boleto bancário
✅ PIX
✅ Débito online

Notificações:
✅ Email para cliente
✅ Webhook: https://suaempresa.com.br/api/webhooks/pagseguro

Campos personalizados:
✅ Nome completo
✅ CPF/CNPJ
✅ Telefone
✅ Endereço completo
```

## 📝 Exemplo de Links Criados

Após criar no PagSeguro, você receberá URLs como:

```
# Starter Pack
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=STARTER_MONTHLY_001
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=STARTER_YEARLY_001

# Pro Guild
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=PRO_MONTHLY_001
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=PRO_YEARLY_001

# Elite Force
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=ELITE_MONTHLY_001
https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=ELITE_YEARLY_001
```

## 🔄 Como Atualizar no Código

Após criar os links, atualize o arquivo `src/app/planos/page.tsx`:

```typescript
// Starter Pack
payment_links: {
  monthly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=STARTER_MONTHLY_001',
  yearly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=STARTER_YEARLY_001'
}

// Pro Guild
payment_links: {
  monthly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=PRO_MONTHLY_001',
  yearly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=PRO_YEARLY_001'
}

// Elite Force
payment_links: {
  monthly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=ELITE_MONTHLY_001',
  yearly: 'https://pagseguro.uol.com.br/checkout/payment/direct-payment.jhtml?code=ELITE_YEARLY_001'
}
```

## 🎯 Como Funciona no Sistema

### Fluxo Otimizado:
1. **Cliente escolhe plano** na página `/planos`
2. **Sistema verifica** se existe `payment_links` para o ciclo selecionado
3. **Se existe link**: Redireciona direto para PagSeguro
4. **Se não existe**: Abre modal de checkout atual (fallback)
5. **Legendary**: Sempre abre WhatsApp para consulta

### Vantagens:
- ✅ **Checkout mais rápido** - menos cliques
- ✅ **Menos abandono** - direto ao pagamento
- ✅ **Rastreamento melhor** - cada plano tem ID único
- ✅ **Fallback seguro** - modal como backup
- ✅ **Flexibilidade** - pode atualizar links sem código

## 📊 Monitoramento

### Métricas a Acompanhar:
```
- Taxa de conversão por plano
- Tempo médio até pagamento
- Método de pagamento preferido
- Taxa de abandono no checkout
- Recorrência de assinaturas
```

### Relatórios PagSeguro:
```
- Vendas > Relatórios de Vendas
- Assinaturas > Relatórios de Recorrência
- Analytics > Funil de Conversão
```

## 🚀 Colocando em Produção

### Checklist Final:
```
✅ Todos os links criados no PagSeguro
✅ Links testados em ambiente sandbox
✅ Código atualizado com URLs reais
✅ Webhooks configurados
✅ Notificações testadas
✅ Deploy realizado
✅ Teste em produção
✅ Monitoramento ativo
```

## 📞 Suporte

Em caso de dúvidas:
- **Email**: dev@playcodeagency.xyz
- **WhatsApp**: (11) 95653-4963
- **PagSeguro**: 0800-740-7340

---

🎮 **PlayCode Agency** - Facilitando pagamentos, maximizando conversões!