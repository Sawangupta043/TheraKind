# TheraKind - Netlify Auto Deployment Script (PowerShell)
# This script automatically configures and deploys the project to Netlify

param(
    [switch]$SkipEnvCheck,
    [switch]$Force
)

# Set error action preference
$ErrorActionPreference = "Stop"

Write-Host "🚀 TheraKind Netlify Auto Deployment Script" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

# Check if Netlify CLI is installed
function Test-NetlifyCLI {
    try {
        $null = Get-Command netlify -ErrorAction Stop
        Write-Status "Netlify CLI already installed"
        return $true
    }
    catch {
        Write-Warning "Netlify CLI not found. Installing..."
        try {
            npm install -g netlify-cli
            Write-Status "Netlify CLI installed successfully"
            return $true
        }
        catch {
            Write-Error "Failed to install Netlify CLI"
            return $false
        }
    }
}

# Install dependencies
function Install-Dependencies {
    Write-Info "Installing dependencies..."
    try {
        npm ci --legacy-peer-deps
        Write-Status "Dependencies installed successfully"
        return $true
    }
    catch {
        Write-Error "Failed to install dependencies"
        return $false
    }
}

# Check if .env file exists
function Test-EnvFile {
    if (-not (Test-Path ".env")) {
        Write-Warning "No .env file found. Creating from template..."
        try {
            Copy-Item "env.example" ".env"
            Write-Info "Please update the .env file with your actual values:"
            Write-Host ""
            Get-Content ".env"
            Write-Host ""
            Write-Warning "After updating .env, run this script again."
            return $false
        }
        catch {
            Write-Error "Failed to create .env file"
            return $false
        }
    }
    else {
        Write-Status ".env file found"
        return $true
    }
}

# Build the project
function Build-Project {
    Write-Info "Building the project..."
    try {
        npm run build
        Write-Status "Project built successfully"
        return $true
    }
    catch {
        Write-Error "Build failed"
        return $false
    }
}

# Initialize Netlify
function Initialize-Netlify {
    if (-not (Test-Path ".netlify\state.json")) {
        Write-Info "Initializing Netlify project..."
        try {
            netlify init --manual
            Write-Status "Netlify project initialized"
            return $true
        }
        catch {
            Write-Error "Failed to initialize Netlify project"
            return $false
        }
    }
    else {
        Write-Status "Netlify project already initialized"
        return $true
    }
}

# Set up environment variables on Netlify
function Set-NetlifyEnvVars {
    Write-Info "Setting up environment variables on Netlify..."
    try {
        if (Test-Path ".env") {
            $envContent = Get-Content ".env"
            foreach ($line in $envContent) {
                if ($line -and -not $line.StartsWith("#")) {
                    $parts = $line.Split("=", 2)
                    if ($parts.Length -eq 2) {
                        $key = $parts[0].Trim()
                        $value = $parts[1].Trim()
                        
                        if ($key.StartsWith("VITE_")) {
                            Write-Info "Setting $key"
                            netlify env:set $key $value --context production
                        }
                    }
                }
            }
        }
        Write-Status "Environment variables configured"
        return $true
    }
    catch {
        Write-Warning "Could not set all environment variables automatically"
        return $false
    }
}

# Deploy to Netlify
function Deploy-ToNetlify {
    Write-Info "Deploying to Netlify..."
    try {
        netlify deploy --prod --dir=dist --message="Auto deployment from PowerShell script"
        Write-Status "Deployment completed successfully!"
        return $true
    }
    catch {
        Write-Error "Deployment failed"
        return $false
    }
}

# Create deployment hooks
function New-DeployHook {
    Write-Info "Creating deployment hooks..."
    try {
        netlify deploy-hooks:create --name "Auto Deploy"
        Write-Status "Deployment hook created"
        Write-Info "Add this webhook URL to your Git repository for automatic deployments"
        return $true
    }
    catch {
        Write-Warning "Could not create deployment hook automatically"
        return $false
    }
}

# Main deployment function
function Start-Deployment {
    Write-Host ""
    Write-Info "Starting automatic deployment process..."
    
    # Check prerequisites
    if (-not (Test-NetlifyCLI)) {
        Write-Error "Netlify CLI installation failed"
        exit 1
    }
    
    # Install dependencies
    if (-not (Install-Dependencies)) {
        Write-Error "Dependency installation failed"
        exit 1
    }
    
    # Check environment file (unless skipped)
    if (-not $SkipEnvCheck) {
        if (-not (Test-EnvFile)) {
            Write-Error "Environment file setup failed"
            exit 1
        }
    }
    
    # Build project
    if (-not (Build-Project)) {
        Write-Error "Build failed"
        exit 1
    }
    
    # Initialize Netlify
    if (-not (Initialize-Netlify)) {
        Write-Error "Netlify initialization failed"
        exit 1
    }
    
    # Set up environment variables
    Set-NetlifyEnvVars
    
    # Deploy to Netlify
    if (-not (Deploy-ToNetlify)) {
        Write-Error "Deployment failed"
        exit 1
    }
    
    # Create deployment hooks
    New-DeployHook
    
    Write-Host ""
    Write-Status "🎉 Deployment completed successfully!"
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "1. Visit your Netlify dashboard to get your site URL"
    Write-Host "2. Configure your custom domain (optional)"
    Write-Host "3. Set up automatic deployments from your Git repository"
    Write-Host "4. Test all functionality on the live site"
    Write-Host ""
    Write-Info "For automatic deployments, connect your Git repository to Netlify:"
    Write-Host "1. Go to your Netlify dashboard"
    Write-Host "2. Click 'New site from Git'"
    Write-Host "3. Choose your repository"
    Write-Host "4. Set build command: npm ci && npm run build"
    Write-Host "5. Set publish directory: dist"
    Write-Host ""
}

# Run main function
Start-Deployment 