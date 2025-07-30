# Firebase Authentication Setup Guide

## Overview
TheraKind now uses Firebase Authentication for secure user login and registration. This guide will help you set up Firebase for your project.

## Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "TheraKind"
4. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Enable "Google" (optional)

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location close to your users

### 4. Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with name "TheraKind Web"
5. Copy the config object

### 5. Update Firebase Config
Replace the placeholder config in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Features Added

### ✅ Authentication
- Email/Password sign up and sign in
- Google sign-in (optional)
- Secure logout
- User profile management

### ✅ User Management
- User profiles stored in Firestore
- Role-based access (client/therapist)
- Profile data persistence

### ✅ Security
- Firebase Auth handles security
- Protected routes (can be added)
- Secure session management

## Usage

### For Users
1. **Sign Up**: Users can create accounts with email/password
2. **Sign In**: Existing users can sign in with email or Google
3. **Profile**: User data is automatically saved and retrieved
4. **Logout**: Secure logout with session cleanup

### For Developers
- `useAuth()` hook provides user state
- `user` contains Firebase User object
- `userProfile` contains custom profile data
- Authentication state is managed globally

## Security Rules (Firestore)

Add these security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Next Steps

1. **Protected Routes**: Add route protection for authenticated users
2. **Email Verification**: Enable email verification in Firebase
3. **Password Reset**: Add password reset functionality
4. **Profile Management**: Add profile editing features
5. **Admin Panel**: Add admin functionality for therapists

## Troubleshooting

### Common Issues
1. **Config Error**: Ensure Firebase config is correct
2. **Auth Domain**: Add your domain to authorized domains
3. **Firestore Rules**: Check security rules in Firebase Console
4. **CORS Issues**: Add your domain to Firebase hosting

### Error Messages
- "Firebase: Error (auth/user-not-found)": User doesn't exist
- "Firebase: Error (auth/wrong-password)": Incorrect password
- "Firebase: Error (auth/email-already-in-use)": Email already registered

## Support
For Firebase-specific issues, refer to the [Firebase Documentation](https://firebase.google.com/docs). 