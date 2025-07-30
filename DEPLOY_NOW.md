# 🚀 Deploy TheraKind to Netlify - NOW!

## ⚡ One-Click Deployment

### For Windows Users:
```cmd
npm run deploy:auto
```

### For Linux/Mac Users:
```bash
./deploy-netlify.sh
```

### Manual Deployment:
```cmd
npm run deploy
```

## 🎯 What Happens Automatically

✅ **Netlify CLI Installation**  
✅ **Dependency Installation**  
✅ **Environment Setup**  
✅ **Project Build**  
✅ **Netlify Initialization**  
✅ **Environment Variables**  
✅ **Production Deployment**  
✅ **Deployment Hooks**  

## 📋 Prerequisites

1. **Node.js 18+** installed
2. **Git repository** with your code
3. **Firebase project** configured
4. **Environment variables** ready

## 🔧 Quick Setup

### 1. Environment Variables
Create `.env` file from template:
```cmd
copy env.example .env
```

Update with your values:
```env
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender
VITE_FIREBASE_APP_ID=your-app-id
VITE_GEMINI_API_KEY=your-gemini-key
```

### 2. Run Deployment
```cmd
npm run deploy:auto
```

### 3. Follow Prompts
- Login to Netlify when prompted
- Choose/create site
- Wait for deployment

## 🌐 Your Site is Live!

After deployment, your site will be available at:
`https://your-site-name.netlify.app`

## 🔄 Automatic Deployments

### Connect Git Repository:
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Click "New site from Git"
3. Choose your repository
4. Build settings are pre-configured

### Build Settings (Auto-configured):
- **Build Command**: `npm ci && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18

## 🆘 Troubleshooting

### Common Issues:

**Build Fails:**
```cmd
npm run deploy:setup
```

**Environment Variables:**
- Check all variables start with `VITE_`
- Verify values in Netlify dashboard

**Firebase Issues:**
- Ensure Firebase project is public
- Check API keys are correct

**Netlify CLI:**
```cmd
npm install -g netlify-cli
```

## 📞 Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Backend Setup**: See `BACKEND_SETUP.md`

---

## 🎉 Success!

Your TheraKind application is now live on Netlify with:
- ✅ Automatic deployments
- ✅ Environment management
- ✅ Security headers
- ✅ Performance optimization
- ✅ SSL certificate
- ✅ CDN distribution

**Ready for production! 🚀** 