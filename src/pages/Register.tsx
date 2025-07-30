import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Upload, Calendar, MapPin, DollarSign, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { signUpWithEmail } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [role, setRole] = useState<'client' | 'therapist'>(
    (searchParams.get('role') as 'client' | 'therapist') || 'client'
  );
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    // Therapist specific
    specializations: [] as string[],
    languages: [] as string[],
    experience: '',
    price: '',
    license: null as File | null,
    photo: null as File | null,
    acceptsInPerson: false,
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const specializationOptions = [
    'Anxiety', 'Depression', 'Stress Management', 'Relationship Issues', 
    'Trauma & PTSD', 'Eating Disorders', 'Addiction', 'Family Therapy',
    'Career Counseling', 'Grief & Loss', 'LGBTQ+ Issues', 'Sleep Disorders'
  ];

  const languageOptions = [
    'English', 'Hindi', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 
    'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checkbox.checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'license' | 'photo') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleMultiSelect = (value: string, field: 'specializations' | 'languages') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(formData.email, formData.password, formData.name, role);
      
      if (role === 'therapist') {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/therapist-dashboard');
        }, 3000);
      } else {
        navigate('/client-dashboard');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess && role === 'therapist') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your profile will be verified within 24 hours. You'll receive an email confirmation once approved.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">Join TheraKind</h1>
          
          {/* Role Selection */}
          <div className="flex bg-gray-100 rounded-full p-1 mb-8">
            <button
              type="button"
              onClick={() => setRole('client')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                role === 'client'
                  ? 'bg-purple-200 text-purple-800 shadow-sm'
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              I need therapy
            </button>
            <button
              type="button"
              onClick={() => setRole('therapist')}
              className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-200 ${
                role === 'therapist'
                  ? 'bg-blue-200 text-blue-800 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              I'm a therapist
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  placeholder="Create a password"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-1" />
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                placeholder="Enter your city"
              />
            </div>

            {/* Therapist-specific fields */}
            {role === 'therapist' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specializations
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {specializationOptions.map(spec => (
                      <label key={spec} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specializations.includes(spec)}
                          onChange={() => handleMultiSelect(spec, 'specializations')}
                          className="rounded text-purple-600 focus:ring-purple-200"
                        />
                        <span className="text-sm text-gray-700">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {languageOptions.map(lang => (
                      <label key={lang} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(lang)}
                          onChange={() => handleMultiSelect(lang, 'languages')}
                          className="rounded text-purple-600 focus:ring-purple-200"
                        />
                        <span className="text-sm text-gray-700">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                      placeholder="e.g., 5 years"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Price per Session (₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                      placeholder="e.g., 2000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-1" />
                      License Document
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'license')}
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Upload className="w-4 h-4 inline mr-1" />
                      Profile Photo
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e, 'photo')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptsInPerson"
                      checked={formData.acceptsInPerson}
                      onChange={handleInputChange}
                      className="rounded text-purple-600 focus:ring-purple-200"
                    />
                    <span className="text-sm text-gray-700">I accept in-person sessions in my city</span>
                  </label>
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full bg-purple-200 text-purple-800 py-4 rounded-xl font-medium hover:bg-purple-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {role === 'therapist' ? 'Register & Submit for Verification' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;