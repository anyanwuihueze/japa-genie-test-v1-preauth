import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { financialData } = await request.json();

    console.log('🧪 Testing POF analysis with API key:', process.env.NEXT_PUBLIC_GEMINI_API_KEY?.substring(0, 10) + '...');
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    });

    const prompt = `
    Analyze this financial data: ${JSON.stringify(financialData)}
    Just say "POF ANALYSIS IS WORKING!" if you can read this.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ 
      success: true, 
      message: 'POF Analysis is WORKING!',
      response: response.text()
    });

  } catch (error: any) {
    console.error('POF Test Error:', error);
    return NextResponse.json(
      { error: 'POF Test Failed: ' + error.message },
      { status: 500 }
    );
  }
}
