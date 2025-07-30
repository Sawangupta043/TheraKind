import React from 'react';
import { Star, MapPin, Languages, Clock, Shield } from 'lucide-react';
import { Therapist } from '../App';

interface TherapistCardProps {
  therapist: Therapist;
  onBook: () => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <img
            src={therapist.photo}
            alt={therapist.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          {therapist.isVerified && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{therapist.name}</h3>
          <p className="text-sm text-gray-600">{therapist.experience} experience</p>
          <div className="flex items-center space-x-1 mt-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-700">{therapist.rating}</span>
            <span className="text-sm text-gray-500">({therapist.reviewCount} reviews)</span>
          </div>
        </div>
      </div>

      {/* Specializations */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {therapist.specializations.slice(0, 3).map(spec => (
            <span
              key={spec}
              className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
            >
              {spec}
            </span>
          ))}
          {therapist.specializations.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{therapist.specializations.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 mb-4 text-sm text-gray-600">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          <span>{therapist.city}</span>
          {therapist.acceptsInPerson && (
            <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
              In-person
            </span>
          )}
        </div>
        
        <div className="flex items-center">
          <Languages className="w-4 h-4 mr-2" />
          <span>{therapist.languages.join(', ')}</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>{therapist.availability.length} slots available</span>
        </div>
      </div>

      {/* Price and Book Button */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <span className="text-2xl font-bold text-gray-900">₹{therapist.price}</span>
          <span className="text-sm text-gray-600 ml-1">per session</span>
        </div>
        
        <button
          onClick={onBook}
          className="bg-purple-200 text-purple-800 px-6 py-2 rounded-full hover:bg-purple-300 hover:scale-105 transition-all duration-200 font-medium"
        >
          Book Session
        </button>
      </div>
    </div>
  );
};

export default TherapistCard;