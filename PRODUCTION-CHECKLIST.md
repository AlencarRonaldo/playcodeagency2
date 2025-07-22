# ✅ Production Checklist - PlayCode Agency

## 🚀 **Deploy Rápido (Vercel - Recomendado)**

### **Pré-Requisitos**
- [ ] Conta GitHub ativa
- [ ] Conta Vercel conectada ao GitHub
- [ ] Email SMTP configurado

### **Passos (5 minutos)**

1. **📂 Commit e Push**
   ```bash
   git add .
   git commit -m "🚀 Production ready"
   git push origin main
   ```

2. **🌐 Vercel Deploy**
   - Acesse: https://vercel.com/dashboard
   - Import → Selecione repositório
   - Deploy automático

3. **⚙️ Variáveis de Ambiente**
   ```bash
   NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
   NODE_ENV=production
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=contato@playcodeagency.xyz
   SMTP_PASS=sua_senha
   SMTP_FROM=contato@playcodeagency.xyz
   TOKEN_SECRET_KEY=sua_chave_256_bits
   ADMIN_APPROVAL_TOKEN=seu_token_admin
   ```

4. **🧪 Testar**
   - [ ] Site carrega: `https://seu-dominio.vercel.app`
   - [ ] Formulário envia email
   - [ ] Admin funciona: `/admin`

---

## 🔧 **Configurações de Segurança**

### **Chaves de Produção (IMPORTANTES)**
```bash
# Gerar novas chaves (NUNCA use as de desenvolvimento)
openssl rand -hex 32  # TOKEN_SECRET_KEY
openssl rand -hex 16  # ADMIN_APPROVAL_TOKEN
```

### **Rate Limiting**
- ✅ **Já configurado**: 3 tentativas por 15 min
- ✅ **Anti-bot**: Honeypot fields
- ✅ **IP blocking**: IPs suspeitos bloqueados

### **Headers de Segurança**
- ✅ **CSP**: Content Security Policy
- ✅ **HSTS**: HTTPS obrigatório
- ✅ **X-Frame-Options**: Anti-clickjacking
- ✅ **XSS Protection**: Habilitado

---

## 📊 **Validação Pós-Deploy**

### **Checklist Funcional**
- [ ] **Home** (`/`) carrega sem erros
- [ ] **Sobre** (`/sobre`) informações corretas
- [ ] **Serviços** (`/servicos`) lista completa
- [ ] **Portfólio** (`/portfolio`) cases carregam
- [ ] **Planos** (`/planos`) preços atualizados
- [ ] **Combos** (`/combos`) stacks disponíveis
- [ ] **Contato** (`/contato`) formulário funciona
- [ ] **Admin** (`/admin`) painel acessível
- [ ] **Email** template gamificado chega
- [ ] **Áudio** synthesizer funciona
- [ ] **Mobile** responsivo em todos os devices

### **Performance**
- [ ] **PageSpeed** > 90 (https://pagespeed.web.dev)
- [ ] **Core Web Vitals** verdes
- [ ] **Loading** < 3s em 3G
- [ ] **Images** otimizadas

### **SEO**
- [ ] **Meta tags** presentes
- [ ] **Schema.org** structured data
- [ ] **Sitemap** acessível
- [ ] **Robots.txt** configurado

---

## 🚨 **Troubleshooting Comum**

### **Build Fails**
```bash
# Limpar e tentar novamente
rm -rf .next node_modules/.cache
npm ci
npm run build
```

### **Emails Não Funcionam**
1. Verificar configurações SMTP na Vercel
2. Testar credenciais no terminal:
   ```bash
   curl -X POST https://seu-site.vercel.app/api/contact \
        -H "Content-Type: application/json" \
        -d '{"name":"Test","email":"test@test.com","project_type":"website","message":"Test"}'
   ```

### **Performance Issues**
1. Verificar se `unoptimized: false` no next.config.ts
2. Conferir se imagens estão otimizadas
3. Analisar bundle: `npm run analyze`

### **Hydration Errors**
1. Verificar components client-side
2. Confirmar useEffect dependencies
3. Validar SSR/CSR consistency

---

## 🎯 **Comandos Rápidos**

### **Deploy Local Test**
```bash
./scripts/deploy.sh test
```

### **Deploy Vercel**
```bash
./scripts/deploy.sh vercel
```

### **Health Check**
```bash
curl -f https://seu-dominio.vercel.app/api/health || echo "Health check failed"
```

---

## 📱 **Contatos de Emergência**

### **Suporte Técnico**
- **Email**: contato@playcodeagency.xyz
- **WhatsApp**: +55 11 95653-4963

### **Provedor de Email (Hostinger)**
- **Login**: https://hpanel.hostinger.com
- **Suporte**: Chat 24/7

### **DNS (se domínio próprio)**
- **Registrar**: Onde foi comprado o domínio
- **TTL**: 300s para mudanças rápidas

---

## ✅ **Checklist Final Executivo**

**Deploy completo em 10 minutos:**

1. [ ] **Push** código para GitHub (30s)
2. [ ] **Import** no Vercel (1 min)
3. [ ] **Configure** variáveis ambiente (2 min)
4. [ ] **Deploy** automático (3 min)
5. [ ] **Test** funcionalidades principais (3 min)
6. [ ] **Monitor** por 30 min após deploy

**Total: ~10 minutos + 30 min monitoramento**

---

**🎮 PlayCode Agency LIVE!**

*Sua agência digital gamificada está pronta para conquistar clientes!*