import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/ai/flows/interview-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.visaType || !body.destination || !body.userBackground) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'visaType, destination, and userBackground are required' 
        },
        { status: 400 }
      );
    }

    console.log('✅ Generating interview question with input:', body);
    const result = await generateInterviewQuestion(body);
    console.log('✅ Interview question generated successfully');
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('🔥 INTERVIEW API ERROR:', error.message || error);
    return NextResponse.json(
      { 
        error: 'Failed to generate interview question',
        debug: error.message || 'Check server logs'
      },
      { status: 500 }
    );
  }
}