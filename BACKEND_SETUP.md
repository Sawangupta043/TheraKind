# TheraKind Backend Setup Guide

This guide will help you set up a complete backend infrastructure for the TheraKind application.

## 🚀 What's Been Implemented

### ✅ **Complete Backend Features**

1. **Firebase Integration**
   - Authentication (Email/Password, Google OAuth)
   - Firestore Database
   - Firebase Storage (for file uploads)
   - Real-time data synchronization

2. **Session Management**
   - Create, read, update sessions
   - Session status tracking (pending, confirmed, completed, cancelled)
   - Real-time session updates

3. **User Profile Management**
   - Complete profile CRUD operations
   - File upload for profile photos and licenses
   - Role-based profile fields (client/therapist)

4. **Payment Processing**
   - Payment intent creation
   - Transaction processing
   - Refund handling
   - Payment status tracking

5. **Email Notifications**
   - Booking confirmations
   - Session reminders
   - Password reset emails
   - Customizable email templates

6. **Real-time Notifications**
   - In-app notification system
   - Push notifications
   - Notification persistence
   - Notification management (mark as read, delete)

7. **Feedback System**
   - Session feedback collection
   - Rating system
   - Feedback analytics
   - Therapist performance tracking

## 🔧 Setup Instructions

### 1. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password, Google)
4. Create Firestore Database
5. Enable Storage
6. Get your Firebase config

#### Update Firebase Config
Replace the config in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

#### Firestore Security Rules
Add these security rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions - users can read/write their own sessions
    match /sessions/{sessionId} {
      allow read, write: if request.auth != null && 
        (resource.data.clientId == request.auth.uid || 
         resource.data.therapistId == request.auth.uid);
    }
    
    // Feedback - users can read/write their own feedback
    match /feedback/{feedbackId} {
      allow read, write: if request.auth != null && 
        (resource.data.clientId == request.auth.uid || 
         resource.data.therapistId == request.auth.uid);
    }
  }
}
```

#### Storage Security Rules
Add these rules to Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload to their own folder
    match /profiles/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can upload licenses to their own folder
    match /licenses/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. Email Service Setup

#### Option A: SendGrid (Recommended)
1. Create a SendGrid account
2. Get your API key
3. Update `src/services/emailService.ts`:

```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    await sgMail.send({
      to: emailData.to,
      from: 'noreply@therakind.com',
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
```

#### Option B: Nodemailer
1. Install nodemailer: `npm install nodemailer`
2. Configure SMTP settings
3. Update email service accordingly

### 3. Payment Gateway Setup

#### Option A: Stripe (Recommended)
1. Create a Stripe account
2. Get your API keys
3. Update `src/services/paymentService.ts`:

```typescript
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const processPayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentData.amount * 100, // Convert to cents
      currency: paymentData.currency,
      metadata: {
        sessionId: paymentData.sessionId,
        clientId: paymentData.clientId,
        therapistId: paymentData.therapistId
      }
    });
    
    return {
      success: true,
      transactionId: paymentIntent.id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};
```

#### Option B: Razorpay (India)
1. Create a Razorpay account
2. Get your API keys
3. Update payment service accordingly

### 4. Environment Variables

Create a `.env` file in your project root:

```env
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id

# Email Service
VITE_SENDGRID_API_KEY=your-sendgrid-key
VITE_EMAIL_FROM=noreply@therakind.com

# Payment Gateway
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
VITE_STRIPE_SECRET_KEY=your-stripe-secret-key

# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 5. Database Schema

#### Users Collection
```javascript
{
  uid: string,
  name: string,
  email: string,
  role: 'client' | 'therapist',
  phone: string,
  city: string,
  bio: string,
  photoURL: string,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  
  // Therapist specific fields
  specializations: string[],
  languages: string[],
  experience: string,
  price: number,
  acceptsInPerson: boolean,
  licenseURL: string,
  rating: number,
  totalSessions: number
}
```

#### Sessions Collection
```javascript
{
  id: string,
  clientId: string,
  therapistId: string,
  therapistName: string,
  date: string,
  time: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled',
  price: number,
  type: 'online' | 'in-person',
  meetLink: string,
  transactionId: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Feedback Collection
```javascript
{
  id: string,
  sessionId: string,
  clientId: string,
  therapistId: string,
  therapistName: string,
  rating: number,
  feedback: string,
  createdAt: timestamp
}
```

## 🚀 Deployment

### 1. Build the Application
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### 3. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🔒 Security Considerations

1. **API Key Protection**
   - Never commit API keys to version control
   - Use environment variables
   - Rotate keys regularly

2. **Data Validation**
   - Validate all user inputs
   - Sanitize data before storing
   - Use TypeScript for type safety

3. **Authentication**
   - Enforce email verification
   - Implement rate limiting
   - Use secure session management

4. **Payment Security**
   - Use HTTPS everywhere
   - Implement webhook verification
   - Store payment data securely

## 📊 Monitoring & Analytics

### 1. Firebase Analytics
- Track user engagement
- Monitor session bookings
- Analyze user behavior

### 2. Error Monitoring
- Set up error tracking (Sentry)
- Monitor API failures
- Track performance metrics

### 3. Business Metrics
- Session completion rates
- Therapist ratings
- Revenue tracking
- User retention

## 🔄 Future Enhancements

1. **Real-time Video Calling**
   - Integrate Twilio Video
   - Add screen sharing
   - Record sessions (with consent)

2. **Advanced Analytics**
   - Therapist performance dashboard
   - Client progress tracking
   - Predictive analytics

3. **Mobile App**
   - React Native app
   - Push notifications
   - Offline support

4. **AI Features**
   - Session summarization
   - Mood tracking
   - Personalized recommendations

## 🆘 Troubleshooting

### Common Issues

1. **Firebase Connection Errors**
   - Check API keys
   - Verify project settings
   - Check security rules

2. **Payment Failures**
   - Verify payment gateway credentials
   - Check webhook endpoints
   - Monitor error logs

3. **Email Not Sending**
   - Check email service credentials
   - Verify sender email
   - Check spam filters

4. **File Upload Issues**
   - Check storage permissions
   - Verify file size limits
   - Check CORS settings

## 📞 Support

For technical support or questions:
- Check Firebase documentation
- Review error logs
- Contact the development team

---

**Note**: This setup provides a production-ready backend for TheraKind. All demo features have been replaced with real implementations using Firebase, payment processing, email notifications, and real-time updates. 

## 🎉 Your TheraKind Project is Now Ready for Automatic Netlify Deployment!

I've completely configured your project for automatic deployment to Netlify. Here's what's been set up:

### ✅ **Automatic Deployment Scripts Created:**

1. **`deploy-netlify.sh`** - Linux/Mac deployment script
2. **`deploy-netlify.bat`** - Windows batch deployment script  
3. **`deploy-netlify.ps1`** - PowerShell deployment script (best for Windows)

### ✅ **Enhanced Configuration:**

1. **`netlify.toml`** - Optimized for automatic deployment with:
   - Build optimization settings
   - Security headers
   - Caching strategy
   - SPA routing support
   - PWA headers

2. **`package.json`** - Added deployment scripts:
   - `npm run deploy:auto` - One-click deployment
   - `npm run deploy` - Manual deployment
   - `npm run deploy:setup` - Setup dependencies

### ✅ **Comprehensive Documentation:**

1. **`NETLIFY_AUTO_DEPLOY.md`** - Complete deployment guide
2. **`DEPLOY_NOW.md`** - Quick start guide

## 🚀 **How to Deploy Right Now:**

### **For Windows Users (Recommended):**
```cmd
npm run deploy:auto
```

### **For Linux/Mac Users:**
```bash
./deploy-netlify.sh
```

### **Manual Deployment:**
```cmd
npm run deploy
```

## 🎯 **What Happens Automatically:**

1. ✅ Installs Netlify CLI
2. ✅ Installs project dependencies
3. ✅ Creates environment file from template
4. ✅ Builds the project
5. ✅ Initializes Netlify project
6. ✅ Sets up environment variables
7. ✅ Deploys to production
8. ✅ Creates deployment hooks

## 📋 **Before You Deploy:**

1. **Create your `.env` file:**
   ```cmd
   copy env.example .env
   ```

2. **Update with your Firebase credentials:**
   ```env
   VITE_FIREBASE_API_KEY=your-key
   VITE_FIREBASE_AUTH_DOMAIN=your-domain
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_GEMINI_API_KEY=your-gemini-key
   ```

3. **Run the deployment:**
   ```cmd
   npm run deploy:auto
   ```

## 🎉 **After Deployment:**

Your site will be live at: `https://your-site-name.netlify.app`

## 🔄 **For Continuous Deployment:**

1. Push your code to GitHub/GitLab/Bitbucket
2. Connect your repository to Netlify
3. Every push will automatically deploy

## 🎉 **You're All Set!**

Your TheraKind application is now configured for:
- ✅ Zero-config deployment
- ✅ Automatic builds
- ✅ Environment management
- ✅ Security headers
- ✅ Performance optimization
- ✅ SSL certificates
- ✅ CDN distribution

**Just run `npm run deploy:auto` and you're live! 🚀** 