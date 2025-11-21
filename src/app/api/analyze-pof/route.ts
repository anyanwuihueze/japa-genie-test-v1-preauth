// src/app/api/analyze-pof/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { analyzeProofOfFunds } from '@/lib/ai/pof-analysis';
import { createClient } from '@/lib/supabase/server';

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

    // Perform AI analysis (expensive - only for paying users)
    const analysis = await analyzeProofOfFunds(
      userProfile,
      financialData,
      familyMembers
    );

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