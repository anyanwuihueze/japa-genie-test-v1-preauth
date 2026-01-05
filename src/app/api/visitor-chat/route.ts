import { NextRequest, NextResponse } from 'next/server';
import { siteAssistant } from '@/ai/flows/site-assistant-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const result = await siteAssistant({ question: message });
    return NextResponse.json({ response: result.answer });
    
  } catch (error: any) {
    console.error('Visitor Chat API error:', error);
    return NextResponse.json({
      response: "I'm having trouble connecting right now. Please try asking about our visa services, pricing, or features."
    });
  }
}
