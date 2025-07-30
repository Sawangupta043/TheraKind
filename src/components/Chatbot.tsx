import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  apiKey: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ apiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! 👋 How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  
  // Debug: Check if API key is properly set
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
      console.error('Invalid API key provided to chatbot');
    } else {
      // Test API connection
      const testConnection = async () => {
        try {
          const result = await model.generateContent('Hello');
          console.log('API connection successful');
        } catch (error) {
          console.error('API connection failed:', error);
        }
      };
      testConnection();
    }
  }, [apiKey, model]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create context-aware prompt
      const prompt = `You are SoulBot, a helpful chatbot for TheraSoul therapy platform.

Keep responses SHORT, CONCISE, and DIRECT. Maximum 2-3 sentences.

Help with:
- Booking therapists
- Therapy questions
- Session info
- Appointment management
- Mental health support

If user mentions emotional distress, give brief calming advice and suggest booking a therapist.

User: "${inputValue}"

Respond briefly as KindBot:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: text,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      let errorText = "I couldn't find that right now, but I'm always learning! Try rephrasing or contact support.";
      
      // Provide more specific error messages for debugging
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          errorText = "API key error. Please check your Gemini API key configuration.";
        } else if (error.message.includes('quota')) {
          errorText = "API quota exceeded. Please try again later.";
        } else if (error.message.includes('network')) {
          errorText = "Network error. Please check your internet connection.";
        }
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#A9D6E5] hover:bg-[#8BC5D4] text-[#1E1E1E] rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Open chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 h-96 md:w-96 md:h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-[#C8BFE7] p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#A9D6E5] rounded-full flex items-center justify-center">
                  <MessageCircle size={16} className="text-[#1E1E1E]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E1E1E]">KindBot</h3>
                  <p className="text-xs text-[#1E1E1E] opacity-75">Mental Health Support</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#1E1E1E] hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs md:max-w-sm px-4 py-2 rounded-lg ${
                    message.isUser
                      ? 'bg-[#A9D6E5] text-[#1E1E1E]'
                      : 'bg-[#FFE5EC] text-[#1E1E1E]'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#FFE5EC] text-[#1E1E1E] px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 size={16} className="animate-spin" />
                    <span className="text-sm">KindBot is typing...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C8BFE7] focus:border-transparent text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-3 py-2 bg-[#A9D6E5] hover:bg-[#8BC5D4] disabled:bg-gray-300 disabled:cursor-not-allowed text-[#1E1E1E] rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot; 