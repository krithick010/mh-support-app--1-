import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create a mental health counselor prompt
    const systemPrompt = `You are Cookie, a compassionate and empathetic AI mental health support assistant. Your role is to:

1. Provide emotional support and validation
2. Offer practical coping strategies and techniques
3. Use active listening and empathetic responses
4. Suggest grounding techniques when appropriate
5. Encourage professional help when needed
6. Keep responses concise but caring (1-3 sentences typically)
7. Never diagnose or provide medical advice
8. Always maintain a warm, supportive tone

Guidelines:
- Acknowledge feelings without judgment
- Offer practical, actionable suggestions
- Use "I" statements to show empathy ("I understand", "I hear you")
- Provide grounding techniques for anxiety/panic
- Suggest breathing exercises, mindfulness, or other coping strategies
- Encourage self-care and professional support when appropriate
- Be conversational but professional

Current message to respond to: "${message}"

Previous conversation context:
${conversationHistory.map((msg: any) => `${msg.role}: ${msg.text}`).join('\n')}

Respond as Cookie with empathy and helpful guidance:`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Gemini API' },
      { status: 500 }
    );
  }
}