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
      realUserContext = userContext || {};
    } else {
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

    // ADD LOGGING TO SEE WHAT'S BEING SENT
    console.log('📤 Sending to visaChatAssistant:', {
      question: question.substring(0, 50) + '...',
      wishCount,
      hasHistory: conversationHistory.length > 0,
      userContext: realUserContext,
      isSignedIn: isUserSignedIn
    });

    const result = await visaChatAssistant({
      question,
      wishCount,
      conversationHistory,
      userContext: realUserContext,
      isSignedIn: isUserSignedIn,
    });

    console.log('✅ visaChatAssistant returned successfully');
    return NextResponse.json(result);
    
  } catch (error: any) {
    // ENHANCED ERROR LOGGING
    console.error('❌ Chat API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    return NextResponse.json({ 
      error: 'Failed to process question', 
      details: error.message,
      errorType: error.constructor.name
    }, { status: 500 });
  }
}