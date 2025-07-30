# TheraKind Chatbot Setup Guide

## Overview
The TheraKind chatbot is a floating widget that provides mental health support and guidance to users. It uses Google's Generative AI (Gemini) to provide intelligent responses.

## Features
- ✅ Floating chat icon at bottom-right corner
- ✅ Clean, calming UI with TheraKind's color palette
- ✅ Mental health support and guidance
- ✅ Booking assistance for therapists
- ✅ FAQ responses
- ✅ Emotional distress detection
- ✅ Responsive design for mobile/desktop
- ✅ Loading animations
- ✅ Error handling with fallback responses

## Setup Instructions

### 1. Get Google Generative AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key

### 2. Configure the API Key
Open `src/config/api.ts` and replace the placeholder with your actual API key:

```typescript
export const GEMINI_API_KEY = 'your_actual_gemini_api_key_here';
```

### 3. Environment Variables (Optional)
For better security, you can use environment variables:

1. Create a `.env` file in the root directory:
```
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

2. Update `src/config/api.ts`:
```typescript
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your_fallback_key_here';
```

### 4. Install Dependencies
The chatbot requires the Google Generative AI SDK:
```bash
npm install @google/generative-ai
```

## Usage

### For Users
1. Click the floating chat icon (bottom-right corner)
2. Type your questions or concerns
3. The chatbot will provide helpful responses

### Common Questions the Chatbot Can Handle
- "How to book a therapist?"
- "What is in-person therapy?"
- "What to expect in a session?"
- "How to cancel/reschedule?"
- "I feel anxious"
- "I'm overwhelmed"

### Emotional Support
When users express emotional distress, the chatbot will:
- Provide calming advice
- Suggest immediate therapist booking
- Offer supportive guidance

## Technical Details

### Color Palette
- Soft Lavender: `#C8BFE7` (accents)
- Sky Blue: `#A9D6E5` (buttons)
- Misty Rose: `#FFE5EC` (chat bubbles)
- Deep Charcoal Black: `#1E1E1E` (text)

### Responsive Design
- Mobile: Auto-collapses to chat icon
- Tablet/Desktop: Full chat window
- Adaptive sizing and positioning

### Security
- API key should be kept secure
- Consider using backend proxy for production
- Implement rate limiting for production use

## Future Enhancements
- Store conversation logs in Firebase
- Add voice-to-text input
- Route complex questions to support team
- Add user authentication integration
- Implement conversation history persistence

## Troubleshooting

### Common Issues
1. **API Key Error**: Ensure the API key is correctly set in `src/config/api.ts`
2. **Network Error**: Check internet connection and API key validity
3. **Loading Issues**: Verify the Google Generative AI SDK is installed

### Error Handling
The chatbot includes fallback responses for:
- API errors
- Network issues
- Invalid responses
- Rate limiting

## Support
For technical support or questions about the chatbot implementation, please refer to the project documentation or contact the development team. 