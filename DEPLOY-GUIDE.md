# 🚀 Guia de Deploy para Produção - PlayCode Agency

## 📋 **Checklist Pré-Deploy**

### ✅ **1. Preparação do Ambiente Local**

```bash
# 1.1 Limpar cache e dependências
rm -rf .next
rm -rf node_modules/.cache
npm run build

# 1.2 Testar build local
npm run start

# 1.3 Verificar se todas as páginas carregam
# - http://localhost:3000
# - http://localhost:3000/sobre
# - http://localhost:3000/servicos
# - http://localhost:3000/portfolio
# - http://localhost:3000/planos
# - http://localhost:3000/combos
# - http://localhost:3000/contato
```

### ✅ **2. Validação de Configurações**

#### **2.1 Variáveis de Ambiente (.env.production)**
```bash
# Criar arquivo .env.production
cp .env.local .env.production

# Editar para produção:
NEXT_PUBLIC_SITE_URL=https://playcode.agency
NEXTAUTH_URL=https://playcode.agency
NODE_ENV=production

# SMTP - Manter as mesmas configurações
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@playcodeagency.xyz
SMTP_PASS=[SENHA_REAL]
SMTP_FROM=contato@playcodeagency.xyz

# Segurança - Gerar novas chaves para produção
TOKEN_SECRET_KEY=[NOVA_CHAVE_256_BITS]
ADMIN_APPROVAL_TOKEN=[NOVO_TOKEN_ADMIN]
```

#### **2.2 Next.js Config (next.config.ts)**
```typescript
// Verificar se está otimizado para produção
const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false, // Alterar para false em prod
  },
  eslint: {
    ignoreDuringBuilds: false, // Alterar para false em prod
  },
  images: {
    unoptimized: false, // Alterar para false em prod
  },
}
```

---

## 🌐 **Opções de Deploy**

### **Opção 1: Vercel (Recomendado - Mais Fácil)**

#### **1.1 Preparar Repositório GitHub**
```bash
# Se ainda não tem git configurado
git init
git add .
git commit -m "🚀 Production Release - PlayCode Agency ready for deploy"

# Criar repositório no GitHub
# https://github.com/new
# Nome: playcode-agency

# Conectar e push
git remote add origin https://github.com/SEU_USUARIO/playcode-agency.git
git branch -M main
git push -u origin main
```

#### **1.2 Deploy na Vercel**
1. **Acesse**: https://vercel.com
2. **Login** com GitHub
3. **Import Project** → Selecione `playcode-agency`
4. **Configure**:
   - Framework: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### **1.3 Configurar Variáveis de Ambiente na Vercel**
```bash
# Na dashboard da Vercel → Settings → Environment Variables
NEXT_PUBLIC_SITE_URL=https://SEU_DOMINIO.vercel.app
NEXTAUTH_URL=https://SEU_DOMINIO.vercel.app
NODE_ENV=production

# SMTP
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@playcodeagency.xyz
SMTP_PASS=SUA_SENHA_EMAIL
SMTP_FROM=contato@playcodeagency.xyz

# Segurança
TOKEN_SECRET_KEY=sua_chave_256_bits
ADMIN_APPROVAL_TOKEN=seu_token_admin

# Gaming Features
NEXT_PUBLIC_ENABLE_AUDIO=true
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true
NEXT_PUBLIC_ENABLE_EASTER_EGGS=true
```

#### **1.4 Configurar Domínio Personalizado (Opcional)**
1. **Vercel Dashboard** → **Domains**
2. **Add Domain**: `playcode.agency`
3. **Configurar DNS** no seu provedor:
   ```
   Type: A
   Name: @
   Value: 76.76.19.61
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

---

### **Opção 2: VPS/Servidor Próprio**

#### **2.1 Configurar Servidor (Ubuntu 22.04+)**
```bash
# Conectar ao servidor
ssh root@SEU_IP

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar Nginx
apt install -y nginx

# Configurar firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

#### **2.2 Clonar e Configurar Projeto**
```bash
# Clonar repositório
cd /var/www
git clone https://github.com/SEU_USUARIO/playcode-agency.git
cd playcode-agency

# Instalar dependências
npm ci --production

# Criar arquivo de ambiente
cp .env.example .env.production
nano .env.production
# [Configurar todas as variáveis de produção]

# Build para produção
npm run build

# Testar
npm run start
```

#### **2.3 Configurar PM2**
```bash
# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'playcode-agency',
    script: 'npm',
    args: 'run start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js

# Configurar auto-start
pm2 startup
pm2 save
```

#### **2.4 Configurar Nginx**
```bash
# Criar configuração
cat > /etc/nginx/sites-available/playcode-agency << EOF
server {
    listen 80;
    server_name playcode.agency www.playcode.agency;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Ativar site
ln -s /etc/nginx/sites-available/playcode-agency /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### **2.5 Configurar SSL com Let's Encrypt**
```bash
# Instalar certbot
apt install -y certbot python3-certbot-nginx

# Gerar certificado
certbot --nginx -d playcode.agency -d www.playcode.agency

# Testar renovação automática
certbot renew --dry-run
```

---

### **Opção 3: Netlify (Alternativa)**

#### **3.1 Deploy via GitHub**
1. **Conectar** repositório no Netlify
2. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. **Configurar** variáveis de ambiente
4. **Deploy**

---

## 🔒 **Configurações de Segurança**

### **1. Headers de Segurança**
```typescript
// next.config.ts já configurado com:
// - X-Frame-Options: DENY
// - X-Content-Type-Options: nosniff
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security (HTTPS)
// - Content-Security-Policy
```

### **2. Rate Limiting em Produção**
```typescript
// src/app/api/contact/route.ts
// Configurado para produção:
// - 3 tentativas por 15 minutos
// - Validação de IP
// - Detecção de bot
```

### **3. Variáveis Sensíveis**
```bash
# Gerar novas chaves para produção
openssl rand -hex 32  # TOKEN_SECRET_KEY
openssl rand -hex 16  # ADMIN_APPROVAL_TOKEN
```

---

## 🧪 **Testes Pós-Deploy**

### **1. Checklist Funcional**
- [ ] **Home page** carrega corretamente
- [ ] **Navegação** funciona em todas as páginas
- [ ] **Formulário de contato** envia emails
- [ ] **Admin panel** acessível via `/admin`
- [ ] **Áudio** funciona (synthesizer fallback)
- [ ] **Animações** carregam corretamente
- [ ] **SEO** metadata presente
- [ ] **Performance** (PageSpeed > 90)

### **2. Testes de Performance**
```bash
# Google PageSpeed Insights
# https://pagespeed.web.dev/

# Lighthouse (Chrome DevTools)
# Performance, Accessibility, Best Practices, SEO

# GTmetrix
# https://gtmetrix.com/
```

### **3. Testes de Email**
```bash
# Testar formulário de contato
# Verificar se emails chegam
# Testar template gamificado
```

---

## 🔄 **Processo de Update**

### **1. Deploy Contínuo (Vercel)**
```bash
# Qualquer push na branch main = deploy automático
git add .
git commit -m "feat: nova feature"
git push origin main
```

### **2. Deploy Manual (VPS)**
```bash
# No servidor
cd /var/www/playcode-agency
git pull origin main
npm ci --production
npm run build
pm2 restart playcode-agency
```

---

## 🆘 **Troubleshooting**

### **Problemas Comuns**

#### **1. Build Fails**
```bash
# Limpar cache e rebuildar
rm -rf .next node_modules/.cache
npm ci
npm run build
```

#### **2. Emails não funcionam**
```bash
# Verificar configurações SMTP
# Testar credenciais manualmente
# Verificar firewall do servidor (porta 465)
```

#### **3. Performance Issues**
```bash
# Verificar otimização de imagens
# Confirmar CDN ativo
# Analisar bundle size
npm run analyze
```

#### **4. Erros de Hydration**
```bash
# Verificar SSR/CSR inconsistencies
# Checar componentes client-side
# Validar useEffect dependencies
```

---

## 📊 **Monitoramento**

### **1. Analytics**
- **Google Analytics** (configurado)
- **Google Tag Manager** (configurado)
- **Vercel Analytics** (se usando Vercel)

### **2. Error Tracking**
```bash
# Recomendado adicionar:
npm install @sentry/nextjs
```

### **3. Uptime Monitoring**
- **UptimeRobot** (gratuito)
- **StatusCake**
- **Pingdom**

---

## 🎯 **Checklist Final**

- [ ] **Ambiente local** testado completamente
- [ ] **Build de produção** funciona sem erros
- [ ] **Variáveis de ambiente** configuradas
- [ ] **Repositório GitHub** atualizado
- [ ] **Deploy** realizado na plataforma escolhida
- [ ] **Domínio personalizado** configurado (se aplicável)
- [ ] **SSL/HTTPS** ativo
- [ ] **Formulário de contato** testado
- [ ] **Performance** > 90 no PageSpeed
- [ ] **SEO** validado
- [ ] **Monitoramento** ativo

---

## 🚀 **Próximos Passos Pós-Deploy**

1. **Configurar backup** automático
2. **Implementar CI/CD** completo
3. **Adicionar testes automatizados**
4. **Configurar error tracking**
5. **Otimizar performance continuamente**
6. **Monitorar analytics e conversões**

---

**🎮 PlayCode Agency está pronta para conquistar o mundo digital!**

*Deploy realizado com Claude Code - Sua parceira em transformação digital.*