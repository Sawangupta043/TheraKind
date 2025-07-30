@echo off
echo 🚀 Starting TheraKind deployment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Run tests (if available)
echo 🧪 Running tests...
call npm test 2>nul
if errorlevel 1 (
    echo ℹ️  No tests found or tests failed, continuing with build...
)

REM Build the application
echo 🔨 Building application...
call npm run build

REM Check if build was successful
if errorlevel 0 (
    echo ✅ Build successful!
    echo 📁 Build output: dist/
    echo.
    echo 🎉 Ready for deployment!
    echo.
    echo Next steps:
    echo 1. Push your code to Git repository
    echo 2. Connect to Netlify
    echo 3. Set environment variables in Netlify dashboard
    echo 4. Deploy!
    echo.
    echo 📖 See NETLIFY_DEPLOYMENT.md for detailed instructions
) else (
    echo ❌ Build failed!
    pause
    exit /b 1
)

pause 