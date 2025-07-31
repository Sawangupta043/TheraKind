import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Register from './pages/Register';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import ClientDashboard from './pages/ClientDashboard';
import TherapistDashboard from './pages/TherapistDashboard';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Chatbot from './components/Chatbot';
import ProtectedRoute from './components/ProtectedRoute';
import AuthRedirect from './components/AuthRedirect';
import RoleSelectionModal from './components/RoleSelectionModal';
import { GEMINI_API_KEY } from './config/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'therapist';
  photo?: string;
  isVerified?: boolean;
}

export interface Therapist {
  id: string;
  name: string;
  photo: string;
  specializations: string[];
  languages: string[];
  city: string;
  experience: string;
  price: number;
  rating: number;
  reviewCount: number;
  availability: string[];
  isVerified: boolean;
  acceptsInPerson: boolean;
}

export interface Session {
  id: string;
  clientId: string;
  therapistId: string;
  therapistName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  type: 'online' | 'in-person';
  meetLink?: string;
}

// Component that uses auth context and renders modal
const AppContent: React.FC = () => {
  const { showRoleSelection, setShowRoleSelection, user } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AuthRedirect />
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-reset" element={<PasswordReset />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route 
          path="/client-dashboard" 
          element={
            <ProtectedRoute requiredRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/therapist-dashboard" 
          element={
            <ProtectedRoute requiredRole="therapist">
              <TherapistDashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/ClientDashboard" element={user ? <ClientDashboard /> : <Navigate to="/login" />} />
      </Routes>
      <Footer />
      <Chatbot apiKey={GEMINI_API_KEY} />
      <RoleSelectionModal 
        isOpen={showRoleSelection} 
        onClose={() => setShowRoleSelection(false)} 
      />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;