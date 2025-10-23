import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build context from conversation history
    const context = conversationHistory
      ?.slice(-5) // Last 5 messages
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') || '';

    const prompt = `You are the Japa Genie site assistant. Answer questions about our visa services, features, and pricing.

${context ? `Previous conversation:\n${context}\n\n` : ''}

User question: "${message}"

Provide a helpful, concise answer about our services. Be friendly and informative.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('Visitor chat error:', error);
    return NextResponse.json(
      {
        response: "I'm having trouble connecting right now. Please try asking about our visa services, pricing, or features.",
        error: error.message
      },
      { status: 200 }
    );
  }
}
