import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';

export async function POST(request: NextRequest) {
  console.log('=== API CALL STARTED ===');
  
  // DEBUG: Check environment variable
  console.log('=== ENV DEBUG ===');
  console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
  console.log('GEMINI_API_KEY prefix:', process.env.GEMINI_API_KEY?.substring(0, 10));
  console.log('=== END ENV DEBUG ===');
  
  try {
    const body = await request.json();
    console.log('Body received:', JSON.stringify(body, null, 2));
    
    const { question, wishCount } = body;
    
    console.log('Calling AI with:', { question, wishCount });
    const response = await visaChatAssistant({ 
      question: question,
      wishCount: wishCount
    });
    
    console.log('AI Response received:', JSON.stringify(response, null, 2));
    
    return NextResponse.json({ 
      answer: response.answer,
      success: true 
    });

  } catch (err: unknown) {
    console.error('=== AI ERROR ===');
    
    if (err instanceof Error) {
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      return NextResponse.json(
        { 
          error: `AI Error: ${err.message}`,
          success: false
        },
        { status: 500 }
      );
    } else {
      console.error('Unknown error:', err);
      return NextResponse.json(
        { 
          error: 'AI Error: Unknown error',
          success: false
        },
        { status: 500 }
      );
    }
  }
}
