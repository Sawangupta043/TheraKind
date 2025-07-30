#!/bin/bash

# TheraKind Deployment Script
echo "🚀 Starting TheraKind deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests (if available)
if [ -f "package.json" ] && grep -q "\"test\":" package.json; then
    echo "🧪 Running tests..."
    npm test
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📁 Build output: dist/"
    echo ""
    echo "🎉 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to Git repository"
    echo "2. Connect to Netlify"
    echo "3. Set environment variables in Netlify dashboard"
    echo "4. Deploy!"
    echo ""
    echo "📖 See NETLIFY_DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed!"
    exit 1
fi 