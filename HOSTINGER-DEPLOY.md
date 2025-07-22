# 🚀 Deploy na Hostinger - PlayCode Agency

## 🎯 **Guia Específico para Hostinger**

A Hostinger oferece várias opções de hospedagem. Vou cobrir as principais:

---

## 📊 **Opções de Hospedagem Hostinger**

### **1. 🌐 Hostinger VPS (Recomendado para Next.js)**
- **Node.js nativo**
- **PM2 incluído**
- **SSL gratuito**
- **Controle total**

### **2. ☁️ Hostinger Cloud Hosting**
- **Suporte Node.js**
- **Git deployment**
- **SSL automático**
- **Mais simples**

### **3. 🔧 Hostinger Shared Hosting**
- **Apenas sites estáticos**
- **Não suporta Next.js**
- **Só para build estático**

---

## 🏭 **Deploy VPS Hostinger (Recomendado)**

### **Passo 1: Configurar VPS**

1. **Acesse o hPanel Hostinger**
   - Login: https://hpanel.hostinger.com
   - VPS → Manage

2. **Conectar via SSH**
   ```bash
   ssh root@SEU_IP_VPS
   # Senha fornecida pela Hostinger
   ```

3. **Atualizar Sistema**
   ```bash
   apt update && apt upgrade -y
   ```

4. **Instalar Node.js 18+**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt install -y nodejs
   
   # Verificar instalação
   node --version
   npm --version
   ```

5. **Instalar PM2**
   ```bash
   npm install -g pm2
   ```

6. **Instalar Nginx**
   ```bash
   apt install -y nginx
   ```

### **Passo 2: Preparar Projeto**

1. **No seu computador local:**
   ```bash
   # Gerar chaves de produção
   npm run production:keys
   
   # Configurar ambiente
   npm run production:setup
   
   # Editar .env.production com dados da Hostinger
   # NEXT_PUBLIC_SITE_URL=https://seudominio.com
   
   # Testar build
   npm run deploy:test
   
   # Criar pacote
   npm run deploy:production
   ```

2. **Upload para VPS:**
   ```bash
   # Via SCP
   scp playcode-agency-production.tar.gz root@SEU_IP:/var/www/
   
   # Ou via Git (recomendado)
   git add .
   git commit -m "🚀 Ready for Hostinger production"
   git push origin main
   ```

### **Passo 3: Deploy no VPS**

1. **No VPS, criar diretório:**
   ```bash
   mkdir -p /var/www/playcode-agency
   cd /var/www/playcode-agency
   ```

2. **Clonar projeto:**
   ```bash
   # Via Git (recomendado)
   git clone https://github.com/SEU_USUARIO/playcode-agency.git .
   
   # Ou extrair pacote
   # tar -xzf /var/www/playcode-agency-production.tar.gz
   ```

3. **Configurar ambiente:**
   ```bash
   # Copiar arquivo de produção
   cp .env.production.example .env.production
   
   # Editar configurações
   nano .env.production
   ```

4. **Instalar e buildar:**
   ```bash
   npm ci --production
   npm run build
   ```

5. **Configurar PM2:**
   ```bash
   # Criar config PM2
   cat > ecosystem.config.js << 'EOF'
   module.exports = {
     apps: [{
       name: 'playcode-agency',
       script: 'npm',
       args: 'run start',
       env: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       instances: 2,
       exec_mode: 'cluster',
       watch: false,
       max_memory_restart: '1G'
     }]
   }
   EOF
   
   # Iniciar aplicação
   pm2 start ecosystem.config.js
   pm2 startup
   pm2 save
   ```

### **Passo 4: Configurar Nginx**

1. **Criar configuração:**
   ```bash
   cat > /etc/nginx/sites-available/playcode-agency << 'EOF'
   server {
       listen 80;
       server_name seudominio.com www.seudominio.com;
   
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Otimização para arquivos estáticos
       location /_next/static/ {
           proxy_pass http://localhost:3000;
           proxy_cache_valid 200 1y;
           add_header Cache-Control "public, immutable";
       }
       
       location /sounds/ {
           proxy_pass http://localhost:3000;
           proxy_cache_valid 200 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   EOF
   ```

2. **Ativar site:**
   ```bash
   ln -s /etc/nginx/sites-available/playcode-agency /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

### **Passo 5: Configurar SSL**

1. **Instalar Certbot:**
   ```bash
   apt install -y certbot python3-certbot-nginx
   ```

2. **Gerar certificado:**
   ```bash
   certbot --nginx -d seudominio.com -d www.seudominio.com
   ```

3. **Testar renovação:**
   ```bash
   certbot renew --dry-run
   ```

---

## ☁️ **Deploy Cloud Hosting Hostinger**

### **Passo 1: Configurar Git Deployment**

1. **No hPanel:**
   - Website → Git → Enable Git
   - Repository: `https://github.com/SEU_USUARIO/playcode-agency.git`
   - Branch: `main`

2. **Configurar Node.js:**
   - Website → Advanced → Node.js
   - Version: 18.x
   - Startup file: `server.js`

### **Passo 2: Criar server.js**

```javascript
// server.js para Hostinger Cloud
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  }).listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://${hostname}:${port}`)
  })
})
```

### **Passo 3: Configurar package.json**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "node server.js",
    "postinstall": "npm run build"
  }
}
```

---

## 🔧 **Configurações Específicas Hostinger**

### **Variáveis de Ambiente (.env.production)**

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://seudominio.com
NODE_ENV=production

# Email - Usar SMTP da Hostinger
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=contato@seudominio.com
SMTP_PASS=sua_senha_email_hostinger
SMTP_FROM=contato@seudominio.com

# Chaves de segurança (gerar novas)
TOKEN_SECRET_KEY=nova_chave_256_bits
ADMIN_APPROVAL_TOKEN=novo_token_admin

# Gaming Features
NEXT_PUBLIC_ENABLE_AUDIO=true
NEXT_PUBLIC_ENABLE_ACHIEVEMENTS=true
NEXT_PUBLIC_ENABLE_EASTER_EGGS=true
```

### **DNS Configuration**

No hPanel → Domains → DNS Zone Editor:

```
Type: A
Name: @
Points to: IP_DO_SEU_VPS

Type: CNAME  
Name: www
Points to: seudominio.com
```

---

## 🚀 **Script de Deploy Automático Hostinger**

```bash
#!/bin/bash
# deploy-hostinger.sh

echo "🚀 Deploy para Hostinger VPS"

# Configurações
VPS_IP="SEU_IP_VPS"
VPS_USER="root"
PROJECT_PATH="/var/www/playcode-agency"

# Build local
echo "📦 Building projeto local..."
npm run build

# Upload via rsync
echo "📤 Uploading para VPS..."
rsync -avz --exclude='node_modules' --exclude='.git' ./ $VPS_USER@$VPS_IP:$PROJECT_PATH/

# Comandos no VPS
echo "🔧 Configurando no VPS..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /var/www/playcode-agency
npm ci --production
npm run build
pm2 restart playcode-agency
pm2 save
EOF

echo "✅ Deploy concluído!"
echo "🌐 Site: https://seudominio.com"
```

---

## 📋 **Checklist Hostinger**

### **Pré-Deploy**
- [ ] VPS ou Cloud Hosting ativo
- [ ] Domínio apontado para Hostinger
- [ ] Email SMTP configurado
- [ ] Chaves de segurança geradas

### **Deploy**
- [ ] Node.js 18+ instalado
- [ ] PM2 configurado
- [ ] Nginx configurado 
- [ ] SSL ativo (Let's Encrypt)
- [ ] Aplicação rodando na porta 3000

### **Pós-Deploy**
- [ ] Site acessível via HTTPS
- [ ] Formulário enviando emails
- [ ] Admin funcionando (/admin)
- [ ] Performance testada
- [ ] Backup configurado

---

## 🆘 **Troubleshooting Hostinger**

### **VPS não conecta SSH**
```bash
# Verificar IP e porta no hPanel
# Tentar porta 22 ou 2222
ssh -p 2222 root@SEU_IP
```

### **Node.js versão antiga**
```bash
# Remover versão antiga
apt remove nodejs npm
# Reinstalar versão 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs
```

### **PM2 não inicia**
```bash
# Verificar logs
pm2 logs playcode-agency
# Reiniciar
pm2 restart playcode-agency
```

### **Nginx erro 502**
```bash
# Verificar se app está rodando
pm2 status
# Verificar configuração
nginx -t
# Reiniciar nginx
systemctl restart nginx
```

### **Emails não funcionam**
```bash
# Verificar credenciais no hPanel
# Testar SMTP manualmente
# Verificar firewall (porta 465)
```

---

## 💰 **Custos Hostinger**

### **VPS Hostinger**
- **VPS 1**: ~R$ 15/mês - 1 CPU, 4GB RAM
- **VPS 2**: ~R$ 25/mês - 2 CPU, 8GB RAM  
- **VPS 4**: ~R$ 45/mês - 4 CPU, 16GB RAM

### **Cloud Hosting**
- **Starter**: ~R$ 8/mês - Node.js limitado
- **Premium**: ~R$ 15/mês - Node.js completo
- **Business**: ~R$ 25/mês - Recursos amplos

### **Recomendação**
**VPS 1** é suficiente para começar (R$ 15/mês)

---

## ✅ **Deploy Rápido Hostinger**

```bash
# 1. Preparar local
npm run production:keys
npm run production:setup

# 2. Upload para VPS
scp -r . root@SEU_IP:/var/www/playcode-agency/

# 3. Configurar no VPS
ssh root@SEU_IP
cd /var/www/playcode-agency
npm ci --production
npm run build
pm2 start ecosystem.config.js

# 4. Configurar Nginx + SSL
# (seguir passos acima)

# 5. Testar
curl https://seudominio.com
```

**🎮 PlayCode Agency rodando na Hostinger!**

*Hospedagem confiável com performance brasileira.*