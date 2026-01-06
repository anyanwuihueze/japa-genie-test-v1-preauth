import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = body;
    
    console.log('Test chat endpoint called with:', question);
    
    // Just return a simple response without calling your assistant
    return NextResponse.json({
      answer: `Test response to: "${question}". This endpoint works!`,
      insights: { test: true }
    });
    
  } catch (error: any) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
