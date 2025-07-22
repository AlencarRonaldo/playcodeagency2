#!/bin/bash

# 🚀 Script de Deploy Hostinger - PlayCode Agency
# Uso: ./scripts/deploy-hostinger.sh [setup|deploy|update]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 PlayCode Agency - Deploy Hostinger${NC}"
echo "=================================================="

# Configurações (edite conforme seu VPS)
VPS_IP="${HOSTINGER_VPS_IP:-SEU_IP_AQUI}"
VPS_USER="${HOSTINGER_VPS_USER:-root}"
VPS_PORT="${HOSTINGER_VPS_PORT:-22}"
PROJECT_PATH="/var/www/playcode-agency"
DOMAIN="${HOSTINGER_DOMAIN:-seudominio.com}"

# Verificar configurações
check_config() {
    if [ "$VPS_IP" = "SEU_IP_AQUI" ]; then
        echo -e "${RED}❌ Configure o IP do VPS na variável VPS_IP${NC}"
        echo "Export VPS_IP=seu.ip.vps.aqui ou edite o script"
        exit 1
    fi
}

# Função para setup inicial do VPS
setup_vps() {
    echo -e "${BLUE}🔧 Setup inicial do VPS Hostinger${NC}"
    
    ssh -p $VPS_PORT $VPS_USER@$VPS_IP << 'EOF'
        echo "📦 Atualizando sistema..."
        apt update && apt upgrade -y
        
        echo "📦 Instalando Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        apt install -y nodejs
        
        echo "📦 Instalando PM2..."
        npm install -g pm2
        
        echo "📦 Instalando Nginx..."
        apt install -y nginx
        
        echo "📦 Instalando Certbot..."
        apt install -y certbot python3-certbot-nginx
        
        echo "📁 Criando diretório do projeto..."
        mkdir -p /var/www/playcode-agency
        
        echo "🔥 Configurando firewall..."
        ufw allow 22
        ufw allow 80  
        ufw allow 443
        ufw --force enable
        
        echo "✅ Setup inicial concluído!"
EOF
    
    echo -e "${GREEN}✅ VPS configurado com sucesso!${NC}"
}

# Função para deploy/update
deploy_app() {
    echo -e "${BLUE}🚀 Deploy da aplicação${NC}"
    
    # Build local
    echo -e "${YELLOW}🔨 Building projeto local...${NC}"
    npm run build
    
    # Upload projeto
    echo -e "${YELLOW}📤 Uploading para VPS...${NC}"
    rsync -avz -e "ssh -p $VPS_PORT" \
        --exclude='node_modules' \
        --exclude='.git' \
        --exclude='.next' \
        --exclude='*.log' \
        ./ $VPS_USER@$VPS_IP:$PROJECT_PATH/
    
    # Configurar no VPS
    echo -e "${YELLOW}🔧 Configurando no VPS...${NC}"
    ssh -p $VPS_PORT $VPS_USER@$VPS_IP << EOF
        cd $PROJECT_PATH
        
        echo "📦 Instalando dependências..."
        npm ci --production
        
        echo "🔨 Building aplicação..."
        npm run build
        
        echo "📝 Criando configuração PM2..."
        cat > ecosystem.config.js << 'EOFPM2'
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
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
}
EOFPM2
        
        echo "📁 Criando diretório de logs..."
        mkdir -p logs
        
        echo "🚀 Iniciando/reiniciando aplicação..."
        pm2 delete playcode-agency 2>/dev/null || true
        pm2 start ecosystem.config.js
        pm2 startup
        pm2 save
        
        echo "✅ Deploy concluído!"
EOF
    
    echo -e "${GREEN}✅ Deploy realizado com sucesso!${NC}"
}

# Função para configurar Nginx
setup_nginx() {
    echo -e "${BLUE}🌐 Configurando Nginx${NC}"
    
    ssh -p $VPS_PORT $VPS_USER@$VPS_IP << EOF
        echo "📝 Criando configuração Nginx..."
        cat > /etc/nginx/sites-available/playcode-agency << 'EOFNGINX'
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

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
    
    # Otimização para arquivos estáticos
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location /sounds/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOFNGINX
        
        echo "🔗 Ativando site..."
        ln -sf /etc/nginx/sites-available/playcode-agency /etc/nginx/sites-enabled/
        
        echo "🧪 Testando configuração..."
        nginx -t
        
        echo "🔄 Reiniciando Nginx..."
        systemctl restart nginx
        systemctl enable nginx
        
        echo "✅ Nginx configurado!"
EOF
    
    echo -e "${GREEN}✅ Nginx configurado com sucesso!${NC}"
}

# Função para configurar SSL
setup_ssl() {
    echo -e "${BLUE}🔒 Configurando SSL${NC}"
    
    ssh -p $VPS_PORT $VPS_USER@$VPS_IP << EOF
        echo "🔐 Gerando certificado SSL..."
        certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email contato@$DOMAIN
        
        echo "🧪 Testando renovação..."
        certbot renew --dry-run
        
        echo "✅ SSL configurado!"
EOF
    
    echo -e "${GREEN}✅ SSL configurado com sucesso!${NC}"
}

# Função para verificar status
check_status() {
    echo -e "${BLUE}📊 Verificando status${NC}"
    
    ssh -p $VPS_PORT $VPS_USER@$VPS_IP << EOF
        echo "🔍 Status do PM2:"
        pm2 status
        
        echo "🔍 Status do Nginx:"
        systemctl status nginx --no-pager -l
        
        echo "🔍 Logs da aplicação (últimas 10 linhas):"
        pm2 logs playcode-agency --lines 10 --nostream
        
        echo "🌐 Testando site:"
        curl -I http://localhost:3000 || echo "App não está respondendo"
EOF
}

# Função principal
case "${1:-help}" in
    "setup")
        echo -e "${BLUE}🎯 Setup inicial do VPS${NC}"
        check_config
        setup_vps
        ;;
    "deploy")
        echo -e "${BLUE}🎯 Deploy completo${NC}"
        check_config
        deploy_app
        setup_nginx
        setup_ssl
        check_status
        echo -e "${GREEN}🎉 Deploy completo! Acesse: https://$DOMAIN${NC}"
        ;;
    "update")
        echo -e "${BLUE}🎯 Update da aplicação${NC}"
        check_config
        deploy_app
        check_status
        ;;
    "nginx")
        echo -e "${BLUE}🎯 Configurar apenas Nginx${NC}"
        check_config
        setup_nginx
        ;;
    "ssl")
        echo -e "${BLUE}🎯 Configurar apenas SSL${NC}"
        check_config
        setup_ssl
        ;;
    "status")
        echo -e "${BLUE}🎯 Verificar status${NC}"
        check_config
        check_status
        ;;
    *)
        echo -e "${YELLOW}Uso:${NC}"
        echo "  ./scripts/deploy-hostinger.sh setup    # Setup inicial do VPS"
        echo "  ./scripts/deploy-hostinger.sh deploy   # Deploy completo"
        echo "  ./scripts/deploy-hostinger.sh update   # Atualizar aplicação"
        echo "  ./scripts/deploy-hostinger.sh nginx    # Configurar Nginx"
        echo "  ./scripts/deploy-hostinger.sh ssl      # Configurar SSL"
        echo "  ./scripts/deploy-hostinger.sh status   # Verificar status"
        echo ""
        echo -e "${BLUE}Configuração:${NC}"
        echo "  export HOSTINGER_VPS_IP=seu.ip.vps"
        echo "  export HOSTINGER_DOMAIN=seudominio.com"
        echo ""
        echo -e "${BLUE}Para mais informações, veja: HOSTINGER-DEPLOY.md${NC}"
        ;;
esac