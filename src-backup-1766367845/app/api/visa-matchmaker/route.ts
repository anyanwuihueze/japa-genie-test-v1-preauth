import { NextRequest, NextResponse } from 'next/server';
import { visaMatchmaker } from '@/ai/flows/visa-matchmaker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const results = await visaMatchmaker(body);
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'AI service failed: ' + error.message },
      { status: 500 }
    );
  }
}
