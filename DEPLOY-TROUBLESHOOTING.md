# 🛠️ Troubleshooting Deploy Hostinger

## ❌ Problemas Comuns

### 1. Script não funciona / Pasta `out` não é criada

**Solução Rápida:**
```bash
# Execute estes comandos um por um:
npm install
npm run build:hostinger
```

**Se ainda não funcionar:**
```bash
# 1. Verificar se arquivo existe
dir next.config.hostinger.ts

# 2. Build manual
copy next.config.hostinger.ts next.config.ts
npm run build
copy next.config.ts next.config.backup.ts
```

### 2. Erro "output: 'export' não reconhecido"

**Solução:**
```bash
# Atualizar Next.js
npm update next@latest
npm install
```

### 3. PowerShell não funciona

**Alternativa manual:**
1. Vá na pasta `out/`
2. Selecione todos os arquivos (Ctrl+A)
3. Clique direito → "Enviar para" → "Pasta compactada"
4. Renomeie para `playcode-deploy.zip`

### 4. Build com erros de TypeScript

**Solução temporária:**
Edite `next.config.hostinger.ts`:
```typescript
typescript: {
  ignoreBuildErrors: true,  // ← mude para true
},
```

## ✅ Comandos que Funcionam

### Opção 1: Script Simples
```bash
deploy-simples.bat
```

### Opção 2: Comando NPM
```bash
npm run build:hostinger
```

### Opção 3: Manual Passo a Passo
```bash
# 1. Limpar
rmdir /s /q .next
rmdir /s /q out

# 2. Backup config
copy next.config.ts next.config.backup.ts

# 3. Usar config hostinger
copy next.config.hostinger.ts next.config.ts

# 4. Build
npm run build

# 5. Restaurar config
copy next.config.backup.ts next.config.ts
del next.config.backup.ts

# 6. Verificar
dir out
```

## 📁 Estrutura Esperada

Após o build, você deve ter:
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
└── contato.html
```

## 🔍 Verificações

### ✅ Checklist Antes do Deploy
- [ ] `next.config.hostinger.ts` existe
- [ ] `npm install` executado sem erros
- [ ] Pasta `out/` foi criada
- [ ] Arquivo `index.html` existe dentro de `out/`
- [ ] Arquivo `.zip` foi criado

### ❌ Se Alguma Coisa Falhar
1. **Apague tudo**: `.next`, `out`, `node_modules`
2. **Reinstale**: `npm install`
3. **Build limpo**: `npm run build:hostinger`

## 📞 Comandos de Emergência

```bash
# Reset completo
rmdir /s /q .next
rmdir /s /q out
rmdir /s /q node_modules
npm install
npm run build:hostinger
```

## 🌐 Upload Manual

Se o script não funcionar, faça upload manual:

1. **hPanel** → **File Manager**
2. **public_html/** (pasta raiz)
3. **Upload** do arquivo `.zip`
4. **Extrair** na pasta `public_html/`
5. **Copiar** `.htaccess` de `docs/deploy/.htaccess-hostinger`

---

**🆘 Ainda não funciona?**
Execute: `npm run build` e verifique as mensagens de erro.