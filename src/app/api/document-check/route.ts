import { NextRequest, NextResponse } from 'next/server';
import { documentChecker } from '@/ai/flows/document-checker';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📄 Document check request received');
    
    // Validate required fields
    if (!body.documentDataUri) {
      return NextResponse.json(
        { error: 'documentDataUri is required' },
        { status: 400 }
      );
    }

    console.log('🤖 Calling AI document checker...');

    // Call your AI flow
    const result = await documentChecker({
      documentDataUri: body.documentDataUri,
      targetCountry: body.targetCountry || 'General',
      visaType: body.visaType || 'Tourist',
      userId: body.userId
    });

    console.log('✅ AI analysis complete:', {
      documentType: result.documentType,
      status: result.overallStatus,
      criticalIssues: result.criticalIssues?.length || 0,
      warnings: result.warnings?.length || 0,
      passed: result.passed?.length || 0
    });

    // ✅ FIX: Return result DIRECTLY (no wrapper)
    // This matches what the client expects
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ Document check API error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
