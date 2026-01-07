import { NextRequest, NextResponse } from 'next/server';
import { analyzeProofOfFunds } from '@/ai/flows/analyze-proof-of-funds';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.userProfile || !body.financialData) {
      return NextResponse.json(
        { success: false, error: 'userProfile and financialData are required' },
        { status: 400 }
      );
    }

    // Call your AI flow
    const result = await analyzeProofOfFunds({
      userProfile: body.userProfile,
      financialData: body.financialData,
      familyMembers: body.familyMembers || 1
    });

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('❌ POF analysis API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}