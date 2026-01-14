import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedReport } from '@/ai/flows/report-generator';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.analysisResult) return NextResponse.json({ error: 'analysisResult required' }, { status: 400 });
    const report = await generatePersonalizedReport(body.analysisResult, body.targetCountry || 'General', body.visaType || 'Tourist');
    return NextResponse.json(report);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
