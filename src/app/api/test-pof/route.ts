import { groq } from '@/lib/groq-client';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    const { financialData } = await request.json();

    console.log('🧪 Testing POF analysis with Groq');

    const prompt = `Analyze this financial data: ${JSON.stringify(financialData)}. Just respond with "POF ANALYSIS IS WORKING!" if you can read this.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      message: 'POF Analysis is WORKING!',
      response: response
    });

  } catch (error: any) {
    console.error('POF Test Error:', error);
    return NextResponse.json(
      { error: 'POF Test Failed: ' + error.message },
      { status: 500 }
    );
  }
}
