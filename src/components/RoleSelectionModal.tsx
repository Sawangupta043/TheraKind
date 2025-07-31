import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Heart, X } from 'lucide-react';
import { updateUserProfile } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose }) => {
  // Early return if modal is not open - this prevents useNavigate from being called
  if (!isOpen) return null;
  
  const [selectedRole, setSelectedRole] = useState<'client' | 'therapist'>('client');
  const [loading, setLoading] = useState(false);
  const [navigationReady, setNavigationReady] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Ensure navigation is ready before allowing role selection
  useEffect(() => {
    setNavigationReady(true);
  }, []);

  const handleRoleSelection = async () => {
    if (!user || !navigationReady) return;
    
    setLoading(true);
    try {
      // Update user profile with selected role
      await updateUserProfile(user.uid, {
        role: selectedRole,
        isVerified: selectedRole === 'client' // Clients are auto-verified, therapists need verification
      });
      
      // Redirect to appropriate dashboard
      if (selectedRole === 'therapist') {
        navigate('/therapist-dashboard');
      } else {
        navigate('/client-dashboard');
      }
      
      onClose();
    } catch (error) {
      console.error('Error updating user role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Choose Your Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Please select your role to complete your account setup:
        </p>
        
        <div className="space-y-4 mb-6">
          <button
            onClick={() => setSelectedRole('client')}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'client'
                ? 'border-purple-500 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-purple-300 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">I need therapy</div>
                <div className="text-sm opacity-75">I'm looking for mental health support</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedRole('therapist')}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
              selectedRole === 'therapist'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <div className="font-medium">I'm a therapist</div>
                <div className="text-sm opacity-75">I provide mental health services</div>
              </div>
            </div>
          </button>
        </div>
        
        <button
          onClick={handleRoleSelection}
          disabled={loading || !navigationReady}
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up account...' : !navigationReady ? 'Loading...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionModal; 