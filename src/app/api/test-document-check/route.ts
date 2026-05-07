import { NextRequest, NextResponse } from 'next/server';
import { documentChecker } from '@/ai/flows/document-checker';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.documentDataUri) {
      return NextResponse.json({ error: 'documentDataUri required' }, { status: 400 });
    }

    console.log('🧪 Testing document checker...');
    
    const result = await documentChecker({
      documentDataUri: body.documentDataUri,
      targetCountry: body.targetCountry || 'Canada',
      visaType: body.visaType || 'student'
    });

    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('❌ Test error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error.stack 
    }, { status: 500 });
  }
}
