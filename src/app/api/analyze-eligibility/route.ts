import { NextResponse } from 'next/server';
import { analyzeQuickEligibility } from '@/ai/flows/quick-eligibility-flow';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = await analyzeQuickEligibility({
      destination: body.destination,
      visaType: body.visaType,
      background: body.background,
      currentSituation: body.currentSituation || body.background
    });
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Eligibility API error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
