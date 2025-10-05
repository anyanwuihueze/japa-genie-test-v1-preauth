import { NextRequest, NextResponse } from 'next/server';
import { generateRejectionStrategy } from '@/ai/flows/rejection-reversal-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body; // e.g., rejection letter text

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const result = await generateRejectionStrategy({ question: message });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Rejection reversal error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}
