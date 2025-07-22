#!/bin/bash

# 🚀 Script de Deploy Automatizado - PlayCode Agency
# Uso: ./scripts/deploy.sh [vercel|production]

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🎮 PlayCode Agency - Deploy Script${NC}"
echo "=================================================="

# Verificar se está na raiz do projeto
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Execute este script na raiz do projeto${NC}"
    exit 1
fi

# Função para validar environment
validate_env() {
    echo -e "${YELLOW}🔍 Validando configurações...${NC}"
    
    if [ ! -f ".env.local" ]; then
        echo -e "${RED}❌ Arquivo .env.local não encontrado${NC}"
        exit 1
    fi
    
    # Verificar variáveis essenciais
    if ! grep -q "SMTP_HOST=" .env.local; then
        echo -e "${RED}❌ SMTP_HOST não configurado${NC}"
        exit 1
    fi
    
    if ! grep -q "SMTP_USER=" .env.local; then
        echo -e "${RED}❌ SMTP_USER não configurado${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Configurações válidas${NC}"
}

# Função para limpar e testar
clean_and_test() {
    echo -e "${YELLOW}🧹 Limpando cache...${NC}"
    rm -rf .next
    rm -rf node_modules/.cache
    
    echo -e "${YELLOW}📦 Instalando dependências...${NC}"
    npm ci
    
    echo -e "${YELLOW}🔨 Executando build...${NC}"
    npm run build
    
    echo -e "${YELLOW}🧪 Testando build...${NC}"
    timeout 10s npm run start &
    START_PID=$!
    
    sleep 5
    
    # Testar se servidor está respondendo
    if curl -f -s http://localhost:3000 > /dev/null; then
        echo -e "${GREEN}✅ Build funcionando corretamente${NC}"
    else
        echo -e "${RED}❌ Build falhou no teste${NC}"
        exit 1
    fi
    
    kill $START_PID 2>/dev/null || true
}

# Função para deploy na Vercel
deploy_vercel() {
    echo -e "${BLUE}🚀 Iniciando deploy na Vercel...${NC}"
    
    # Verificar se Vercel CLI está instalado
    if ! command -v vercel &> /dev/null; then
        echo -e "${YELLOW}📦 Instalando Vercel CLI...${NC}"
        npm install -g vercel
    fi
    
    # Login na Vercel (se necessário)
    vercel whoami || vercel login
    
    # Deploy
    echo -e "${YELLOW}🚀 Fazendo deploy...${NC}"
    vercel --prod
    
    echo -e "${GREEN}✅ Deploy na Vercel concluído!${NC}"
}

# Função para preparar produção
prepare_production() {
    echo -e "${BLUE}🏭 Preparando para produção...${NC}"
    
    # Criar .env.production se não existir
    if [ ! -f ".env.production" ]; then
        echo -e "${YELLOW}📝 Criando .env.production...${NC}"
        cp .env.local .env.production
        
        # Alterar configurações para produção
        sed -i 's/NODE_ENV=development/NODE_ENV=production/' .env.production
        sed -i 's|NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://playcode.agency|' .env.production
        sed -i 's|NEXTAUTH_URL=.*|NEXTAUTH_URL=https://playcode.agency|' .env.production
        
        echo -e "${YELLOW}⚠️ Revise o arquivo .env.production antes do deploy!${NC}"
        echo -e "${YELLOW}⚠️ Gere novas chaves de segurança para produção!${NC}"
    fi
    
    # Verificar configuração do Next.js para produção
    if grep -q "ignoreBuildErrors: true" next.config.ts; then
        echo -e "${YELLOW}⚠️ Considere alterar ignoreBuildErrors para false em produção${NC}"
    fi
    
    # Criar tarball para upload
    echo -e "${YELLOW}📦 Criando pacote para produção...${NC}"
    tar -czf playcode-agency-production.tar.gz \
        --exclude=node_modules \
        --exclude=.next \
        --exclude=.git \
        --exclude="*.tar.gz" \
        .
    
    echo -e "${GREEN}✅ Pacote criado: playcode-agency-production.tar.gz${NC}"
}

# Função para mostrar checklist pós-deploy
show_checklist() {
    echo -e "${BLUE}📋 Checklist Pós-Deploy:${NC}"
    echo "[ ] Testar home page"
    echo "[ ] Testar navegação"
    echo "[ ] Testar formulário de contato"
    echo "[ ] Verificar emails"
    echo "[ ] Testar admin (/admin)"
    echo "[ ] Verificar performance (PageSpeed)"
    echo "[ ] Configurar monitoramento"
    echo "[ ] Backup configurado"
}

# Main
case "${1:-help}" in
    "vercel")
        echo -e "${BLUE}🎯 Deploy para Vercel${NC}"
        validate_env
        clean_and_test
        deploy_vercel
        show_checklist
        ;;
    "production")
        echo -e "${BLUE}🎯 Preparar para Produção${NC}"
        validate_env
        clean_and_test
        prepare_production
        show_checklist
        ;;
    "test")
        echo -e "${BLUE}🧪 Apenas Testar Build${NC}"
        validate_env
        clean_and_test
        ;;
    *)
        echo -e "${YELLOW}Uso:${NC}"
        echo "  ./scripts/deploy.sh vercel      # Deploy na Vercel"
        echo "  ./scripts/deploy.sh production  # Preparar para servidor próprio"
        echo "  ./scripts/deploy.sh test        # Apenas testar build"
        echo ""
        echo -e "${BLUE}Para mais informações, veja: DEPLOY-GUIDE.md${NC}"
        ;;
esac