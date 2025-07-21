# CRM Configuration Guide - PlayCode Agency

## Overview

O sistema PlayCode Agency suporta integração opcional com CRMs para gerenciamento automático de leads. Por padrão, o sistema funciona **sem CRM** e salva os contatos localmente.

## Status Atual

✅ **Sistema funcional sem CRM**  
ℹ️ **CRM é opcional** - pode ser habilitado quando necessário  
🔧 **Configuração simples** - apenas variáveis de ambiente  

## Como Funciona Sem CRM

Quando não há CRM configurado:
- Formulários de contato funcionam normalmente
- Dados são logados no console (para desenvolvimento)
- Mensagem de sucesso é exibida ao usuário
- Não há erros ou falhas no sistema
- Performance otimizada (sem chamadas externas)

## Logs do Sistema

### Sem CRM Configurado (Normal):
```
ℹ️ CRM provider not configured - running without CRM integration
ℹ️ CRM not configured - lead saved locally only
💾 Contact would be saved to database: { name, email, ... }
```

### Com CRM Configurado e Funcionando:
```
✅ HubSpot CRM initialized successfully
✅ Lead synced to CRM: { id: "12345", ... }
```

### Com CRM Configurado mas com Erro:
```
❌ CRM sync failed: Invalid API key
❌ Failed to initialize HubSpot CRM
```

## Configuração do CRM (Opcional)

### 1. HubSpot

Para habilitar integração com HubSpot:

**1.1. Obter Credenciais:**
- Acesse [HubSpot Developers](https://developers.hubspot.com/)
- Crie uma app privada ou use uma existente
- Copie o `API Key` e `Portal ID`

**1.2. Configurar Variáveis de Ambiente:**

Edite o arquivo `.env.local`:

```env
# CRM Configuration
CRM_PROVIDER=hubspot
HUBSPOT_API_KEY=seu_api_key_aqui
HUBSPOT_PORTAL_ID=seu_portal_id_aqui
```

**1.3. Reiniciar o Servidor:**
```bash
npm run dev
```

## Estrutura dos Dados

### Lead Enviado para CRM:
```typescript
{
  id: "lead_1640995200000",
  email: "cliente@email.com",
  name: "Nome do Cliente",
  phone: "+5511999999999",
  company: "Empresa Ltda",
  leadScore: 0,
  playerLevel: "new_player",
  achievements: ["first_contact"],
  powerUps: ["website", "seo"],
  projectType: "custom",
  budgetRange: "custom",
  urgency: "normal",
  message: "Mensagem do cliente...",
  source: "website",
  campaign: "organic",
  createdAt: "2023-01-01T00:00:00.000Z",
  updatedAt: "2023-01-01T00:00:00.000Z",
  syncStatus: "pending"
}
```

## Monitoramento

### Logs de Desenvolvimento:
```bash
npm run dev
# Acompanhe os logs no terminal
```

### Verificar Status do CRM:
1. Acesse o formulário de contato
2. Envie um teste
3. Verifique os logs no terminal
4. Confirme no CRM se o lead foi criado

## Troubleshooting

### Problema: "CRM sync failed: No CRM provider configured"
**Solução:** Normal quando CRM não está configurado. Sistema funciona corretamente.

### Problema: "Failed to initialize HubSpot CRM"
**Possíveis causas:**
- API Key inválida
- Portal ID incorreto
- Rede/firewall bloqueando HubSpot
- Permissões insuficientes na API key

**Soluções:**
1. Verificar credenciais no HubSpot
2. Testar API key em ferramentas como Postman
3. Verificar permissões da API key
4. Verificar conectividade de rede

### Problema: "CRM sync error: timeout"
**Solução:** Problema temporário de rede. Sistema salva localmente e continua funcionando.

## Adicionando Novos CRMs

Para adicionar suporte a outros CRMs (Salesforce, Pipedrive, RD Station):

1. Criar adapter em `src/lib/crm/providers/`
2. Implementar interface `CRMAdapter`
3. Adicionar switch case no `CRMManager`
4. Adicionar variáveis de ambiente
5. Documentar configuração

## Desenvolvimento

### Testando Localmente:
```bash
# Sem CRM (padrão)
npm run dev

# Com CRM de teste
CRM_PROVIDER=hubspot npm run dev
```

### Arquivo de Teste:
Criar `.env.test` para testes:
```env
CRM_PROVIDER=mock
MOCK_CRM_DELAY=1000
```

## Conclusão

O sistema PlayCode Agency é robusto e funciona perfeitamente **com ou sem CRM**:

✅ **Sem CRM**: Funcionamento normal, logs informativos  
✅ **Com CRM**: Sincronização automática de leads  
✅ **Falha do CRM**: Sistema continua funcionando  
✅ **Performance**: Otimizada para ambos os cenários  

---

*Guia atualizado em janeiro de 2025*