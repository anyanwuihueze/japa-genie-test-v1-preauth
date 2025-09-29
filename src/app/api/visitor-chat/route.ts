import { NextRequest, NextResponse } from 'next/server';
import { siteAssistant } from '@/ai/flows/site-assistant-flow';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    console.log('🔍 Calling siteAssistant with:', { message });
    const response = await siteAssistant({ question: message });
    console.log('✅ AI Response received:', response);

    return NextResponse.json({
      response: response.answer,
      success: true
    });
  } catch (error) {
    console.error('Visitor chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process message', success: false },
      { status: 500 }
    );
  }
}