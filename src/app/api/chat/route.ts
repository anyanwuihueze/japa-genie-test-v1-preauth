// src/app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, wishCount = 1, conversationHistory = [], userContext, isSignedIn = false } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json({ error: 'Question required' }, { status: 400 });
    }

    let realUserContext = userContext || {};
    let isUserSignedIn = isSignedIn;

    // REAL DATA PIPELINE
    if (!isSignedIn) {
      // Anonymous – use KYC from sessionStorage (sent by client)
      realUserContext = userContext || {};
    } else {
      // Signed-in – load from Supabase
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (user && !authError) {
        const { data: profile } = await supabase.from('user_profiles').select('*').eq('id', user.id).single();
        if (profile) {
          realUserContext = {
            name: profile.preferred_name || user.user_metadata?.name || user.email?.split('@')[0],
            country: profile.country,
            destination: profile.destination_country,
            visaType: profile.visa_type,
            profession: profile.profession,
            userType: profile.user_type,
            timelineUrgency: profile.timeline_urgency,
            age: profile.age,
          };
        }
      }
    }

    const result = await visaChatAssistant({
      question,
      wishCount,
      conversationHistory,
      userContext: realUserContext,
      isSignedIn: isUserSignedIn,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Failed to process question', details: error.message }, { status: 500 });
  }
}