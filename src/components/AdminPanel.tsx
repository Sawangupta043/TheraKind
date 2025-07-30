import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  X, 
  AlertCircle,
  BarChart3,
  Settings,
  MessageSquare,
  FileText,
  Star
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Session } from '../App';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'clients' | 'analytics' | 'settings'>('overview');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  const mockSessions: Session[] = [
    {
      id: '1',
      clientId: 'client1',
      therapistId: userProfile?.uid || '',
      therapistName: userProfile?.name || '',
      date: '2025-01-15',
      time: '10:00',
      status: 'confirmed',
      price: 2500,
      type: 'online',
      meetLink: 'https://meet.google.com/abc-123'
    },
    {
      id: '2',
      clientId: 'client2',
      therapistId: userProfile?.uid || '',
      therapistName: userProfile?.name || '',
      date: '2025-01-16',
      time: '14:00',
      status: 'pending',
      price: 2500,
      type: 'in-person'
    },
    {
      id: '3',
      clientId: 'client3',
      therapistId: userProfile?.uid || '',
      therapistName: userProfile?.name || '',
      date: '2025-01-14',
      time: '16:00',
      status: 'completed',
      price: 2500,
      type: 'online'
    }
  ];

  useEffect(() => {
    setSessions(mockSessions);
  }, [userProfile]);

  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const confirmedSessions = sessions.filter(s => s.status === 'confirmed');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalEarnings = completedSessions.reduce((sum, session) => sum + session.price, 0);
  const uniqueClients = new Set(sessions.map(s => s.clientId)).size;

  const handleConfirmSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'confirmed' as const }
        : session
    ));
  };

  const handleCancelSession = (sessionId: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, status: 'cancelled' as const }
        : session
    ));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
            <p className="text-gray-600">Manage your practice and view insights</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-gray-50 px-6 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'overview'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'sessions'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Sessions
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'clients'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Users className="w-4 h-4 mr-2" />
            Clients
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'analytics'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-white text-purple-800 shadow-sm'
                : 'text-gray-600 hover:text-purple-600'
            }`}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                      <p className="text-2xl font-bold text-orange-600">{pendingSessions.length}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
                      <p className="text-2xl font-bold text-blue-600">{confirmedSessions.length}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-blue-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">₹{totalEarnings.toLocaleString()}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Active Clients</p>
                      <p className="text-2xl font-bold text-purple-600">{uniqueClients}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {sessions.slice(0, 5).map(session => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Session with Client</p>
                          <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">₹{session.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Session Management</h3>
                <div className="flex space-x-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>All Sessions</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {sessions.map(session => (
                        <tr key={session.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Client {session.clientId}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.date} at {session.time}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {session.type === 'online' ? 'Online' : 'In-Person'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              session.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              session.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{session.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {session.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleConfirmSession(session.id)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleCancelSession(session.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            {session.status === 'confirmed' && (
                              <button className="text-blue-600 hover:text-blue-900">
                                Join
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Client Management</h3>
                <button className="bg-purple-200 text-purple-800 px-4 py-2 rounded-lg hover:bg-purple-300 transition-colors">
                  Export Data
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from(new Set(sessions.map(s => s.clientId))).map(clientId => {
                  const clientSessions = sessions.filter(s => s.clientId === clientId);
                  const totalSpent = clientSessions.reduce((sum, s) => sum + s.price, 0);
                  const sessionCount = clientSessions.length;
                  
                  return (
                    <div key={clientId} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Client {clientId}</h4>
                          <p className="text-sm text-gray-600">{sessionCount} sessions</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Spent:</span>
                          <span className="font-medium">₹{totalSpent}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Last Session:</span>
                          <span className="font-medium">
                            {clientSessions[clientSessions.length - 1]?.date || 'N/A'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex space-x-2">
                        <button className="flex-1 bg-purple-100 text-purple-800 py-2 rounded-lg text-sm hover:bg-purple-200 transition-colors">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          Message
                        </button>
                        <button className="flex-1 bg-gray-100 text-gray-800 py-2 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                          <FileText className="w-4 h-4 inline mr-1" />
                          Notes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Earnings Chart */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Chart placeholder</p>
                    </div>
                  </div>
                </div>

                {/* Session Stats */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Online Sessions</span>
                      <span className="font-semibold">{sessions.filter(s => s.type === 'online').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">In-Person Sessions</span>
                      <span className="font-semibold">{sessions.filter(s => s.type === 'in-person').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-semibold">
                        {Math.round((completedSessions.length / sessions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Star className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Average Rating</h4>
                    <p className="text-2xl font-bold text-green-600">4.8</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Sessions Completed</h4>
                    <p className="text-2xl font-bold text-blue-600">{completedSessions.length}</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Active Clients</h4>
                    <p className="text-2xl font-bold text-purple-600">{uniqueClients}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Session Price (₹)
                    </label>
                    <input
                      type="number"
                      defaultValue={2500}
                      className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-200"
                      />
                      <span className="text-sm font-medium text-gray-700">Accept new session requests</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-purple-600 focus:ring-purple-200"
                      />
                      <span className="text-sm font-medium text-gray-700">Email notifications</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        className="rounded text-purple-600 focus:ring-purple-200"
                      />
                      <span className="text-sm font-medium text-gray-700">SMS notifications</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Change Password</span>
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Privacy Settings</span>
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                  
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">Export Data</span>
                      <AlertCircle className="w-4 h-4 text-gray-400" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 