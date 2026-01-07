import { NextRequest, NextResponse } from 'next/server';
import { documentChecker } from '@/ai/flows/document-checker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.documentDataUri) {
      return NextResponse.json(
        { success: false, error: 'documentDataUri is required' },
        { status: 400 }
      );
    }

    // Call your AI flow
    const result = await documentChecker({
      documentDataUri: body.documentDataUri,
      targetCountry: body.targetCountry,
      visaType: body.visaType,
      userId: body.userId
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('❌ Document check API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}