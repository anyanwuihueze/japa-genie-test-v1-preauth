import { NextResponse } from 'next/server';

// ⚠️ CRITICAL: Add this to prevent prerendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // or 'edge' if you prefer

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Analytics tracking - just return success for now
    // You can integrate with your analytics provider later (Google Analytics, Mixpanel, etc.)
    console.log('Analytics event:', body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}