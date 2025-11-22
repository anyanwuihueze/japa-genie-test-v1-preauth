// src/app/api/analyze-pof/route.ts - WITH OVERRIDE SUPPORT
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
    const { financialData, familyMembers, overrideProfile } = await request.json();
    console.log('📦 Request data received');

    // 3. Fetch user profile (try both table names)
    let userProfile = null;
    
    const { data: profile1, error: error1 } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile1) {
      userProfile = profile1;
      console.log('✅ Found profile in user_profiles');
    } else {
      console.log('⚠️ user_profiles error:', error1?.message);
      
      const { data: profile2, error: error2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile2) {
        userProfile = profile2;
        console.log('✅ Found profile in profiles');
      } else {
        console.log('⚠️ profiles error:', error2?.message);
      }
    }

    // 4. Determine which profile data to use
    let profileForAnalysis;
    
    if (userProfile?.destination_country && userProfile?.visa_type) {
      // ✅ BEST: Use DB profile
      profileForAnalysis = {
        destination_country: userProfile.destination_country,
        visa_type: userProfile.visa_type,
        nationality: userProfile.nationality || userProfile.country
      };
      console.log('✅ Using database profile');
    } else if (overrideProfile?.destination_country && overrideProfile?.visa_type) {
      // ⚠️ OK: Use manual override
      profileForAnalysis = {
        destination_country: overrideProfile.destination_country,
        visa_type: overrideProfile.visa_type,
        nationality: overrideProfile.country || 'Unknown'
      };
      console.log('⚠️ Using manual override (profile incomplete)');
    } else {
      // ❌ FAIL: No data at all
      console.log('❌ No profile data available');
      return NextResponse.json(
        { error: 'Please provide destination country and visa type' },
        { status: 400 }
      );
    }

    console.log('📋 Analysis profile:', profileForAnalysis);

    // 5. Call the flow for AI analysis
    const result = await analyzeProofOfFunds({
      userProfile: profileForAnalysis,
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

    // 6. Save to database (optional - don't fail if this errors)
    try {
      await supabase
        .from('pof_analyses')
        .insert({
          user_id: user.id,
          analysis_data: result.analysis,
          destination_country: profileForAnalysis.destination_country,
          visa_type: profileForAnalysis.visa_type,
          family_members: familyMembers || 1
        });
      console.log('✅ Analysis saved to database');
    } catch (dbError: any) {
      console.error('⚠️ Database save failed (non-critical):', dbError.message);
    }

    // 7. Return the analysis
    return NextResponse.json(result.analysis);

  } catch (error: any) {
    console.error('❌ API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed: ' + error.message },
      { status: 500 }
    );
  }
}
