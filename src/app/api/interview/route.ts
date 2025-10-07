import { NextRequest, NextResponse } from 'next/server';
import { generateInterviewQuestion } from '@/ai/flows/interview-flow';
import type { InterviewQuestionInput } from '@/ai/flows/interview-flow';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InterviewQuestionInput;

    if (!body.visaType || !body.destination || !body.userBackground) {
      return NextResponse.json(
        { error: 'Missing required fields: visaType, destination, and userBackground are required.' },
        { status: 400 }
      );
    }

    const result = await generateInterviewQuestion(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Interview generation error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to generate interview question' },
      { status: 500 }
    );
  }
}
