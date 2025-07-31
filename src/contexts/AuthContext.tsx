import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getUserProfile, getGoogleRedirectResult } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  userProfile: any;
  loading: boolean;
  showRoleSelection: boolean;
  setShowRoleSelection: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  showRoleSelection: false,
  setShowRoleSelection: () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  useEffect(() => {
    // Check for redirect result first
    const checkRedirectResult = async () => {
      try {
        const result = await getGoogleRedirectResult();
        if (result) {
          console.log('Google sign-in redirect successful');
          setShouldRedirect(true);
        }
      } catch (error) {
        console.error('Error checking redirect result:', error);
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
          
          // If user has no role assigned (new Google sign-in), show role selection
          if (profile && profile.role === null) {
            setShowRoleSelection(true);
          }
          
          // Set flag to trigger redirect after profile is loaded
          if (shouldRedirect) {
            setShouldRedirect(false);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
        setShowRoleSelection(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [shouldRedirect]);

  const value = {
    user,
    userProfile,
    loading,
    showRoleSelection,
    setShowRoleSelection,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};