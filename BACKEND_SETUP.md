# TheraKind Backend Setup Guide

This guide will help you set up the backend infrastructure for the TheraKind application using Firebase.

## ⚡️ Actionable Setup Steps

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

---

## ⚠️ Payment Processing (Manual for Now)

> **Note:** Payment processing is currently handled manually via a personal account. No payment gateway (Stripe/Razorpay) is integrated at this time. You may record payment confirmations in Firestore for tracking, but all transactions must be completed outside the app.

- When a client books a session, provide them with your payment details (UPI, bank transfer, etc.).
- After payment is received, you can manually update the session status in Firestore to 'confirmed'.
- You may add a Firestore collection (e.g., `payments`) to log payment confirmations for your records.

**Automated payment integration (Stripe, Razorpay, etc.) can be added in the future.**

### Firestore Example: Recording Payments
If you want to log payment confirmations in Firestore:
```javascript
// payments/{paymentId}
{
  sessionId: string,
  clientId: string,
  therapistId: string,
  amount: number,
  method: string, // e.g., 'UPI', 'bank transfer'
  status: 'pending' | 'confirmed',
  createdAt: timestamp,
  confirmedAt: timestamp
}
```
You can update the session document to reference the payment record or simply update its status after manual confirmation.

---

### 3. Environment Variables
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
# Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key
```

### 4. Database Schema
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

---

### 5. Deployment

#### Build the Application
```bash
npm run build
```

#### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

#### Deploy to Vercel (Optional)
```bash
npm install -g vercel
vercel
```

---

### 6. Security Considerations
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Validate all user inputs
- Sanitize data before storing
- Use TypeScript for type safety
- Enforce email verification
- Use secure session management
- Use HTTPS everywhere

---

**Your backend is now ready!** 