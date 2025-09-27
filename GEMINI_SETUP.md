# Setup Instructions for Gemini AI Integration

## Getting Your Gemini API Key

1. **Visit Google AI Studio**: Go to https://makersuite.google.com/app/apikey
2. **Sign in**: Use your Google account to sign in
3. **Create API Key**: Click "Create API Key" button
4. **Copy the key**: Copy the generated API key

## Setting up the Environment

1. **Open the .env.local file** in your project root
2. **Replace the placeholder** with your actual API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. **Save the file**
4. **Restart your development server** for the changes to take effect:
   ```bash
   npm run dev
   ```

## Features Implemented

- ✅ Removed API key input from UI
- ✅ Added Gemini 1.5 Flash model integration
- ✅ Created secure API route for chat responses
- ✅ Enhanced mental health counselor prompts
- ✅ Conversation context awareness (last 10 messages)
- ✅ Error handling with fallback responses
- ✅ Professional mental health guidance system

## Testing

1. Make sure your API key is set in `.env.local`
2. Start the development server: `npm run dev`
3. Navigate to `http://localhost:3000/cookie`
4. Start chatting with Cookie - responses will now be powered by Gemini AI!

## Security Notes

- The `.env.local` file is automatically ignored by Git (not committed to version control)
- API key is only accessible on the server-side
- Never expose your API key in client-side code