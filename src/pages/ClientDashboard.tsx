import React, { useState, useEffect } from 'react';
import { Search, Filter, Star, Calendar, MapPin, Languages, Clock, Heart } from 'lucide-react';
import { Therapist, Session } from '../App';
import TherapistCard from '../components/TherapistCard';
import BookingModal from '../components/BookingModal';
import FeedbackModal from '../components/FeedbackModal';
import EmailVerification from '../components/EmailVerification';
import ProfileCard from '../components/ProfileCard';
import { useAuth } from '../contexts/AuthContext';
import { getTherapists, createSession, getSessions, createFeedback } from '../config/firebase';
import { sendBookingConfirmation } from '../services/emailService';
import { notificationService } from '../services/notificationService';

// Mock therapists data
const mockTherapists: Therapist[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    photo: 'https://images.pexels.com/photos/5214329/pexels-photo-5214329.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    specializations: ['Anxiety', 'Depression', 'Stress Management'],
    languages: ['English', 'Hindi'],
    city: 'Mumbai',
    experience: '8 years',
    price: 2500,
    rating: 4.8,
    reviewCount: 127,
    availability: ['2025-01-15 10:00', '2025-01-15 14:00', '2025-01-16 09:00'],
    isVerified: true,
    acceptsInPerson: true
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    photo: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    specializations: ['Relationship Issues', 'Family Therapy', 'Career Counseling'],
    languages: ['English', 'Hindi', 'Bengali'],
    city: 'Delhi',
    experience: '12 years',
    price: 3000,
    rating: 4.9,
    reviewCount: 203,
    availability: ['2025-01-15 11:00', '2025-01-16 10:00', '2025-01-17 15:00'],
    isVerified: true,
    acceptsInPerson: false
  },
  {
    id: '3',
    name: 'Dr. Meera Patel',
    photo: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
    specializations: ['Trauma & PTSD', 'Grief & Loss', 'LGBTQ+ Issues'],
    languages: ['English', 'Gujarati', 'Hindi'],
    city: 'Ahmedabad',
    experience: '6 years',
    price: 2000,
    rating: 4.7,
    reviewCount: 89,
    availability: ['2025-01-15 13:00', '2025-01-16 16:00'],
    isVerified: true,
    acceptsInPerson: true
  }
];

const ClientDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [therapists, setTherapists] = useState<Therapist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [sessionType, setSessionType] = useState<'all' | 'online' | 'in-person'>('all');
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [feedbackSession, setFeedbackSession] = useState<Session | null>(null);
  const [activeTab, setActiveTab] = useState<'discover' | 'sessions' | 'profile'>('discover');
  const [error, setError] = useState<string | null>(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const [therapistsData, sessionsData] = await Promise.all([
          getTherapists(),
          getSessions(user.uid, 'client')
        ]);
        
        setTherapists(therapistsData as Therapist[]);
        setSessions(sessionsData as Session[]);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.uid]);

  // Filter therapists
  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specializations.some(spec => 
                           spec.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesSpecialization = !selectedSpecialization || 
                                 therapist.specializations.includes(selectedSpecialization);
    const matchesPrice = therapist.price >= priceRange.min && therapist.price <= priceRange.max;
    const matchesLanguage = !selectedLanguage || therapist.languages.includes(selectedLanguage);
    const matchesCity = !selectedCity || therapist.city === selectedCity;
    const matchesSessionType = sessionType === 'all' || 
                              (sessionType === 'in-person' && therapist.acceptsInPerson) ||
                              sessionType === 'online';

    return matchesSearch && matchesSpecialization && matchesPrice && 
           matchesLanguage && matchesCity && matchesSessionType;
  });

  const handleBooking = async (therapistId: string, date: string, time: string, type: 'online' | 'in-person') => {
    const therapist = therapists.find(t => t.id === therapistId);
    if (!therapist || !user?.uid) return;

    try {
      const sessionData = {
        clientId: user.uid,
        therapistId: therapistId,
        therapistName: therapist.name,
        date: date,
        time: time,
        status: 'pending',
        price: therapist.price,
        type: type
      };

      const sessionId = await createSession(sessionData);
      const newSession = { ...sessionData, id: sessionId, status: 'pending' as const };
      
      setSessions([newSession, ...sessions]);
      setSelectedTherapist(null);

      // Send booking confirmation email
      if (user?.email) {
        try {
          await sendBookingConfirmation(
            user.email,
            therapist.name,
            date,
            time,
            type
          );
        } catch (emailError) {
          console.error('Error sending confirmation email:', emailError);
        }
      }

      // Create notification
      notificationService.createBookingConfirmation(therapist.name, date, time);
    } catch (error) {
      console.error('Error creating session:', error);
      setError('Failed to create booking. Please try again.');
    }
  };

  const handleFeedbackSubmit = async (sessionId: string, rating: number, feedback: string) => {
    setFeedbackSession(null);
    try {
      await createFeedback({ sessionId, rating, feedback });
      // Optionally update local state or refetch sessions
    } catch (error) {
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Verification Notice */}
        <EmailVerification />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userProfile?.name || user?.email}
          </h1>
          <p className="text-gray-600">Find the right therapist for your healing journey</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('discover')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'discover'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Discover Therapists
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'sessions'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            My Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            Profile
          </button>
        </div>

        {activeTab === 'discover' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Search className="w-4 h-4 inline mr-1" />
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Name or specialization"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  />
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Heart className="w-4 h-4 inline mr-1" />
                    Specialization
                  </label>
                  <select
                    value={selectedSpecialization}
                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  >
                    <option value="">All specializations</option>
                    <option value="Anxiety">Anxiety</option>
                    <option value="Depression">Depression</option>
                    <option value="Stress Management">Stress Management</option>
                    <option value="Relationship Issues">Relationship Issues</option>
                    <option value="Trauma & PTSD">Trauma & PTSD</option>
                  </select>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Languages className="w-4 h-4 inline mr-1" />
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  >
                    <option value="">All languages</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Gujarati">Gujarati</option>
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200"
                  >
                    <option value="">All cities</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Ahmedabad">Ahmedabad</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: ₹{priceRange.min} - ₹{priceRange.max}
                  </label>
                  <div className="flex space-x-4">
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="500"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5000"
                      step="500"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) }))}
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Session Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Session Type</label>
                  <div className="flex space-x-4">
                    {['all', 'online', 'in-person'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="sessionType"
                          value={type}
                          checked={sessionType === type}
                          onChange={(e) => setSessionType(e.target.value as 'all' | 'online' | 'in-person')}
                          className="mr-2 text-purple-600 focus:ring-purple-200"
                        />
                        <span className="text-sm text-gray-700 capitalize">{type.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Therapists Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTherapists.map(therapist => (
                <TherapistCard
                  key={therapist.id}
                  therapist={therapist}
                  onBook={() => setSelectedTherapist(therapist)}
                />
              ))}
            </div>

            {filteredTherapists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No therapists found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'sessions' && (
          /* Sessions Tab */
          <div className="space-y-6">
            {sessions.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-6">Book your first session to get started on your healing journey</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="bg-purple-200 text-purple-800 px-6 py-3 rounded-full hover:bg-purple-300 transition-colors duration-200"
                >
                  Find a Therapist
                </button>
              </div>
            ) : (
              sessions.map(session => (
                <div key={session.id} className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {session.therapistName}
                      </h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {session.date} at {session.time}
                        </p>
                        <p className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {session.type === 'online' ? 'Online Session' : 'In-Person Session'}
                        </p>
                        <p className="flex items-center">
                          <span className="w-4 h-4 mr-2">₹</span>
                          {session.price}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2 mt-4 md:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                      
                      {session.status === 'confirmed' && session.meetLink && (
                        <a
                          href={session.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Join Session
                        </a>
                      )}
                      
                      {session.status === 'confirmed' && (
                        <button
                          onClick={() => setFeedbackSession(session)}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          Leave Feedback
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          /* Profile Tab */
          <div className="space-y-6">
            <ProfileCard />
          </div>
        )}

        {/* Booking Modal */}
        {selectedTherapist && (
          <BookingModal
            therapist={selectedTherapist}
            onClose={() => setSelectedTherapist(null)}
            onBook={handleBooking}
          />
        )}

        {/* Feedback Modal */}
        {feedbackSession && (
          <FeedbackModal
            session={feedbackSession}
            onClose={() => setFeedbackSession(null)}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;