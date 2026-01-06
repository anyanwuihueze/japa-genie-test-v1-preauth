import { NextRequest, NextResponse } from 'next/server';
import { analyzeProofOfFunds } from '@/ai/flows/analyze-proof-of-funds';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📊 POF Analysis request for:', body.destinationCountry, body.visaType);

    const result = await analyzeProofOfFunds(body);
    
    return NextResponse.json({ 
      success: true, 
      analysis: result 
    });

  } catch (error: any) {
    console.error('❌ POF API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    );
  }
}
