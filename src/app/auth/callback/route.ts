import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Progress creation function
async function createUserProgress(userId: string) {
  const supabase = await createClient();
  
  try {
    console.log('🎯 Creating progress records for user:', userId);
    
    const { error: progressError } = await supabase
      .from('user_progress')
      .insert([
        { 
          user_id: userId, 
          step_name: 'onboarding_complete', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'kyc_complete', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'first_chat', 
          completed: false,
          created_at: new Date().toISOString()
        },
        { 
          user_id: userId, 
          step_name: 'payment_complete', 
          completed: false,
          created_at: new Date().toISOString()
        }
      ]);

    if (progressError) {
      console.log('⚠️ Progress creation failed (non-critical):', progressError.message);
    } else {
      console.log('✅ User progress records created successfully');
    }
  } catch (error) {
    console.log('⚠️ Progress creation error (non-critical):', error);
  }
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  console.log('🚀 Auth callback started');
  
  if (!code) {
    console.log('❌ No code provided');
    return NextResponse.redirect(`${origin}/?error=no_code`);
  }

  // ✅ CRITICAL FIX: Extract state parameter from OAuth
  const state = requestUrl.searchParams.get('state');
  let kycSessionId = null;
  let nextPath = '/dashboard'; // default fallback
  
  if (state) {
    // Parse state parameters: "next=/chat&kyc_session_id=abc123"
    const params = new URLSearchParams(state);
    kycSessionId = params.get('kyc_session_id');
    const nextParam = params.get('next');
    if (nextParam) {
      nextPath = decodeURIComponent(nextParam);
      console.log('🎯 Next path from state:', nextPath);
    }
  }
  
  // Also check query params for next (backward compatibility)
  const queryNext = requestUrl.searchParams.get('next');
  if (queryNext) {
    nextPath = decodeURIComponent(queryNext);
    console.log('�� Next path from query:', nextPath);
  }
  
  console.log('🔑 Extracted from OAuth:', { kycSessionId, nextPath });

  const supabase = await createClient();
  
  // Exchange code for session
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  
  if (exchangeError) {
    console.error('❌ Exchange error:', exchangeError);
    return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(exchangeError.message)}`);
  }
  
  console.log('✅ Session established');
  
  // Get user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    console.error('❌ User error:', userError);
    return NextResponse.redirect(`${origin}/?error=no_user`);
  }
  
  console.log('👤 User ID:', user.id);
  
  // Get or create profile
  let { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('id, country, destination_country, visa_type, age, user_type, timeline_urgency')
    .eq('id', user.id)
    .maybeSingle();
  
  console.log('📋 Profile:', profile);
  
  // If no profile, create one
  if (!profile) {
    console.log('📝 Creating new profile...');
    
    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([{ 
        id: user.id,
        country: null,
        destination_country: null,
        visa_type: null,
        age: null,
        user_type: null,
        timeline_urgency: null
      }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Profile creation error:', insertError);
    } else {
      profile = newProfile;
      console.log('✅ Profile created');
      
      await createUserProgress(user.id);
    }
  }
  
  // ✅ Check if profile is complete - ALL KYC FIELDS
  let isProfileComplete = profile && 
    profile.country && 
    profile.country.trim() !== '' &&
    profile.destination_country && 
    profile.destination_country.trim() !== '' &&
    profile.visa_type && 
    profile.visa_type.trim() !== '' &&
    profile.age && 
    profile.user_type &&  
    profile.timeline_urgency;
  
  console.log('✅ Profile complete?', isProfileComplete, {
    country: !!profile?.country,
    destination: !!profile?.destination_country, 
    visa_type: !!profile?.visa_type,
    age: !!profile?.age,
    user_type: !!profile?.user_type,
    timeline: !!profile?.timeline_urgency
  });
  
  // ✅ CRITICAL FIX: If we have kyc_session_id, try to load and transfer KYC
  if (kycSessionId && !isProfileComplete) {
    console.log('🔄 Attempting KYC transfer from session:', kycSessionId);
    
    const { data: kycData } = await supabase
      .from('kyc_sessions')
      .select('country, destination_country, age, visa_type, profession, user_type, timeline_urgency, budget')
      .eq('session_id', kycSessionId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (kycData) {
      console.log('✅ Found KYC data to transfer:', kycData);
      
      // Update user profile with KYC data
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          country: kycData.country,
          destination_country: kycData.destination_country,
          age: kycData.age,
          visa_type: kycData.visa_type,
          profession: kycData.profession,
          user_type: kycData.user_type,
          timeline_urgency: kycData.timeline_urgency,
          kyc_completed: true,
          kyc_last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (!updateError) {
        console.log('✅ KYC transferred to user profile');
        // Reload profile with new KYC data
        const { data: updatedProfile } = await supabase
          .from('user_profiles')
          .select('id, country, destination_country, visa_type, age, user_type, timeline_urgency')
          .eq('id', user.id)
          .single();
        
        if (updatedProfile) {
          profile = updatedProfile;
          // Re-check if profile is now complete
          isProfileComplete = profile && 
            profile.country && 
            profile.country.trim() !== '' &&
            profile.destination_country && 
            profile.destination_country.trim() !== '' &&
            profile.visa_type && 
            profile.visa_type.trim() !== '' &&
            profile.age && 
            profile.user_type &&  
            profile.timeline_urgency;
          
          console.log('✅ Profile after KYC transfer complete?', isProfileComplete);
        }
      } else {
        console.error('❌ KYC transfer failed:', updateError);
      }
    } else {
      console.log('⚠️ No KYC data found for session:', kycSessionId);
    }
  }
  
  // Check subscription (for logging only)
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('id, status, plan_type')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  
  console.log('💳 Subscription:', subscription);
  
  // ✅ FIXED FLOW LOGIC - Check KYC transfer first
  if (!isProfileComplete) {
    console.log('🎯 REDIRECT → /kyc (incomplete profile, no KYC transfer)');
    return NextResponse.redirect(`${origin}/kyc`);
  }
  
  // ✅ Profile complete? Go to original page (chat, pricing, etc.) or dashboard!
  console.log('🎯 REDIRECT →', nextPath, '(profile complete)');
  return NextResponse.redirect(`${origin}${nextPath}`);
}
