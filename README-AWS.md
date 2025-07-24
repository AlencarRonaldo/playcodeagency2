# PlayCode Agency - Guia de Deploy AWS Amplify

## 🚀 Configuração Rápida (10 minutos)

### Pré-requisitos
- Conta AWS (Cadastro gratuito em [aws.amazon.com](https://aws.amazon.com))
- Repositório GitHub com o código

### Passo 1: Acesso ao AWS Amplify
1. Acesse [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Clique em **"New app"** → **"Host web app"**

### Passo 2: Conectar Repositório
1. Selecione **GitHub**
2. Autorize o acesso ao GitHub
3. Escolha este repositório: `AlencarRonaldo/playcodeagency2`
4. Branch: `main` ou `master`

### Passo 3: Configurações de Build
O Amplify detecta automaticamente Next.js. Confirme as configurações:

```yaml
# Build settings (já configurado no amplify.yml)
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
```

### Passo 4: Variáveis de Ambiente
Adicione no painel do Amplify:
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### Passo 5: Deploy
- Clique em **"Save and deploy"**
- Aguarde 3-5 minutos
- Sua app estará online!

## 🌐 Configurar Domínio Personalizado

### Opção 1: Domínio Existente
1. No painel Amplify → **"Domain management"**
2. **"Add domain"**
3. Digite seu domínio (ex: `playcodeagency.com.br`)
4. Siga as instruções para configurar DNS

### Opção 2: Registrar Novo Domínio
1. AWS Route 53 → **"Registered domains"**
2. **"Register domain"**
3. Escolha domínio disponível
4. Configure automaticamente no Amplify

## ⚙️ Configurações Avançadas

### SSL/HTTPS
- ✅ **Automático** - Amplify configura SSL gratuito
- ✅ **Renovação automática**
- ✅ **Redirect HTTP → HTTPS**

### CDN Global
- ✅ **CloudFront** integrado
- ✅ **Cache otimizado** para Next.js
- ✅ **Compressão Gzip/Brotli**

### CI/CD Automático
- ✅ **Deploy automático** a cada push
- ✅ **Preview builds** para Pull Requests
- ✅ **Rollback** com um clique

## 📊 Monitoramento

### Métricas Disponíveis
- **Visitors**: Visitantes únicos
- **Page views**: Visualizações de página
- **Data transfer**: Transferência de dados
- **Build time**: Tempo de build

### Alertas
Configure alertas para:
- **Builds falhando**
- **Alto uso de banda**
- **Erros 4xx/5xx**

## 💰 Estimativa de Custos

### Tier Gratuito (12 meses)
- **Build minutes**: 1.000/mês
- **Data served**: 15 GB/mês
- **Data stored**: 5 GB
- **Requests**: 1 milhão/mês

### Custos Após Tier Gratuito
| Recurso | Preço |
|---------|-------|
| Build minutes | $0.01/minuto |
| Data served | $0.15/GB |
| Data stored | $0.023/GB/mês |
| Requests | $0.20/1M requests |

**Estimativa para 10.000 visitantes/mês: $15-30**

## 🔧 Solução de Problemas

### Build Falha
```bash
# Testar build localmente
npm run build

# Verificar logs no console Amplify
# Verificar versões Node.js (18+)
```

### Variáveis de Ambiente
- Adicione no painel Amplify, não no código
- Reinicie build após adicionar variáveis
- Use `process.env.VARIABLE_NAME`

### Cache Issues
- CloudFront cache: 24h para assets estáticos
- Force refresh: Ctrl+F5 ou Cmd+Shift+R
- Invalidate cache no console CloudFront

## 🚀 Próximos Passos

### Performance
1. **Lighthouse audit** para otimizações
2. **Image optimization** com Next.js Image
3. **Bundle analysis** com `@next/bundle-analyzer`

### Monitoramento
1. **AWS CloudWatch** para métricas detalhadas
2. **Real User Monitoring** com Amplify
3. **Error tracking** com Sentry

### Escalabilidade
- **Auto-scaling** automático
- **Edge locations** globais
- **DDoS protection** incluída

## 📞 Suporte

### Documentação
- [AWS Amplify Docs](https://docs.amplify.aws/)
- [Next.js on Amplify](https://docs.amplify.aws/guides/hosting/nextjs/)

### Comunidade
- [AWS Discord](https://discord.gg/aws)
- [Amplify GitHub](https://github.com/aws-amplify)

---

**🎯 Deploy Completo em 10 minutos!**