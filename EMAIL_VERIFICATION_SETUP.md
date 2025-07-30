# Email Verification Setup Guide

## Overview
TheraKind now includes email verification functionality to ensure user account security. This guide will help you enable and configure email verification in Firebase.

## Firebase Console Setup

### 1. Enable Email Verification
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your TheraKind project
3. Go to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Enable **Email link (passwordless sign-in)** (optional)
6. Save changes

### 2. Configure Email Templates
1. In Firebase Console, go to **Authentication** → **Templates**
2. Click on **Email verification**
3. Customize the email template:
   - **Subject**: "Verify your TheraKind account"
   - **Sender name**: "TheraKind"
   - **Reply-to**: "support@therakind.com"
   - **Message**: Customize the verification email content

### 3. Set Up Custom Domain (Optional)
1. Go to **Authentication** → **Settings** → **Authorized domains**
2. Add your custom domain (e.g., `therakind.com`)
3. This allows users to verify emails from your domain

## Features Added

### ✅ **Email Verification**
- Automatic email verification on signup
- Resend verification email functionality
- Verification status tracking
- User-friendly verification notices

### ✅ **Password Reset**
- Secure password reset via email
- Custom password reset form
- Success/error handling
- Rate limiting protection

### ✅ **User Experience**
- Clear verification status indicators
- Non-intrusive verification notices
- Easy resend functionality
- Mobile-responsive design

## How It Works

### **For New Users:**
1. User signs up with email/password
2. Firebase automatically sends verification email
3. User clicks verification link in email
4. Account is marked as verified
5. User can access all features

### **For Unverified Users:**
1. Verification notice appears on dashboard
2. User can resend verification email
3. Clear instructions provided
4. No access restrictions (can still use app)

### **For Password Reset:**
1. User clicks "Forgot password?"
2. Enters email address
3. Firebase sends reset link
4. User clicks link and sets new password

## Email Templates

### **Verification Email Template:**
```
Subject: Verify your TheraKind account

Hi [User Name],

Welcome to TheraKind! Please verify your email address by clicking the link below:

[VERIFICATION LINK]

This link will expire in 24 hours.

If you didn't create this account, you can safely ignore this email.

Best regards,
The TheraKind Team
```

### **Password Reset Email Template:**
```
Subject: Reset your TheraKind password

Hi [User Name],

You requested a password reset for your TheraKind account. Click the link below to set a new password:

[RESET LINK]

This link will expire in 1 hour.

If you didn't request this reset, you can safely ignore this email.

Best regards,
The TheraKind Team
```

## Security Features

### **Email Verification:**
- ✅ 24-hour expiration on verification links
- ✅ One-time use verification links
- ✅ Secure token generation
- ✅ Rate limiting protection

### **Password Reset:**
- ✅ 1-hour expiration on reset links
- ✅ One-time use reset links
- ✅ Secure token generation
- ✅ Rate limiting protection

## Testing

### **Test Email Verification:**
1. Create a new account
2. Check email for verification link
3. Click verification link
4. Verify status updates in app

### **Test Password Reset:**
1. Go to login page
2. Click "Forgot password?"
3. Enter email address
4. Check email for reset link
5. Set new password

## Troubleshooting

### **Common Issues:**
1. **Emails not received**: Check spam folder
2. **Verification link expired**: Use resend function
3. **Reset link not working**: Request new reset
4. **Template not updating**: Clear browser cache

### **Firebase Console Issues:**
1. **Authentication not enabled**: Enable in Firebase Console
2. **Domain not authorized**: Add domain to authorized list
3. **Template not saving**: Check permissions
4. **Rate limiting**: Wait before retrying

## Best Practices

### **For Users:**
- Check spam folder for verification emails
- Use a valid email address
- Complete verification within 24 hours
- Keep password reset links secure

### **For Developers:**
- Monitor verification success rates
- Set up email delivery monitoring
- Configure proper error handling
- Test email templates regularly

## Next Steps

1. **Custom Email Templates**: Brand your verification emails
2. **Domain Verification**: Set up custom domain
3. **Analytics**: Track verification success rates
4. **Advanced Security**: Add additional verification methods

## Support
For Firebase-specific issues, refer to the [Firebase Authentication Documentation](https://firebase.google.com/docs/auth). 