# 🚀 TheraKind - Automatic Netlify Deployment

This guide will help you automatically deploy your TheraKind application to Netlify with zero manual configuration.

## 🎯 Quick Start

### Option 1: One-Click Deployment (Recommended)

1. **Run the automatic deployment script:**

   **For Linux/Mac:**
   ```bash
   chmod +x deploy-netlify.sh
   ./deploy-netlify.sh
   ```

   **For Windows:**
   ```cmd
   deploy-netlify.bat
   ```

2. **Follow the prompts** - The script will:
   - Install Netlify CLI
   - Install dependencies
   - Create environment file
   - Build the project
   - Deploy to Netlify
   - Set up environment variables
   - Create deployment hooks

### Option 2: Manual Git Integration

1. **Push your code to GitHub/GitLab/Bitbucket**
2. **Connect to Netlify:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Choose your repository
   - Build settings are pre-configured

## ⚙️ Pre-Configuration

The project is already configured for automatic deployment:

### ✅ Build Configuration (`netlify.toml`)
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18
- **Legacy Peer Deps**: Enabled for compatibility

### ✅ Security Headers
- XSS Protection
- Content Security Policy
- Frame Options
- Referrer Policy

### ✅ Caching Strategy
- Static assets: 1 year cache
- JavaScript/CSS: 1 year cache
- Service Worker: No cache

### ✅ SPA Routing
- All routes redirect to `index.html`
- Handles React Router properly

## 🔧 Environment Variables

### Required Variables

Create a `.env` file with these variables:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your-gemini-api-key

# App Configuration
VITE_APP_NAME=TheraKind
VITE_APP_URL=https://your-app.netlify.app
```

### Optional Variables

For full functionality, also add:

```env
# Email Service
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_EMAIL_FROM=noreply@therakind.com

# Payment Gateway
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_STRIPE_SECRET_KEY=your-stripe-secret-key
```

## 🔄 Automatic Deployment Setup

### Git Integration

1. **Connect Repository:**
   - Go to Netlify Dashboard
   - Click "New site from Git"
   - Choose your Git provider
   - Select your repository

2. **Build Settings (Auto-configured):**
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Environment Variables:**
   - Go to Site Settings > Environment Variables
   - Add all variables from your `.env` file

### Deployment Hooks

The script creates deployment hooks for automatic triggers:

```bash
# Get your deployment hook URL
netlify deploy-hooks:list

# Use the URL to trigger deployments
curl -X POST https://api.netlify.com/build_hooks/YOUR_HOOK_ID
```

## 🚀 Deployment Scripts

### Linux/Mac Script (`deploy-netlify.sh`)

```bash
#!/bin/bash
# Features:
# - Automatic Netlify CLI installation
# - Dependency installation with legacy peer deps
# - Environment file validation
# - Build process
# - Netlify initialization
# - Environment variable setup
# - Production deployment
# - Deployment hook creation
```

### Windows Script (`deploy-netlify.bat`)

```cmd
@echo off
REM Features:
REM - Same functionality as Linux script
REM - Windows-compatible commands
REM - Error handling
REM - User-friendly output
```

## 📊 Deployment Monitoring

### Build Logs
- View real-time build logs in Netlify dashboard
- Monitor build performance
- Debug build failures

### Site Analytics
- Enable Netlify Analytics
- Monitor visitor data
- Track performance metrics

### Error Tracking
- Set up error monitoring (Sentry, LogRocket)
- Monitor JavaScript errors
- Track user experience issues

## 🔒 Security Features

### Content Security Policy
```javascript
// Configured in netlify.toml
Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://www.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firebase.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://storage.googleapis.com https://generativelanguage.googleapis.com; frame-src 'self' https://www.google.com;"
```

### Security Headers
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 🎯 Performance Optimization

### Build Optimizations
- Code splitting with manual chunks
- Tree shaking for unused code
- Minification of assets
- Compression of images

### Caching Strategy
- Static assets: 1 year cache
- JavaScript/CSS: 1 year cache
- Service Worker: No cache
- HTML: Pretty URLs enabled

### Bundle Analysis
```bash
# Analyze bundle size
npm run build -- --analyze

# Check chunk sizes
npm run build -- --report
```

## 🔧 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check Node version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm ci --legacy-peer-deps

# Check for TypeScript errors
npm run lint
```

#### Environment Variables
- Ensure all variables start with `VITE_`
- Check for typos in variable names
- Verify values are correct
- Set variables in Netlify dashboard

#### Firebase Issues
- Verify Firebase project is public
- Check API keys are correct
- Ensure Firebase services are enabled
- Test Firebase connection locally

#### Routing Issues
- Ensure `netlify.toml` has proper redirects
- Check that all routes redirect to `index.html`
- Test routes in production build

### Debug Commands

```bash
# Test build locally
npm run build

# Preview production build
npm run preview

# Check Netlify status
netlify status

# View deployment logs
netlify logs

# Test environment variables
netlify env:list
```

## 📈 Post-Deployment

### Testing Checklist
- [ ] Homepage loads correctly
- [ ] Authentication works
- [ ] User registration/login
- [ ] Profile management
- [ ] Session booking
- [ ] Payment processing
- [ ] File uploads
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Performance metrics

### Monitoring Setup
- [ ] Enable Netlify Analytics
- [ ] Set up error tracking
- [ ] Configure uptime monitoring
- [ ] Set up performance monitoring
- [ ] Enable security scanning

### Maintenance
- [ ] Regular dependency updates
- [ ] Security audits
- [ ] Performance monitoring
- [ ] Backup verification
- [ ] SSL certificate renewal

## 🎉 Success!

Your TheraKind application is now automatically deployed on Netlify with:

✅ **Zero-config deployment**  
✅ **Automatic builds**  
✅ **Environment management**  
✅ **Security headers**  
✅ **Performance optimization**  
✅ **Caching strategy**  
✅ **Error handling**  
✅ **Monitoring setup**  

## 📞 Support

### Netlify Support
- [Documentation](https://docs.netlify.com)
- [Community](https://community.netlify.com)
- [Status](https://status.netlify.com)

### Application Support
- Check `BACKEND_SETUP.md` for Firebase configuration
- Review `FIREBASE_SETUP.md` for detailed setup
- Contact development team for issues

---

**Your TheraKind application is ready for production! 🚀** 