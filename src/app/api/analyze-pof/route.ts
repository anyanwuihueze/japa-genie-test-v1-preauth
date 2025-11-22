// src/app/api/analyze-pof/route.ts - FIXED VERSION (same pattern as working PDF generator)
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // 🎯 REQUIRE AUTHENTICATION - Only paying users get AI analysis
    if (!user) {
      return NextResponse.json({ error: 'Sign in for AI analysis' }, { status: 401 });
    }

    const { financialData, familyMembers } = await request.json();

    // Get user profile with KYC data
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'Complete KYC first to use AI analysis' }, { status: 400 });
    }

    console.log('🧠 Starting POF analysis for paid user:', {
      user: user.id,
      destination: userProfile.destination_country,
      visa: userProfile.visa_type,
      family: familyMembers
    });

    // PERFORM AI ANALYSIS DIRECTLY (like working PDF generator)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
    });

    const prompt = `
    Analyze Proof of Funds for visa application:

    APPLICANT PROFILE:
    - From: ${userProfile.nationality || 'Unknown'}
    - Destination: ${userProfile.destination_country}
    - Visa Type: ${userProfile.visa_type}
    - Family Members: ${familyMembers}

    FINANCIAL DATA:
    ${JSON.stringify(financialData, null, 2)}

    Provide comprehensive analysis including compliance score, risk assessment, and recommendations.
    Return as valid JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));

    // Save analysis to database
    const { error: saveError } = await supabase
      .from('pof_analyses')
      .insert({
        user_id: user.id,
        analysis_data: analysis,
        destination_country: userProfile.destination_country,
        visa_type: userProfile.visa_type,
        family_members: familyMembers
      });

    if (saveError) {
      console.log('⚠️ Analysis save failed:', saveError);
    }

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('POF Analysis API error:', error);
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    );
  }
}
