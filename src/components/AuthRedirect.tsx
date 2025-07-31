import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthRedirect: React.FC = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Don't redirect if still loading
    if (loading) return;

    // If user is authenticated and has a profile
    if (user && userProfile) {
      const currentPath = location.pathname;
      
      // If user has no role assigned, don't redirect (let role selection modal handle it)
      if (userProfile.role === null) {
        return;
      }
      
      // If user is on home page, redirect to appropriate dashboard
      if (currentPath === '/') {
        if (userProfile.role === 'therapist') {
          navigate('/therapist-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }
      
      // If user is on login/register page, redirect to appropriate dashboard
      if (currentPath === '/login' || currentPath === '/register') {
        if (userProfile.role === 'therapist') {
          navigate('/therapist-dashboard');
        } else {
          navigate('/client-dashboard');
        }
      }
    }
  }, [user, userProfile, loading, navigate, location.pathname]);

  // This component doesn't render anything
  return null;
};

export default AuthRedirect; 