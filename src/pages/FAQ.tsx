import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Users, Shield, Calendar, CreditCard, Heart, HelpCircle } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const faqSections = [
    {
      id: 'general',
      title: 'General Questions',
      icon: HelpCircle,
      questions: [
        {
          question: 'What is TheraSoul?',
          answer: 'TheraSoul is a mental wellness platform that connects clients with licensed therapists across India. We offer both online and in-person therapy sessions to make mental health care accessible and convenient.'
        },
        {
          question: 'How does TheraSoul work?',
          answer: 'Simply browse our verified therapists, filter by your preferences (specialization, language, location), book a session that fits your schedule, make payment, and attend your therapy session. It\'s that simple!'
        },
        {
          question: 'Is TheraSoul available across India?',
          answer: 'Yes! We have licensed therapists in over 50 cities across India. For online sessions, you can connect with therapists from anywhere. For in-person sessions, you can find therapists in your city.'
        },
        {
          question: 'What types of therapy do you offer?',
          answer: 'Our therapists specialize in various areas including anxiety, depression, stress management, relationship issues, trauma & PTSD, eating disorders, addiction, family therapy, career counseling, and more.'
        }
      ]
    },
    {
      id: 'clients',
      title: 'For Clients',
      icon: Users,
      questions: [
        {
          question: 'How do I find the right therapist?',
          answer: 'Use our filters to search by specialization, language, city, price range, and session type. Read therapist profiles, check ratings and reviews, and choose someone who feels like the right fit for your needs.'
        },
        {
          question: 'What\'s the difference between online and in-person sessions?',
          answer: 'Online sessions are conducted via secure video calls (Google Meet) from the comfort of your home. In-person sessions take place at the therapist\'s clinic. Both are equally effective - choose what feels most comfortable for you.'
        },
        {
          question: 'Can I cancel or reschedule my session?',
          answer: 'Yes, you can cancel or reschedule your session up to 24 hours before the scheduled time. For cancellations made less than 24 hours in advance, our standard cancellation policy applies.'
        },
        {
          question: 'How long are therapy sessions?',
          answer: 'Session duration is flexible and decided between you and your therapist based on your needs. Typical sessions range from 45-60 minutes, but this can be adjusted as needed.'
        },
        {
          question: 'Is my information confidential?',
          answer: 'Absolutely. All your personal information and therapy sessions are completely confidential. We follow strict privacy protocols and never share your information with third parties.'
        }
      ]
    },
    {
      id: 'therapists',
      title: 'For Therapists',
      icon: Heart,
      questions: [
        {
          question: 'How do I join TheraSoul as a therapist?',
          answer: 'Register as a therapist on our platform, upload your license documents, set your profile with specializations and pricing, and submit for verification. We\'ll review your application within 24 hours.'
        },
        {
          question: 'What are the requirements to become a therapist on TheraSoul?',
          answer: 'You must be a licensed mental health professional with valid credentials, have relevant experience in therapy/counseling, and be able to provide quality care to clients.'
        },
        {
          question: 'How do I set my availability?',
          answer: 'Use our calendar management system in your therapist dashboard to add, update, or remove available time slots. Clients can only book sessions during your available times.'
        },
        {
          question: 'How do I get paid?',
          answer: 'Payments are processed after session completion. You\'ll receive payment directly to your registered bank account within 2-3 business days after each completed session.'
        },
        {
          question: 'Can I offer both online and in-person sessions?',
          answer: 'Yes! During registration, you can choose to offer online sessions only, or both online and in-person sessions. This helps you reach more clients and offer flexible options.'
        }
      ]
    },
    {
      id: 'booking',
      title: 'Booking & Scheduling',
      icon: Calendar,
      questions: [
        {
          question: 'How do I book a session?',
          answer: 'Find your preferred therapist, click "Book Session", choose your session type (online/in-person), select an available time slot, make payment, and wait for therapist confirmation.'
        },
        {
          question: 'What happens after I book a session?',
          answer: 'After booking, the therapist will confirm your session within a few hours. Once confirmed, you\'ll receive an email with session details and, for online sessions, a Google Meet link.'
        },
        {
          question: 'How will I receive session reminders?',
          answer: 'We send email notifications and WhatsApp reminders to both you and your therapist 15 minutes before the session starts.'
        },
        {
          question: 'What if my therapist doesn\'t confirm my session?',
          answer: 'If a therapist doesn\'t confirm within 24 hours, we\'ll notify you and help you book with another therapist. Your payment will be refunded if needed.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Payment & Pricing',
      icon: CreditCard,
      questions: [
        {
          question: 'How much do therapy sessions cost?',
          answer: 'Session prices vary by therapist and typically range from ₹1,500 to ₹4,000 per session. Each therapist sets their own pricing based on their experience and specialization.'
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI payments, net banking, and digital wallets. All payments are processed securely through our encrypted payment gateway.'
        },
        {
          question: 'Are there any hidden fees?',
          answer: 'No hidden fees! The price you see is exactly what you pay. We don\'t charge any additional platform fees or processing charges.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'Refunds are available for cancelled sessions (based on our cancellation policy) or if a therapist is unable to provide the session. Refunds are typically processed within 5-7 business days.'
        }
      ]
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: Shield,
      questions: [
        {
          question: 'Is my data secure on TheraSoul?',
          answer: 'Yes, we use bank-level encryption and security measures to protect your data. All information is stored securely and we comply with data protection regulations.'
        },
        {
          question: 'Who can see my therapy session details?',
                      answer: 'Only you and your therapist have access to session details. TheraSoul staff cannot view session content, and we never share information with third parties.'
        },
        {
          question: 'How do you ensure video call privacy?',
          answer: 'We use secure Google Meet links for online sessions. These are end-to-end encrypted and automatically expire after the session. We don\'t record or store any session content.'
        },
        {
          question: 'Can I delete my account and data?',
          answer: 'Yes, you can request account deletion at any time. We\'ll permanently delete all your personal data within 30 days of your request, except for legally required records.'
        }
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Find answers to common questions about TheraSoul, our services, and how we can support your mental wellness journey.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqSections.map((section) => (
              <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-8 py-6 text-left hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                    </div>
                    {openSection === section.id ? (
                      <ChevronUp className="w-6 h-6 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </button>

                {openSection === section.id && (
                  <div className="px-8 pb-6">
                    <div className="space-y-6">
                      {section.questions.map((faq, index) => (
                        <div key={index} className="border-l-4 border-purple-200 pl-6">
                          <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Still have questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our support team is here to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-purple-200 text-purple-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Contact Support
            </a>
            <a
              href="mailto:support@therakind.com"
              className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
            >
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;