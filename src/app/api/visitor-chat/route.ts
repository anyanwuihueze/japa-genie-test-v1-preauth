import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [], sessionId, emailCaptured } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const context = conversationHistory
      ?.slice(-5)
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') || '';

    const prompt = `You are Japa Genie, a world-class visa strategist site assistant.

KNOWLEDGE BASE:
- Features: AI Eligibility Checker, Document Verification, Mock Interviews, Progress Dashboard
- Pricing: One-Time Access (₦15,000-₦45,000), Pro Plan (₦18,000/month), Premium (₦54,000/month)
- Payment: Stripe (international), Paystack (Nigeria)
- For visa-specific questions (eligibility, documents): Direct users to sign up
- For general questions (pricing, features): Answer freely

${context ? `CONVERSATION HISTORY:\n${context}\n\n` : ''}
USER QUESTION: "${message}"

${emailCaptured ? 'User has provided email - unlimited questions.' : 'User is in free tier.'}

INSTRUCTIONS:
1. Answer ONLY if about Japa Genie features, pricing, app usage
2. If visa-specific question: "That's a great visa question! Sign up for personalized answers."
3. Keep responses under 100 words
4. Be friendly and helpful

YOUR RESPONSE:`;

    // Use the environment variable for the API key
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY environment variable is not set');
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are Japa Genie site assistant. Be concise and helpful.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      }),
    });

    if (!response.ok) {
      // Handle rate limits (429) or other API errors
      const errorText = await response.text();
      console.error(`Groq API error ${response.status}:`, errorText);
      throw new Error(`Groq API responded with status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error('Visitor-chat error:', error);
    // Return a friendly, non-technical fallback message
    return NextResponse.json({
      response: "Hi! I'm the Japa Genie site assistant. I can answer questions about our services, features, and pricing. What would you like to know?"
    });
  }
}