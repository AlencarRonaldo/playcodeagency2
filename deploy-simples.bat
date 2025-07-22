@echo off
echo 🚀 Deploy Simples - PlayCode Agency para Hostinger
echo.

REM 1. Limpar arquivos antigos
echo 🧹 Limpando arquivos antigos...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
if exist "playcode-deploy-*.zip" del "playcode-deploy-*.zip"
echo.

REM 2. Build para hospedagem compartilhada
echo 🔨 Fazendo build para hospedagem compartilhada...
npm run build:hostinger
if %errorlevel% neq 0 (
    echo ❌ Erro no build
    pause
    exit /b 1
)
echo.

REM 3. Verificar se pasta out foi criada
if not exist "out" (
    echo ❌ Erro: Pasta 'out' não foi criada
    echo Tente executar: npm run build:hostinger
    pause
    exit /b 1
)
echo.

REM 4. Compactar arquivos
echo 📦 Compactando arquivos...
set timestamp=%date:~6,4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set filename=playcode-deploy-%timestamp%.zip

cd out
powershell -command "Compress-Archive -Path * -DestinationPath '../%filename%'"
cd ..

if not exist "%filename%" (
    echo ❌ Erro ao compactar
    pause
    exit /b 1
)
echo.

echo ✅ Deploy pronto!
echo.
echo 📁 Arquivo: %filename%
echo 📊 Tamanho:
dir "%filename%" | find "%filename%"
echo.
echo 📋 PRÓXIMOS PASSOS:
echo 1. Acesse hPanel da Hostinger
echo 2. File Manager → public_html/
echo 3. Upload do arquivo %filename%
echo 4. Extrair na pasta public_html/
echo 5. Copiar .htaccess da pasta docs/deploy/
echo.
echo 🌐 Teste: https://seudominio.com
echo.
pause