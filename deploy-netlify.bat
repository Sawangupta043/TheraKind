@echo off
setlocal enabledelayedexpansion

REM TheraKind - Netlify Auto Deployment Script (Windows)
REM This script automatically configures and deploys the project to Netlify

echo 🚀 TheraKind Netlify Auto Deployment Script
echo ==========================================

REM Check if Netlify CLI is installed
echo Checking Netlify CLI...
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Netlify CLI not found. Installing...
    npm install -g netlify-cli
    if %errorlevel% neq 0 (
        echo ❌ Failed to install Netlify CLI
        pause
        exit /b 1
    )
    echo ✅ Netlify CLI installed successfully
) else (
    echo ✅ Netlify CLI already installed
)

REM Install dependencies
echo ℹ️  Installing dependencies...
npm ci --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from template...
    copy env.example .env
    echo ℹ️  Please update the .env file with your actual values:
    echo.
    type .env
    echo.
    echo ⚠️  After updating .env, run this script again.
    pause
    exit /b 1
) else (
    echo ✅ .env file found
)

REM Build the project
echo ℹ️  Building the project...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)
echo ✅ Project built successfully

REM Initialize Netlify (if not already done)
if not exist ".netlify\state.json" (
    echo ℹ️  Initializing Netlify project...
    netlify init --manual
    if %errorlevel% neq 0 (
        echo ❌ Failed to initialize Netlify project
        pause
        exit /b 1
    )
    echo ✅ Netlify project initialized
) else (
    echo ✅ Netlify project already initialized
)

REM Set up environment variables on Netlify
echo ℹ️  Setting up environment variables on Netlify...
for /f "tokens=1,* delims==" %%a in (.env) do (
    set "line=%%a"
    if not "!line:~0,1!"=="#" if not "!line!"=="" (
        set "key=%%a"
        set "value=%%b"
        if "!key:~0,6!"=="VITE_" (
            echo Setting !key!
            netlify env:set "!key!" "!value!" --context production
        )
    )
)
echo ✅ Environment variables configured

REM Deploy to Netlify
echo ℹ️  Deploying to Netlify...
netlify deploy --prod --dir=dist --message="Auto deployment from script"
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)
echo ✅ Deployment completed successfully!

REM Create deployment hooks
echo ℹ️  Creating deployment hooks...
netlify deploy-hooks:create --name "Auto Deploy"
if %errorlevel% equ 0 (
    echo ✅ Deployment hook created
    echo Add this webhook URL to your Git repository for automatic deployments
) else (
    echo ⚠️  Could not create deployment hook automatically
)

echo.
echo 🎉 Deployment completed successfully!
echo.
echo ℹ️  Next steps:
echo 1. Visit your Netlify dashboard to get your site URL
echo 2. Configure your custom domain (optional)
echo 3. Set up automatic deployments from your Git repository
echo 4. Test all functionality on the live site
echo.
echo ℹ️  For automatic deployments, connect your Git repository to Netlify:
echo 1. Go to your Netlify dashboard
echo 2. Click 'New site from Git'
echo 3. Choose your repository
echo 4. Set build command: npm ci && npm run build
echo 5. Set publish directory: dist
echo.
pause 