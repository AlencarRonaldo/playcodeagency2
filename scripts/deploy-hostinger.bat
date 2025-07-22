@echo off
echo 🚀 Deploy PlayCode Agency - Hostinger Hospedagem Compartilhada
echo.

REM 1. Limpar build anterior
echo 🧹 Limpando build anterior...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
echo.

REM 2. Instalar dependências
echo 📦 Instalando dependências...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erro ao instalar dependências
    pause
    exit /b 1
)
echo.

REM 3. Configurar para hospedagem compartilhada
echo ⚙️ Configurando para export estático...
copy "next.config.ts" "next.config.backup.ts"
copy "next.config.hostinger.ts" "next.config.ts"

REM 4. Build do projeto
echo 🔨 Gerando build estático...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)
echo.

REM 5. Restaurar configuração original
echo 🔄 Restaurando configuração original...
copy "next.config.backup.ts" "next.config.ts"
del "next.config.backup.ts"

REM 6. Verificar se build foi gerado
if not exist "out" (
    echo ❌ Erro: Pasta 'out' não foi gerada
    echo Verifique se next.config.hostinger.ts existe
    pause
    exit /b 1
)
echo.

REM 7. Compactar para upload
echo 📦 Compactando arquivos para upload...
set timestamp=%date:~6,4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set filename=playcode-deploy-%timestamp%.zip

cd out
powershell -command "Compress-Archive -Path * -DestinationPath '../%filename%'"
cd ..

if not exist "%filename%" (
    echo ❌ Erro ao compactar arquivos
    pause
    exit /b 1
)
echo.

echo ✅ Deploy pronto!
echo.
echo 📁 Arquivo criado: %filename%
echo 📊 Tamanho do arquivo:
dir "%filename%" | find "%filename%"
echo.
echo 📤 PRÓXIMOS PASSOS:
echo 1. Acesse o hPanel da Hostinger
echo 2. Vá em Website → File Manager
echo 3. Entre na pasta public_html/
echo 4. Faça upload do arquivo %filename%
echo 5. Extraia o arquivo diretamente na pasta public_html/
echo 6. Acesse seu domínio para verificar
echo.
echo 🌐 Seu site estará disponível em: https://seudominio.com
echo.
pause