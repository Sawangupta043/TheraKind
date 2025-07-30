import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { resendEmailVerification } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const EmailVerification: React.FC = () => {
  const { user } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      await resendEmailVerification();
      setResendSuccess(true);
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  if (!user || user.emailVerified) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">
            Email Verification Required
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Please check your email ({user.email}) and click the verification link to complete your registration.
          </p>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResendVerification}
              disabled={isResending}
              className="inline-flex items-center px-3 py-1.5 border border-yellow-300 rounded-md text-xs font-medium text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-3 h-3 mr-1" />
                  Resend Email
                </>
              )}
            </button>
            
            {resendSuccess && (
              <div className="flex items-center text-xs text-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Email sent!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 