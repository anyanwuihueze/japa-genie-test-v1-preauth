// src/app/api/analyze-pof/route.ts - Using Flow Pattern
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeProofOfFunds } from '@/ai/flows/analyze-proof-of-funds';

export async function POST(request: NextRequest) {
  console.log('🚀 POF API endpoint called');
  
  try {
    // 1. Authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ Unauthorized request');
      return NextResponse.json(
        { error: 'Please sign in to use AI analysis' }, 
        { status: 401 }
      );
    }

    console.log('✅ User authenticated:', user.id);

    // 2. Get request data
    const { financialData, familyMembers } = await request.json();
    console.log('📦 Request data received');

    // 3. Fetch user profile (try both table names)
    let userProfile = null;
    
    const { data: profile1 } = await supabase
      .from('user_profiles')
      .select('destination_country, visa_type, nationality')
      .eq('id', user.id)
      .single();

    if (profile1) {
      userProfile = profile1;
    } else {
      const { data: profile2 } = await supabase
        .from('profiles')
        .select('destination_country, visa_type, nationality')
        .eq('id', user.id)
        .single();
      
      userProfile = profile2;
    }

    if (!userProfile || !userProfile.destination_country || !userProfile.visa_type) {
      console.log('⚠️ Incomplete profile');
      return NextResponse.json(
        { error: 'Please complete your KYC profile first' },
        { status: 400 }
      );
    }

    console.log('✅ User profile loaded:', userProfile.destination_country);

    // 4. Call the flow for AI analysis
    const result = await analyzeProofOfFunds({
      userProfile,
      financialData,
      familyMembers: familyMembers || 1
    });

    if (!result.success || !result.analysis) {
      console.error('❌ Flow returned error:', result.error);
      return NextResponse.json(
        { error: result.error || 'Analysis failed' },
        { status: 500 }
      );
    }

    console.log('✅ Analysis successful');

    // 5. Save to database
    const { error: insertError } = await supabase
      .from('pof_analyses')
      .insert({
        user_id: user.id,
        analysis_data: result.analysis,
        destination_country: userProfile.destination_country,
        visa_type: userProfile.visa_type,
        family_members: familyMembers || 1
      });

    if (insertError) {
      console.error('⚠️ Database save failed:', insertError.message);
      // Don't fail the request, just log it
    } else {
      console.log('✅ Analysis saved to database');
    }

    // 6. Return the analysis
    return NextResponse.json(result.analysis);

  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed: ' + error.message },
      { status: 500 }
    );
  }
}
