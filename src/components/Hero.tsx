import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Users, Calendar, Heart } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="text-purple-600">TheraKind</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
            Your healing begins here.
          </p>
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Connect with licensed therapists across India for personalized mental wellness support. 
            Choose from online or in-person sessions that fit your schedule and comfort.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link 
              to="/register?role=client"
              className="bg-purple-200 text-purple-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Register as Client</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/register?role=therapist"
              className="bg-blue-200 text-blue-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <span>Register as Therapist</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Licensed Therapists</h3>
            <p className="text-gray-600 text-sm">All therapists are verified and licensed professionals</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1-on-1 Sessions</h3>
            <p className="text-gray-600 text-sm">Personal, confidential sessions tailored to your needs</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600 text-sm">Book sessions that fit your schedule and lifestyle</p>
          </div>

          <div className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Compassionate Care</h3>
            <p className="text-gray-600 text-sm">Empathetic support in a safe, judgment-free environment</p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl p-8 mt-16 shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
              <div className="text-gray-600 text-sm">Licensed Therapists</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 text-sm">Sessions Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 text-sm">Cities Covered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">4.8★</div>
              <div className="text-gray-600 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;