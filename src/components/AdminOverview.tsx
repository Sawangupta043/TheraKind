import React from 'react';
import { Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, Star } from 'lucide-react';
import { Session } from '../App';

interface AdminOverviewProps {
  sessions: Session[];
}

const AdminOverview: React.FC<AdminOverviewProps> = ({ sessions }) => {
  const pendingSessions = sessions.filter(s => s.status === 'pending');
  const confirmedSessions = sessions.filter(s => s.status === 'confirmed');
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const totalEarnings = completedSessions.reduce((sum, session) => sum + session.price, 0);
  const uniqueClients = new Set(sessions.map(s => s.clientId)).size;
  const onlineSessions = sessions.filter(s => s.type === 'online').length;
  const inPersonSessions = sessions.filter(s => s.type === 'in-person').length;

  const stats = [
    {
      title: 'Pending Requests',
      value: pendingSessions.length,
      icon: Clock,
      color: 'orange',
      change: '+2 from yesterday'
    },
    {
      title: 'Upcoming Sessions',
      value: confirmedSessions.length,
      icon: Calendar,
      color: 'blue',
      change: '+1 from yesterday'
    },
    {
      title: 'Total Earnings',
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: 'green',
      change: '+₹5,000 this month'
    },
    {
      title: 'Active Clients',
      value: uniqueClients,
      icon: Users,
      color: 'purple',
      change: '+1 new client'
    }
  ];

  const quickActions = [
    {
      title: 'Confirm Sessions',
      description: 'Review and confirm pending session requests',
      icon: CheckCircle,
      count: pendingSessions.length,
      color: 'orange'
    },
    {
      title: 'View Analytics',
      description: 'Check your performance metrics and earnings',
      icon: TrendingUp,
      count: null,
      color: 'blue'
    },
    {
      title: 'Manage Clients',
      description: 'View and manage your client relationships',
      icon: Users,
      count: uniqueClients,
      color: 'purple'
    },
    {
      title: 'Update Availability',
      description: 'Set your available time slots',
      icon: Calendar,
      count: null,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <IconComponent className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className={`text-xs font-medium text-${stat.color}-600 bg-${stat.color}-100 px-2 py-1 rounded-full`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.title}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                className={`p-4 rounded-lg border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-200 text-left`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 bg-${action.color}-100 rounded-full flex items-center justify-center`}>
                    <IconComponent className={`w-5 h-5 text-${action.color}-600`} />
                  </div>
                  {action.count !== null && (
                    <span className={`text-xs font-medium text-${action.color}-600 bg-${action.color}-100 px-2 py-1 rounded-full`}>
                      {action.count}
                    </span>
                  )}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                <p className="text-xs text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Session Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Breakdown</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Online Sessions</span>
              </div>
              <span className="font-semibold text-gray-900">{onlineSessions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">In-Person Sessions</span>
              </div>
              <span className="font-semibold text-gray-900">{inPersonSessions}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Completed Sessions</span>
              </div>
              <span className="font-semibold text-gray-900">{completedSessions.length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Average Rating</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold text-gray-900">4.8</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Completion Rate</span>
              <span className="font-semibold text-gray-900">
                {sessions.length > 0 ? Math.round((completedSessions.length / sessions.length) * 100) : 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Client Retention</span>
              <span className="font-semibold text-gray-900">85%</span>
            </div>
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
                  <p className="font-medium text-gray-900">Session with Client {session.clientId}</p>
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
  );
};

export default AdminOverview; 