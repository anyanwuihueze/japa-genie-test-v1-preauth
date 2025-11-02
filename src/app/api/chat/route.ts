import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, wishCount = 1, conversationHistory = [] } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    let userContext: any = {};
    let isSignedIn = false;

    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (user && !authError) {
        isSignedIn = true;
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          userContext = {
            name: profile.preferred_name || user.user_metadata?.name || user.email?.split('@')[0],
            country: profile.country,
            destination: profile.destination_country,
            profession: profile.profession,
            visaType: profile.visa_type,
            age: profile.age,
            dateOfBirth: profile.date_of_birth
          };
        }
      }
    } catch (error) {
      console.error('Auth/profile fetch error:', error);
    }

    const result = await visaChatAssistant({
      question,
      wishCount,
      conversationHistory,
      userContext,
      isSignedIn
    });

    return NextResponse.json({
      answer: result.answer,
      insights: result.insights
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
