@echo off
echo 🚀 Build Hostinger - Só Páginas Principais
echo.

REM 1. Limpar build anterior
echo 🧹 Limpando...
if exist ".next" rmdir /s /q ".next"
if exist "out" rmdir /s /q "out"
echo.

REM 2. Backup das pastas problemáticas
echo 📦 Fazendo backup das pastas problemáticas...
if exist "src\app\admin" (
    if not exist "src\app\admin.backup" (
        move "src\app\admin" "src\app\admin.backup"
        echo ✅ Admin movido para backup
    )
)

if exist "src\app\api" (
    if not exist "src\app\api.backup" (
        move "src\app\api" "src\app\api.backup"
        echo ✅ API movido para backup
    )
)

if exist "src\app\aprovacao" (
    if not exist "src\app\aprovacao.backup" (
        move "src\app\aprovacao" "src\app\aprovacao.backup"
        echo ✅ Aprovação movido para backup
    )
)

if exist "src\app\checkout" (
    if not exist "src\app\checkout.backup" (
        move "src\app\checkout" "src\app\checkout.backup"
        echo ✅ Checkout movido para backup
    )
)
echo.

REM 3. Configurar next.config
echo ⚙️ Configurando next.config...
copy "next.config.ts" "next.config.original.ts"
copy "next.config.simples.ts" "next.config.ts"
echo.

REM 4. Build
echo 🔨 Building...
npm run build
set BUILD_ERROR=%errorlevel%
echo.

REM 5. Restaurar configuração
echo 🔄 Restaurando configuração...
copy "next.config.original.ts" "next.config.ts"
del "next.config.original.ts"

REM 6. Restaurar pastas (deixar como backup para não quebrar desenvolvimento)
echo 📁 Pastas mantidas como backup para não quebrar desenvolvimento
echo.

REM 7. Verificar resultado
if %BUILD_ERROR% neq 0 (
    echo ❌ Build falhou
    pause
    exit /b 1
)

if not exist "out" (
    echo ❌ Pasta out não foi criada
    pause
    exit /b 1
)

if not exist "out\index.html" (
    echo ❌ index.html não existe
    pause
    exit /b 1
)

echo ✅ Build concluído!
echo.
echo 📁 Pasta: out\
echo 📄 Páginas geradas:
dir "out\*.html" /b
echo.

REM 8. Compactar
echo 📦 Compactando...
set timestamp=%date:~6,4%%date:~3,2%%date:~0,2%-%time:~0,2%%time:~3,2%%time:~6,2%
set timestamp=%timestamp: =0%
set filename=playcode-deploy-%timestamp%.zip

cd out
powershell -command "Compress-Archive -Path * -DestinationPath '../%filename%'"
cd ..

if exist "%filename%" (
    echo ✅ Arquivo criado: %filename%
    echo 📊 Tamanho:
    dir "%filename%" | find "%filename%"
    echo.
    echo 📤 Agora faça upload no hPanel da Hostinger!
) else (
    echo ❌ Erro ao compactar
)

echo.
pause