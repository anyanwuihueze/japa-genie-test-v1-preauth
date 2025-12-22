import { NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';

export async function POST(request: Request) {
  try {
    console.log('✅ TEST CHAT CALLED');
    
    const { question } = await request.json();
    const result = await visaChatAssistant({
      question,
      wishCount: 1,
      isSignedIn: false
    });

    console.log('✅ TEST CHAT SUCCESS:', result.answer.substring(0, 50));
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('❌ TEST CHAT ERROR:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}