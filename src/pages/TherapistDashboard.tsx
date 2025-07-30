import React, { useState, useEffect } from 'react';
import { Calendar, Clock, DollarSign, MapPin, Settings, Users, CheckCircle, X, User, BarChart3 } from 'lucide-react';
import { Session } from '../App';
import EmailVerification from '../components/EmailVerification';
import ProfileCard from '../components/ProfileCard';
import AdminPanel from '../components/AdminPanel';
import AdminOverview from '../components/AdminOverview';
import { useAuth } from '../contexts/AuthContext';
import { getSessions, updateSession, createFeedback } from '../config/firebase';

const TherapistDashboard: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'sessions' | 'calendar' | 'settings' | 'profile' | 'overview'>('overview');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [price, setPrice] = useState(2500);
  const [acceptsInPerson, setAcceptsInPerson] = useState(true);
  const [availability, setAvailability] = useState([
    '2025-01-15 10:00',
    '2025-01-15 14:00', 
    '2025-01-16 09:00',
    '2025-01-16 15:00'
  ]);

  // Load sessions on component mount
  useEffect(() => {
    const loadSessions = async () => {
      if (!user?.uid) return;
      
      try {
        setLoading(true);
        const sessionsData = await getSessions(user.uid, 'therapist');
        setSessions(sessionsData as Session[]);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user?.uid]);

  const therapistSessions = sessions.filter(session => session.therapistId === user?.uid);
  const pendingSessions = therapistSessions.filter(session => session.status === 'pending');
  const upcomingSessions = therapistSessions.filter(session => session.status === 'confirmed');
  const completedSessions = therapistSessions.filter(session => session.status === 'completed');

  const handleConfirmSession = async (sessionId: string) => {
    try {
      const meetLink = sessions.find(s => s.id === sessionId)?.type === 'online' 
        ? 'https://meet.google.com/example-link' 
        : undefined;
      
      await updateSession(sessionId, { 
        status: 'confirmed',
        meetLink 
      });
      
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              status: 'confirmed' as const,
              meetLink
            }
          : session
      ));
    } catch (error) {
      console.error('Error confirming session:', error);
    }
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await updateSession(sessionId, { status: 'cancelled' });
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, status: 'cancelled' as const }
          : session
      ));
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const totalEarnings = completedSessions.reduce((sum, session) => sum + session.price, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Email Verification Notice */}
        <EmailVerification />
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, Dr. {userProfile?.name || user?.email}
              </h1>
              <p className="text-gray-600">Manage your practice and help clients on their healing journey</p>
            </div>
            <button
              onClick={() => setShowAdminPanel(true)}
              className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                <p className="text-2xl font-bold text-orange-600">{pendingSessions.length}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{upcomingSessions.length}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
                <p className="text-2xl font-bold text-green-600">{completedSessions.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-purple-600">₹{totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-white rounded-xl p-1 mb-8 shadow-sm">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'sessions'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'calendar'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Calendar className="w-4 h-4 inline mr-2" />
            Calendar
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-purple-200 text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {/* Pending Requests */}
            {pendingSessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Requests</h2>
                <div className="space-y-4">
                  {pendingSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">New Session Request</h3>
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
                              <DollarSign className="w-4 h-4 mr-2" />
                              ₹{session.price}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          <button
                            onClick={() => handleConfirmSession(session.id)}
                            className="bg-green-100 text-green-800 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors duration-200 font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleCancelSession(session.id)}
                            className="bg-red-100 text-red-800 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 font-medium"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Sessions */}
            {upcomingSessions.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
                <div className="space-y-4">
                  {upcomingSessions.map(session => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">Confirmed Session</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <p className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {session.date} at {session.time}
                            </p>
                            <p className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {session.type === 'online' ? 'Online Session' : 'In-Person Session'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 mt-4 md:mt-0">
                          {session.meetLink && (
                            <a
                              href={session.meetLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 font-medium"
                            >
                              Join Session
                            </a>
                          )}
                          <button
                            onClick={() => handleCancelSession(session.id)}
                            className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {therapistSessions.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600">Your session requests will appear here once clients start booking.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Availability</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Current Available Slots</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availability.map((slot, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{slot.split(' ')[0]}</p>
                        <p className="text-sm text-gray-600">{slot.split(' ')[1]}</p>
                      </div>
                      <button
                        onClick={() => setAvailability(availability.filter((_, i) => i !== index))}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Slot</h3>
                <div className="flex space-x-4">
                  <input
                    type="date"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  />
                  <input
                    type="time"
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  />
                  <button className="bg-purple-200 text-purple-800 px-6 py-2 rounded-lg hover:bg-purple-300 transition-colors duration-200 font-medium">
                    Add Slot
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <AdminOverview sessions={sessions} />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <ProfileCard />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Practice Settings</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Price (₹)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(parseInt(e.target.value))}
                  className="w-full max-w-xs px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                />
              </div>

              <div>
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={acceptsInPerson}
                    onChange={(e) => setAcceptsInPerson(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-200"
                  />
                  <span className="text-sm font-medium text-gray-700">Accept in-person sessions</span>
                </label>
                <p className="text-sm text-gray-500 ml-6">Allow clients to book in-person sessions at your clinic</p>
              </div>

              <div className="pt-4">
                <button className="bg-purple-200 text-purple-800 px-6 py-3 rounded-lg hover:bg-purple-300 transition-colors duration-200 font-medium">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Admin Panel */}
      <AdminPanel 
        isOpen={showAdminPanel} 
        onClose={() => setShowAdminPanel(false)} 
      />
    </div>
  );
};

export default TherapistDashboard;