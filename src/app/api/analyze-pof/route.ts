import { NextRequest, NextResponse } from 'next/server';
import { analyzeProofOfFunds } from '@/ai/flows/analyze-proof-of-funds';
import { createClient } from '@/lib/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    console.log('📊 POF Analysis request for:', body.destinationCountry, body.visaType);

    const prompt = `You are an expert visa financial analyst. Analyze proof of funds for ${body.destinationCountry} ${body.visaType} visa.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      analysis: analysis 
    });

  } catch (error: any) {
    console.error('❌ POF API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    );
  }
}
