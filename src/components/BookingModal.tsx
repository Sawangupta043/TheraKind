import React, { useState } from 'react';
import { X, Calendar, MapPin, CreditCard, Clock, DollarSign, CheckCircle } from 'lucide-react';
import { Therapist } from '../App';
import { processPayment } from '../services/paymentService';

interface BookingModalProps {
  therapist: Therapist;
  onClose: () => void;
  onBook: (therapistId: string, date: string, time: string, type: 'online' | 'in-person') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ therapist, onClose, onBook }) => {
  const [selectedSlot, setSelectedSlot] = useState('');
  const [sessionType, setSessionType] = useState<'online' | 'in-person'>('online');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const handleBook = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    const [date, time] = selectedSlot.split(' ');
    
    try {
      setLoading(true);
      setError('');
      
      // Process payment
      const paymentResult = await processPayment({
        amount: therapist.price,
        currency: 'INR',
        sessionId: `session_${Date.now()}`,
        clientId: 'client_id', // This would come from auth context
        therapistId: therapist.id,
        description: `Session with ${therapist.name} on ${date} at ${time}`
      });

      if (paymentResult.success) {
        setTransactionId(paymentResult.transactionId || '');
        setPaymentStep('success');
        
        // Call the booking function after successful payment
        setTimeout(() => {
          onBook(therapist.id, date, time, sessionType);
        }, 2000);
      } else {
        setError(paymentResult.error || 'Payment failed');
      }
    } catch (error) {
      setError('Payment processing error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSlot = (slot: string) => {
    const [date, time] = slot.split(' ');
    const dateObj = new Date(date);
    const timeStr = time;
    
    return {
      date: dateObj.toLocaleDateString('en-IN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: timeStr
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Book Session</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Step */}
          {paymentStep === 'success' && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Payment Successful!</h3>
              <p className="text-gray-600">Your session has been booked successfully.</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Transaction ID: {transactionId}</p>
              </div>
              <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            </div>
          )}

          {/* Booking Details Step */}
          {paymentStep === 'details' && (
            <>
              {/* Therapist Info */}
              <div className="flex items-center space-x-4">
            <img
              src={therapist.photo}
              alt={therapist.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{therapist.name}</h3>
              <p className="text-sm text-gray-600">{therapist.experience} experience</p>
            </div>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-1" />
              Session Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="sessionType"
                  value="online"
                  checked={sessionType === 'online'}
                  onChange={(e) => setSessionType(e.target.value as 'online' | 'in-person')}
                  className="mr-3 text-purple-600 focus:ring-purple-200"
                />
                <div>
                  <div className="font-medium text-gray-900">Online Session</div>
                  <div className="text-sm text-gray-600">Video call via Google Meet</div>
                </div>
              </label>
              
              {therapist.acceptsInPerson && (
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="sessionType"
                    value="in-person"
                    checked={sessionType === 'in-person'}
                    onChange={(e) => setSessionType(e.target.value as 'online' | 'in-person')}
                    className="mr-3 text-purple-600 focus:ring-purple-200"
                  />
                  <div>
                    <div className="font-medium text-gray-900">In-Person Session</div>
                    <div className="text-sm text-gray-600">At therapist's clinic in {therapist.city}</div>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Available Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Calendar className="w-4 h-4 inline mr-1" />
              Select Time Slot
            </label>
            <div className="grid grid-cols-1 gap-2">
              {therapist.availability.map(slot => {
                const formatted = formatSlot(slot);
                return (
                  <label
                    key={slot}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3 text-purple-600 focus:ring-purple-200"
                    />
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">{formatted.date}</div>
                      <div className="text-sm text-gray-600">{formatted.time}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-purple-600 focus:ring-purple-200"
                />
                <div className="font-medium text-gray-900">Credit/Debit Card</div>
              </label>
              
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3 text-purple-600 focus:ring-purple-200"
                />
                <div className="font-medium text-gray-900">UPI</div>
              </label>
            </div>
          </div>

          {/* Price Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Session Fee</span>
              <span className="font-medium">₹{therapist.price}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium">₹0</span>
            </div>
            <div className="border-t border-gray-200 pt-2">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-xl text-gray-900">₹{therapist.price}</span>
              </div>
            </div>
          </div>

              {/* Book Button */}
              <button
                onClick={handleBook}
                disabled={loading}
                className="w-full bg-purple-200 text-purple-800 py-4 rounded-xl font-medium hover:bg-purple-300 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  `Book & Pay ₹${therapist.price}`
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Payment is secure and encrypted. You can cancel or reschedule up to 24 hours before the session.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;