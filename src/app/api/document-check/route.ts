import { NextRequest, NextResponse } from 'next/server';
import { documentChecker } from '@/ai/flows/document-checker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentDataUri } = body;

    if (!documentDataUri || typeof documentDataUri !== 'string') {
      return NextResponse.json(
        { error: 'documentDataUri is required and must be a valid Data URI' },
        { status: 400 }
      );
    }

    const result = await documentChecker({ documentDataUri });
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Document check error:', error.message || error);
    return NextResponse.json(
      { error: 'Failed to analyze document' },
      { status: 500 }
    );
  }
}
