import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Session } from '../App';
import { createFeedback, updateSession } from '../config/firebase';

interface FeedbackModalProps {
  session: Session;
  onClose: () => void;
  onSubmit: (sessionId: string, rating: number, feedback: string) => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ session, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Create feedback
      await createFeedback({
        sessionId: session.id,
        therapistId: session.therapistId,
        clientId: session.clientId,
        rating,
        feedback,
        therapistName: session.therapistName
      });

      // Update session status to completed
      await updateSession(session.id, { status: 'completed' });

      onSubmit(session.id, rating, feedback);
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Session Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Session Info */}
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-1">{session.therapistName}</h3>
            <p className="text-sm text-gray-600">{session.date} at {session.time}</p>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              How was your session?
            </label>
            <div className="flex justify-center space-x-2 mb-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="p-1 hover:scale-110 transition-transform duration-200"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredStar || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Feedback (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-colors duration-200 resize-none"
              placeholder="Share your experience to help us improve..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-200 text-purple-800 py-3 rounded-xl font-medium hover:bg-purple-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Your feedback is confidential and helps us maintain quality care.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;