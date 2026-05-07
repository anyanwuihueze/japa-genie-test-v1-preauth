import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasKey: !!process.env.KIMI_API_KEY,
    keyLength: process.env.KIMI_API_KEY?.length || 0,
    envFile: process.env.NODE_ENV
  });
}
