#!/bin/bash

# TheraKind - Netlify Auto Deployment Script
# This script automatically configures and deploys the project to Netlify

set -e

echo "🚀 TheraKind Netlify Auto Deployment Script"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Netlify CLI is installed
check_netlify_cli() {
    if ! command -v netlify &> /dev/null; then
        print_warning "Netlify CLI not found. Installing..."
        npm install -g netlify-cli
        print_status "Netlify CLI installed successfully"
    else
        print_status "Netlify CLI already installed"
    fi
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm ci --legacy-peer-deps
    print_status "Dependencies installed successfully"
}

# Build the project
build_project() {
    print_info "Building the project..."
    npm run build
    print_status "Project built successfully"
}

# Check if .env file exists
check_env_file() {
    if [ ! -f ".env" ]; then
        print_warning "No .env file found. Creating from template..."
        cp env.example .env
        print_info "Please update the .env file with your actual values:"
        echo ""
        cat .env
        echo ""
        print_warning "After updating .env, run this script again."
        exit 1
    else
        print_status ".env file found"
    fi
}

# Initialize Netlify (if not already done)
init_netlify() {
    if [ ! -f ".netlify/state.json" ]; then
        print_info "Initializing Netlify project..."
        netlify init --manual
        print_status "Netlify project initialized"
    else
        print_status "Netlify project already initialized"
    fi
}

# Deploy to Netlify
deploy_to_netlify() {
    print_info "Deploying to Netlify..."
    
    # Deploy with production settings
    netlify deploy --prod --dir=dist --message="Auto deployment from script"
    
    print_status "Deployment completed successfully!"
}

# Set up environment variables on Netlify
setup_env_variables() {
    print_info "Setting up environment variables on Netlify..."
    
    # Read from .env file and set on Netlify
    if [ -f ".env" ]; then
        while IFS= read -r line; do
            # Skip comments and empty lines
            if [[ ! "$line" =~ ^# ]] && [[ -n "$line" ]]; then
                key=$(echo "$line" | cut -d'=' -f1)
                value=$(echo "$line" | cut -d'=' -f2-)
                
                # Only set VITE_ variables
                if [[ "$key" == VITE_* ]]; then
                    print_info "Setting $key"
                    netlify env:set "$key" "$value" --context production
                fi
            fi
        done < .env
    fi
    
    print_status "Environment variables configured"
}

# Create deployment hooks
create_deploy_hooks() {
    print_info "Creating deployment hooks..."
    
    # Create a deploy hook for automatic deployments
    hook_url=$(netlify deploy-hooks:create --name "Auto Deploy" --url "https://api.netlify.com/build_hooks/$(netlify sites:list --json | jq -r '.[0].id)')
    
    if [ $? -eq 0 ]; then
        print_status "Deployment hook created: $hook_url"
        echo "Add this webhook URL to your Git repository for automatic deployments"
    else
        print_warning "Could not create deployment hook automatically"
    fi
}

# Main deployment function
main() {
    echo ""
    print_info "Starting automatic deployment process..."
    
    # Check prerequisites
    check_netlify_cli
    
    # Install dependencies
    install_dependencies
    
    # Check environment file
    check_env_file
    
    # Build project
    build_project
    
    # Initialize Netlify
    init_netlify
    
    # Set up environment variables
    setup_env_variables
    
    # Deploy to Netlify
    deploy_to_netlify
    
    # Create deployment hooks
    create_deploy_hooks
    
    echo ""
    print_status "🎉 Deployment completed successfully!"
    echo ""
    print_info "Next steps:"
    echo "1. Visit your Netlify dashboard to get your site URL"
    echo "2. Configure your custom domain (optional)"
    echo "3. Set up automatic deployments from your Git repository"
    echo "4. Test all functionality on the live site"
    echo ""
    print_info "For automatic deployments, connect your Git repository to Netlify:"
    echo "1. Go to your Netlify dashboard"
    echo "2. Click 'New site from Git'"
    echo "3. Choose your repository"
    echo "4. Set build command: npm ci && npm run build"
    echo "5. Set publish directory: dist"
    echo ""
}

# Run main function
main "$@" 