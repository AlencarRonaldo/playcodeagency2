# 🚀 Deploy na Hostinger - Hospedagem Compartilhada

Guia completo para hospedar o site PlayCode Agency na Hostinger usando hospedagem compartilhada tradicional.

## 📋 Pré-requisitos

### 1. Conta Hostinger
- Plano Premium ou Business (suporte a Node.js)
- Domínio configurado
- Acesso ao hPanel

### 2. Preparação Local
```bash
# 1. Build do projeto
npm run build

# 2. Verificar se build foi criado
ls -la .next/

# 3. Verificar arquivos estáticos
ls -la out/ # ou public/
```

## 🛠️ Configuração do Next.js para Hospedagem Compartilhada

### 1. Configurar Export Estático
Edite `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para export estático
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  
  // Configurações existentes
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  webpack: (config, { dev }) => {
    if (dev) {
      config.optimization.splitChunks = false
      config.optimization.runtimeChunk = false
    }
    return config
  }
}

module.exports = nextConfig
```

### 2. Gerar Build Estático
```bash
# Limpar cache
rm -rf .next

# Build para produção
npm run build

# Verificar pasta out/ foi criada
ls -la out/
```

## 📁 Estrutura de Arquivos para Upload

Após o build, você terá:
```
out/
├── _next/
│   ├── static/
│   └── ...
├── index.html
├── sobre.html
├── servicos.html
├── portfolio.html
├── planos.html
├── combos.html
├── contato.html
└── assets/
```

## 🌐 Upload via hPanel

### 1. Acessar File Manager
1. Login no hPanel da Hostinger
2. Ir em **Website** → **File Manager**
3. Navegar até pasta `public_html/`

### 2. Upload dos Arquivos
```bash
# Opção 1: Compactar localmente
cd out/
zip -r site-playcode.zip *

# Opção 2: Upload direto via File Manager
# Selecionar todos os arquivos da pasta out/
# Arrastar para public_html/
```

### 3. Estrutura Final no Servidor
```
public_html/
├── _next/
├── index.html
├── sobre.html
├── servicos.html
├── portfolio.html
├── planos.html
├── combos.html
├── contato.html
├── .htaccess (criar)
└── assets/
```

## ⚙️ Configuração do .htaccess

Criar arquivo `.htaccess` na pasta `public_html/`:

```apache
# Redirecionar para HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Configurações de cache
<IfModule mod_expires.c>
ExpiresActive On
ExpiresByType text/css "access plus 1 year"
ExpiresByType application/javascript "access plus 1 year"
ExpiresByType image/png "access plus 1 year"
ExpiresByType image/jpg "access plus 1 year"
ExpiresByType image/jpeg "access plus 1 year"
ExpiresByType image/gif "access plus 1 year"
ExpiresByType image/svg+xml "access plus 1 year"
ExpiresByType image/webp "access plus 1 year"
ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Compressão GZIP
<IfModule mod_deflate.c>
AddOutputFilterByType DEFLATE text/plain
AddOutputFilterByType DEFLATE text/html
AddOutputFilterByType DEFLATE text/xml
AddOutputFilterByType DEFLATE text/css
AddOutputFilterByType DEFLATE application/xml
AddOutputFilterByType DEFLATE application/xhtml+xml
AddOutputFilterByType DEFLATE application/rss+xml
AddOutputFilterByType DEFLATE application/javascript
AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Headers de segurança
<IfModule mod_headers.c>
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# Redirecionamentos amigáveis
RewriteEngine On

# Remover extensão .html
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^([^\.]+)$ $1.html [NC,L]

# Redirecionar índice
RewriteRule ^index\.html$ / [R=301,L]

# Página 404 customizada (opcional)
ErrorDocument 404 /404.html
```

## 📧 Configuração de Email

### 1. Criar Conta de Email
No hPanel:
1. **Email** → **Email Accounts**
2. Criar: `contato@seudominio.com`
3. Senha forte

### 2. Configurar SMTP no Código
Editar `src/lib/services/email.ts`:

```typescript
const transporter = nodemailer.createTransporter({
  host: 'smtp.hostinger.com',  // SMTP da Hostinger
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER, // contato@seudominio.com
    pass: process.env.EMAIL_PASS  // senha do email
  }
})
```

### 3. Variáveis de Ambiente
Como é hospedagem compartilhada, configurar no código:

```typescript
// src/lib/config/email.ts
export const emailConfig = {
  host: 'smtp.hostinger.com',
  port: 587,
  secure: false,
  auth: {
    user: 'contato@seudominio.com', // substitua pelo seu email
    pass: 'sua_senha_email'         // substitua pela sua senha
  }
}
```

## 🔧 Configuração de Domínio

### 1. Apontar Domínio
No painel do seu registrador de domínio:
```
Tipo: A
Nome: @
Valor: IP_DO_SERVIDOR_HOSTINGER

Tipo: CNAME
Nome: www
Valor: seudominio.com
```

### 2. SSL/TLS
No hPanel:
1. **Security** → **SSL/TLS**
2. Ativar **Let's Encrypt SSL**
3. Aguardar propagação (até 24h)

## 📱 Testes e Validação

### 1. Checklist de Funcionalidades
```bash
✅ Site carrega corretamente
✅ HTTPS funcionando
✅ Formulário de contato envia emails
✅ Todas as páginas acessíveis
✅ Images carregando
✅ CSS/JS funcionando
✅ Responsivo mobile
✅ Velocidade aceitável
```

### 2. Ferramentas de Teste
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **SSL Labs**: https://www.ssllabs.com/ssltest/

## 🚀 Script de Deploy Automatizado

Criar `scripts/deploy-hostinger.sh`:

```bash
#!/bin/bash

echo "🚀 Deploy PlayCode Agency - Hostinger"

# 1. Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf .next out

# 2. Instalar dependências
echo "📦 Instalando dependências..."
npm install

# 3. Build do projeto
echo "🔨 Gerando build..."
npm run build

# 4. Verificar se build foi gerado
if [ ! -d "out" ]; then
  echo "❌ Erro: Build não foi gerado"
  exit 1
fi

# 5. Compactar para upload
echo "📦 Compactando arquivos..."
cd out
zip -r ../playcode-deploy-$(date +%Y%m%d-%H%M%S).zip *
cd ..

echo "✅ Deploy pronto!"
echo "📁 Arquivo: playcode-deploy-$(date +%Y%m%d-%H%M%S).zip"
echo "📤 Faça upload do arquivo para public_html/ via hPanel"
echo "🌐 Acesse: https://seudominio.com"
```

Executar:
```bash
chmod +x scripts/deploy-hostinger.sh
./scripts/deploy-hostinger.sh
```

## 🔍 Troubleshooting

### Problema: Site não carrega
**Solução:**
```bash
# Verificar estrutura de arquivos
# Deve estar diretamente em public_html/
public_html/
├── index.html  ← deve estar aqui
├── _next/
└── ...
```

### Problema: CSS/JS não carrega
**Solução:**
- Verificar se `output: 'export'` está no next.config.ts
- Verificar se `images: { unoptimized: true }`
- Limpar cache do navegador

### Problema: Formulário não envia
**Solução:**
- Verificar configurações SMTP
- Testar email manualmente
- Verificar logs de erro no hPanel

### Problema: Velocidade lenta
**Solução:**
- Ativar compressão GZIP no .htaccess
- Otimizar imagens
- Usar cache do navegador

## 📞 Suporte

### Hostinger Support
- Chat: 24/7 no hPanel
- Email: support@hostinger.com
- Base de conhecimento: https://support.hostinger.com

### Configuração Específica PlayCode
```bash
# Comando para recriar build
npm run build

# Verificar tamanho do build
du -sh out/

# Testar localmente antes do upload
npx serve out/
```

---

**✅ Site funcionando na Hostinger!**  
Acesse: `https://seudominio.com`