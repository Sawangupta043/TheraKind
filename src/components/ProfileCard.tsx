import React from 'react';
import { User, Mail, Phone, MapPin, Heart, Languages, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfileCard: React.FC = () => {
  const { userProfile } = useAuth();

  if (!userProfile) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start space-x-4">
        {/* Profile Avatar */}
        <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-pink-200 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-purple-600" />
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {userProfile.name || 'User'}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {userProfile.role === 'therapist' ? 'Therapist' : 'Client'}
          </p>

          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="w-4 h-4 mr-2" />
              <span>{userProfile.email}</span>
            </div>
            
            {userProfile.phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{userProfile.phone}</span>
              </div>
            )}
            
            {userProfile.city && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{userProfile.city}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {userProfile.bio && (
            <div className="mb-4">
              <p className="text-sm text-gray-700">{userProfile.bio}</p>
            </div>
          )}

          {/* Therapist Specific Info */}
          {userProfile.role === 'therapist' && (
            <div className="space-y-3">
              {/* Experience */}
              {userProfile.experience && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{userProfile.experience} experience</span>
                </div>
              )}

              {/* Price */}
              {userProfile.price && (
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  <span>₹{userProfile.price} per session</span>
                </div>
              )}

              {/* Specializations */}
              {userProfile.specializations && userProfile.specializations.length > 0 && (
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Heart className="w-4 h-4 mr-2" />
                    <span className="font-medium">Specializations</span>
                  </div>
                                     <div className="flex flex-wrap gap-1">
                     {userProfile.specializations.map((spec: string, index: number) => (
                       <span
                         key={index}
                         className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                       >
                         {spec}
                       </span>
                     ))}
                   </div>
                </div>
              )}

              {/* Languages */}
              {userProfile.languages && userProfile.languages.length > 0 && (
                <div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Languages className="w-4 h-4 mr-2" />
                    <span className="font-medium">Languages</span>
                  </div>
                                     <div className="flex flex-wrap gap-1">
                     {userProfile.languages.map((lang: string, index: number) => (
                       <span
                         key={index}
                         className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                       >
                         {lang}
                       </span>
                     ))}
                   </div>
                </div>
              )}

              {/* Session Type */}
              <div className="flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Session Type:</span>
                <span>
                  {userProfile.acceptsInPerson ? 'In-person & Online' : 'Online only'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 