#!/bin/bash
echo "🧹 Limpando cache e build anteriores..."
rm -rf .next
rm -rf node_modules/.cache

echo "🔨 Iniciando build..."
npm run build

echo "✅ Build concluído!"