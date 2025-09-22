import { NextRequest, NextResponse } from 'next/server';
import { siteAssistant } from '@/ai/flows/site-assistant-flow';

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json();

    // Call the site assistant flow with the correct parameter format
    const response = await siteAssistant({ question: message });

    return NextResponse.json({ 
      response: response.answer, // FIXED: Use response.answer instead of response.answer
      success: true 
    });

  } catch (error) {
    console.error('Visitor chat API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process message',
        success: false 
      },
      { status: 500 }
    );
  }
}
