# TheraKind - Netlify Deployment Guide

This guide will help you deploy your TheraKind application to Netlify.

## 🚀 Quick Deploy

### Option 1: Deploy from Git (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Sign up/Login with your Git provider
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click "Deploy site"

### Option 2: Manual Deploy

1. **Build your application**
   ```bash
   npm run build
   ```

2. **Drag and drop the `dist` folder to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Drag your `dist` folder to the deploy area

## ⚙️ Environment Variables Setup

### Required Environment Variables

Set these in your Netlify dashboard under **Site settings > Environment variables**:

#### Firebase Configuration
```
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

#### Gemini AI Configuration
```
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### Optional Environment Variables

For full functionality, also add:

#### Email Service
```
VITE_SENDGRID_API_KEY=your-sendgrid-api-key
VITE_EMAIL_FROM=noreply@therakind.com
```

#### Payment Gateway
```
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_STRIPE_SECRET_KEY=your-stripe-secret-key
```

#### App Configuration
```
VITE_APP_NAME=TheraKind
VITE_APP_URL=https://your-app.netlify.app
```

## 🔧 Build Configuration

The application is configured with:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18 (set in `netlify.toml`)

## 🌐 Domain Configuration

### Custom Domain Setup

1. **Add Custom Domain**
   - Go to **Site settings > Domain management**
   - Click "Add custom domain"
   - Enter your domain name

2. **DNS Configuration**
   - Add CNAME record pointing to your Netlify site
   - Or use Netlify DNS for automatic configuration

### Default Netlify Domain

Your site will be available at: `https://your-site-name.netlify.app`

## 🔒 Security Headers

The application includes security headers configured in `netlify.toml`:

- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: XSS protection
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **Referrer-Policy**: Controls referrer information
- **Content-Security-Policy**: Restricts resource loading

## 📱 PWA Configuration

The application is configured as a Progressive Web App with:

- **Service Worker**: For offline functionality
- **Manifest**: App installation capabilities
- **Responsive Design**: Works on all devices

## 🔄 Continuous Deployment

### Automatic Deployments

- **Production**: Deploys from `main` branch
- **Preview**: Deploys from pull requests
- **Branch Deployments**: Deploys from feature branches

### Deploy Hooks

You can trigger deployments via webhooks:

1. Go to **Site settings > Build & deploy > Deploy hooks**
2. Create a new deploy hook
3. Use the webhook URL to trigger deployments

## 📊 Performance Optimization

### Build Optimizations

- **Code Splitting**: Automatic chunk splitting
- **Tree Shaking**: Removes unused code
- **Minification**: Compressed JavaScript and CSS
- **Caching**: Long-term caching for static assets

### Performance Monitoring

Monitor your site performance:

1. **Netlify Analytics**: Built-in performance monitoring
2. **Lighthouse**: Run performance audits
3. **Core Web Vitals**: Monitor loading metrics

## 🐛 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Check build logs in Netlify dashboard
# Common fixes:
npm install --legacy-peer-deps
npm run build --verbose
```

#### Environment Variables
- Ensure all variables start with `VITE_`
- Check for typos in variable names
- Verify values are correct

#### Routing Issues
- Ensure `netlify.toml` has proper redirects
- Check that all routes redirect to `index.html`

#### Firebase Issues
- Verify Firebase project is public or has proper CORS settings
- Check Firebase API keys are correct
- Ensure Firebase services are enabled

### Debug Commands

```bash
# Local build test
npm run build

# Check bundle size
npm run build -- --analyze

# Test production build locally
npm run preview
```

## 📈 Analytics & Monitoring

### Netlify Analytics

Enable analytics in your Netlify dashboard:

1. Go to **Site settings > Analytics**
2. Enable "Netlify Analytics"
3. View visitor data and performance metrics

### Error Tracking

Consider adding error tracking:

- **Sentry**: For JavaScript error monitoring
- **LogRocket**: For session replay
- **Bugsnag**: For error reporting

## 🔄 Updates & Maintenance

### Updating Dependencies

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Database Backups

For Firebase data:

1. **Firestore**: Use Firebase Console export
2. **Storage**: Download files manually
3. **Authentication**: Export user data

## 📞 Support

### Netlify Support

- **Documentation**: [docs.netlify.com](https://docs.netlify.com)
- **Community**: [community.netlify.com](https://community.netlify.com)
- **Status**: [status.netlify.com](https://status.netlify.com)

### Application Support

For TheraKind-specific issues:

1. Check the `BACKEND_SETUP.md` guide
2. Review Firebase configuration
3. Verify environment variables
4. Check browser console for errors

## 🎉 Deployment Checklist

Before deploying, ensure:

- [ ] All environment variables are set
- [ ] Firebase project is configured
- [ ] Build passes locally (`npm run build`)
- [ ] All routes work correctly
- [ ] Authentication flows work
- [ ] File uploads work (if using)
- [ ] Payment processing works (if using)
- [ ] Email notifications work (if using)
- [ ] Custom domain is configured (if using)
- [ ] SSL certificate is active
- [ ] Analytics are enabled
- [ ] Error monitoring is set up

---

**Your TheraKind application is now ready for production deployment on Netlify!** 🚀 