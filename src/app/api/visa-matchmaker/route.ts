// src/app/api/visa-matchmaker/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { visaMatchmaker } from '@/ai/flows/visa-matchmaker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔮 AI VISA MATCHMAKER REQUEST:', body);
    
    const startTime = Date.now();
    const results = await visaMatchmaker(body);
    const endTime = Date.now();
    
    console.log(`✅ AI ANALYSIS COMPLETE (${endTime - startTime}ms):`, results);
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('❌ AI VISA MATCHMAKER ERROR:', error);
    return NextResponse.json(
      { 
        error: 'AI analysis service temporarily unavailable',
        message: error.message,
        fallback: true
      },
      { status: 500 }
    );
  }
}