# ✅ Checklist Deploy Hostinger - PlayCode Agency

## 📋 Pré-Deploy

### 1. Preparação do Projeto
- [ ] Código testado localmente (`npm run dev`)
- [ ] Build funcionando (`npm run build`)
- [ ] Sem erros de TypeScript/ESLint
- [ ] Formulário de contato testado
- [ ] Todas as páginas funcionando

### 2. Configuração Hostinger
- [ ] Conta Hostinger ativa (Premium/Business)
- [ ] Domínio configurado e propagado
- [ ] SSL/TLS ativado
- [ ] Email criado (contato@seudominio.com)

## 🚀 Deploy

### 3. Build para Produção
```bash
# Execute no terminal:
npm run hostinger:build
```
- [ ] Build gerado sem erros
- [ ] Pasta `out/` criada
- [ ] Arquivo zip criado automaticamente

### 4. Upload para Hostinger
- [ ] Login no hPanel
- [ ] Acessar File Manager
- [ ] Entrar em `public_html/`
- [ ] Upload do arquivo zip
- [ ] Extrair arquivo na pasta raiz
- [ ] Copiar `.htaccess` da pasta docs/deploy/

### 5. Configuração Final
- [ ] Arquivo `.htaccess` copiado para `public_html/`
- [ ] Permissões corretas (644 para arquivos, 755 para pastas)
- [ ] Configurar email SMTP no código
- [ ] Testar domínio principal

## 🔍 Testes Pós-Deploy

### 6. Verificações Funcionais
- [ ] Site carrega: `https://seudominio.com` ✅
- [ ] HTTPS ativo (certificado SSL) ✅
- [ ] Todas as páginas acessíveis:
  - [ ] Início (/)
  - [ ] Sobre (/sobre)
  - [ ] Serviços (/servicos)  
  - [ ] Portfólio (/portfolio)
  - [ ] Planos (/planos)
  - [ ] Combos (/combos)
  - [ ] Contato (/contato)

### 7. Verificações Técnicas
- [ ] CSS carregando corretamente ✅
- [ ] JavaScript funcionando ✅
- [ ] Imagens carregando ✅
- [ ] Animações funcionando ✅
- [ ] Responsivo mobile ✅
- [ ] Formulário enviando emails ✅

### 8. Performance e SEO
- [ ] PageSpeed > 80: https://pagespeed.web.dev/
- [ ] GTmetrix Grade A: https://gtmetrix.com/
- [ ] SSL Grade A: https://www.ssllabs.com/ssltest/
- [ ] Meta tags carregando
- [ ] Open Graph funcionando

## 🛠️ Configurações Específicas

### 9. Email (Hostinger SMTP)
```typescript
// src/lib/services/email.ts
host: 'smtp.hostinger.com'
port: 587
user: 'contato@seudominio.com'
pass: 'sua_senha_email'
```
- [ ] SMTP configurado
- [ ] Email de teste enviado
- [ ] Formulário recebendo emails

### 10. Domínio e DNS
```
A Record: @ → IP_HOSTINGER
CNAME: www → seudominio.com
```
- [ ] DNS propagado (24-48h)
- [ ] www. redirecionando para domínio principal
- [ ] HTTPS forçado (.htaccess)

## 🚨 Troubleshooting

### Problemas Comuns

**Site não carrega:**
- [ ] Verificar se arquivos estão em `public_html/` (não em subpasta)
- [ ] Verificar se `index.html` existe na raiz
- [ ] Verificar DNS e propagação

**CSS/JS não carrega:**
- [ ] Verificar se `output: 'export'` está no next.config.ts
- [ ] Verificar se `images: { unoptimized: true }`
- [ ] Limpar cache do navegador

**Formulário não funciona:**
- [ ] Verificar configurações SMTP
- [ ] Testar email manualmente no hPanel
- [ ] Verificar logs de erro

**Velocidade lenta:**
- [ ] Verificar se `.htaccess` está ativo
- [ ] Verificar compressão GZIP
- [ ] Otimizar imagens

## 📞 Suporte

### Hostinger
- **Chat:** 24/7 no hPanel
- **Ticket:** Através do painel
- **KB:** https://support.hostinger.com

### PlayCode Agency
- **Desenvolvedor:** Verificar logs do sistema
- **Email:** Testar SMTP manualmente
- **Performance:** Usar ferramentas de análise

---

## ✅ Deploy Completo!

**Site no ar:** `https://seudominio.com`  
**Status:** 🟢 Funcionando  
**Performance:** 🟢 Otimizada  
**Email:** 🟢 Configurado  

**Data do deploy:** ___________  
**Responsável:** ___________