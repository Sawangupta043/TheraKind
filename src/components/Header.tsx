import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, Settings } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../config/firebase';
import ProfileModal from './ProfileModal';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await signOutUser();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const getDashboardPath = () => {
    if (!userProfile) return '';
    return userProfile.role === 'client' ? '/client-dashboard' : '/therapist-dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
              <Heart className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-xl font-bold text-gray-900">TheraKind</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">Home</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">About</Link>
            <Link to="/faq" className="text-gray-700 hover:text-purple-600 transition-colors duration-200">FAQ</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={getDashboardPath()} 
                  className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <NotificationBell />
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">{userProfile?.name || user?.email}</span>
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full hover:bg-purple-300 transition-colors duration-200"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/faq" 
                className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={getDashboardPath()} 
                    className="text-gray-700 hover:text-purple-600 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-left text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm">{userProfile?.name || user?.email}</span>
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-700 hover:text-purple-600 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link 
                  to="/login" 
                  className="bg-purple-200 text-purple-800 px-4 py-2 rounded-full hover:bg-purple-300 transition-colors duration-200 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Profile Modal */}
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </header>
  );
};

export default Header;