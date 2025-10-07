import { NextRequest, NextResponse } from 'next/server';
import { generateRejectionStrategy } from '@/ai/flows/rejection-reversal-flow';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json());

    if (!body.visaType || !body.destination || !body.userBackground) {
      return NextResponse.json(
        { error: 'Missing required fields: visaType, destination, and userBackground are required' },
        { status: 400 }
      );
    }

    const result = await generateRejectionStrategy(body);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Rejection reversal error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}
