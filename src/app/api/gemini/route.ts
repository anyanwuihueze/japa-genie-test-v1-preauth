import { NextResponse } from 'next/server';
import { callGeminiServer } from '@/lib/gemini-server';

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const response = await callGeminiServer(prompt || 'Test prompt');
    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Gemini API endpoint',
    env: {
      geminiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET',
      nextPublicKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY ? 'SET' : 'NOT SET',
    }
  });
}
