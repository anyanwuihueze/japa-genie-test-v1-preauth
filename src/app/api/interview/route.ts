import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/ai/flows/interview-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== 'string') {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const result = await generateInterviewQuestion({ topic });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Interview generation error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to generate interview question' },
      { status: 500 }
    );
  }
}
