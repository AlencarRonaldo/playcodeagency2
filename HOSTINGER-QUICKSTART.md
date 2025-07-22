# ⚡ Hostinger Quick Start - PlayCode Agency

## 🎯 **Deploy em 10 Minutos na Hostinger**

### **Pré-Requisitos**
- ✅ VPS Hostinger ativo
- ✅ Domínio apontado para o VPS
- ✅ Acesso SSH ao VPS

---

## 🚀 **Passo a Passo Rápido**

### **1. Configurar Variáveis (1 min)**
```bash
# No seu terminal local
export HOSTINGER_VPS_IP=SEU_IP_VPS
export HOSTINGER_DOMAIN=seudominio.com

# Gerar chaves de segurança
npm run production:keys
```

### **2. Setup Inicial VPS (3 min)**
```bash
# Configurar VPS (apenas primeira vez)
npm run hostinger:setup
```

### **3. Deploy Completo (5 min)**
```bash
# Preparar ambiente
npm run production:setup
# Editar .env.production com suas configurações

# Deploy completo (app + nginx + ssl)
npm run hostinger:deploy
```

### **4. Verificar Status (1 min)**
```bash
# Checar se tudo está funcionando
npm run hostinger:status
```

**🎉 Pronto! Site no ar:** `https://seudominio.com`

---

## 📋 **Comandos Essenciais**

```bash
# Setup inicial (apenas uma vez)
npm run hostinger:setup

# Deploy completo (primeira vez)
npm run hostinger:deploy

# Atualizações futuras
npm run hostinger:update

# Verificar status
npm run hostinger:status
```

---

## ⚙️ **Configuração .env.production**

```bash
# Site
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NODE_ENV=production

# Email Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@seudominio.com
SMTP_PASS=sua_senha_email
SMTP_FROM=contato@seudominio.com

# Segurança (gerar novas)
TOKEN_SECRET_KEY=sua_chave_256_bits
ADMIN_APPROVAL_TOKEN=seu_token_admin

# Gaming
NEXT_PUBLIC_ENABLE_AUDIO=true
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true
NEXT_PUBLIC_ENABLE_EASTER_EGGS=true
```

---

## 🏗️ **Arquitetura Hostinger VPS**

```
Internet → Nginx (80/443) → PM2 → Next.js App (3000)
                ↓
            Let's Encrypt SSL
```

**Componentes:**
- **Nginx**: Proxy reverso + SSL
- **PM2**: Gerenciador de processos (2 instâncias)
- **Next.js**: Aplicação principal
- **Let's Encrypt**: SSL gratuito

---

## 🆘 **Problemas Comuns**

### **SSH não conecta**
```bash
# Tentar porta alternativa
ssh -p 2222 root@SEU_IP

# Verificar IP no hPanel Hostinger
```

### **App não inicia**
```bash
# Verificar logs
npm run hostinger:status

# No VPS, verificar PM2
ssh root@SEU_IP
pm2 logs playcode-agency
```

### **Nginx erro 502**
```bash
# Verificar se app está rodando na porta 3000
curl http://localhost:3000

# Reiniciar serviços
pm2 restart playcode-agency
systemctl restart nginx
```

### **SSL não funciona**
```bash
# Verificar domínio apontado para VPS
nslookup seudominio.com

# Refazer certificado
ssh root@SEU_IP
certbot delete --cert-name seudominio.com
certbot --nginx -d seudominio.com -d www.seudominio.com
```

---

## 📊 **Monitoramento**

### **Status da Aplicação**
```bash
# Verificar saúde geral
npm run hostinger:status

# Logs em tempo real
ssh root@SEU_IP
pm2 logs playcode-agency --follow
```

### **Performance**
```bash
# Teste de carga básico
curl -o /dev/null -s -w "%{time_total}\n" https://seudominio.com

# Monitorar recursos
ssh root@SEU_IP
htop
```

---

## 🔄 **Atualizações**

### **Deploy de Novo Código**
```bash
# Commit changes
git add .
git commit -m "feat: nova funcionalidade"
git push origin main

# Deploy update
npm run hostinger:update
```

### **Backup Antes de Updates**
```bash
# No VPS, backup automático criado em:
# /var/www/playcode-agency/backup-YYYYMMDD-HHMMSS.tar.gz
```

---

## 💰 **Custo Hostinger**

### **VPS Recomendado**
- **VPS 1**: R$ 15/mês - 1 CPU, 4GB RAM ✅
- **VPS 2**: R$ 25/mês - 2 CPU, 8GB RAM (crescimento)

### **Extras Inclusos**
- ✅ SSL Let's Encrypt (gratuito)
- ✅ Backup manual (scripts inclusos)
- ✅ Email SMTP (grátis com domínio)
- ✅ Suporte 24/7 Hostinger

---

## 🎯 **Checklist Pós-Deploy**

### **Funcionalidade**
- [ ] Site carrega: `https://seudominio.com`
- [ ] HTTPS ativo (cadeado verde)
- [ ] Formulário envia emails
- [ ] Admin acessível: `/admin`
- [ ] Performance > 90 PageSpeed

### **Segurança**
- [ ] SSL válido (A+ no SSL Labs)
- [ ] Headers de segurança ativos
- [ ] Rate limiting funcionando
- [ ] Backup configurado

### **Monitoramento**
- [ ] PM2 status: online
- [ ] Nginx status: active
- [ ] Logs sem erros críticos
- [ ] Email SMTP funcionando

---

## ⚡ **One-Liner Deploy**

```bash
export HOSTINGER_VPS_IP=SEU_IP && export HOSTINGER_DOMAIN=seudominio.com && npm run production:setup && npm run hostinger:deploy
```

**🎮 PlayCode Agency rodando na Hostinger em minutos!**

*Performance brasileira, suporte 24/7, custo acessível.*