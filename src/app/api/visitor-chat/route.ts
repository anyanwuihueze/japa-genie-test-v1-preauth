import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { SITE_ASSISTANT_CONTEXT } from '@/lib/site-assistant-context';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory, sessionId, emailCaptured } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Build context from conversation history
    const context = conversationHistory
      ?.slice(-5) // Last 5 messages for context
      .map((msg: any) => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n') || '';

    const prompt = `${SITE_ASSISTANT_CONTEXT}

${context ? `CONVERSATION HISTORY:\n${context}\n\n` : ''}

USER QUESTION: "${message}"

${emailCaptured ? 'NOTE: User has provided email, so they have unlimited general questions.' : 'NOTE: User is in free tier (limited questions).'}

INSTRUCTIONS:
1. Answer ONLY if it's about Japa Genie features, pricing, or general app usage
2. Use the knowledge base above to give accurate answers
3. If it's a visa-specific question (eligibility, documents, country requirements), redirect them to sign up
4. Keep responses under 100 words
5. Be friendly and helpful

YOUR RESPONSE:`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("❌ VISITOR CHAT ERROR:", error);
    console.error("❌ ERROR MESSAGE:", error.message);
    console.error('Visitor chat error:', error);
    return NextResponse.json(
      {
        response: "I'm having trouble connecting right now. Please try asking about our visa services, pricing, or features.",
        error: error.message
      },
      { status: 500 }
    );
  }
}