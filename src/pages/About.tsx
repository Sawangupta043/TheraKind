import React from 'react';
import { Heart, Shield, Users, Globe, Award, Clock } from 'lucide-react';

const About: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Licensed Therapists', value: '500+' },
    { icon: Heart, label: 'Lives Touched', value: '10,000+' },
    { icon: Globe, label: 'Cities Covered', value: '50+' },
    { icon: Award, label: 'Success Rate', value: '95%' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Compassionate Care',
      description: 'We believe in providing empathetic, judgment-free support to every individual on their healing journey.'
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your mental health information is completely confidential and protected with the highest security standards.'
    },
    {
      icon: Users,
      title: 'Licensed Professionals',
      description: 'All our therapists are verified, licensed professionals with years of experience in mental health care.'
    },
    {
      icon: Clock,
      title: 'Accessible Care',
      description: 'Mental health support should be available when you need it. We offer flexible scheduling and online sessions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-purple-600">TheraSoul</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make quality mental health care accessible to everyone in India. 
              Your healing journey matters, and we're here to support you every step of the way.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To democratize mental health care in India by connecting individuals with licensed, 
                compassionate therapists through a secure, user-friendly platform. We believe that 
                everyone deserves access to quality mental health support, regardless of their location 
                or circumstances.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                To create a world where seeking mental health support is as normal as visiting a 
                doctor for physical health. We envision a society where mental wellness is 
                prioritized, stigma is eliminated, and help is always within reach.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Making a Difference</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Since our inception, we've been dedicated to creating positive impact in mental health care
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and help us maintain the highest standards of care
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How TheraSoul Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've made it simple to find and connect with the right therapist for your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-800">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Browse & Choose</h3>
              <p className="text-gray-600">
                Browse our verified therapists, filter by specialization, language, and location to find your perfect match.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-800">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Book & Pay</h3>
              <p className="text-gray-600">
                Select your preferred time slot, choose between online or in-person sessions, and make secure payment.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-800">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Healing</h3>
              <p className="text-gray-600">
                Attend your session and begin your healing journey with professional guidance and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Take the first step towards better mental health. Our compassionate therapists are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/register?role=client"
              className="bg-purple-200 text-purple-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Find a Therapist
            </a>
            <a
              href="/register?role=therapist"
              className="bg-blue-200 text-blue-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-blue-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join as Therapist
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;