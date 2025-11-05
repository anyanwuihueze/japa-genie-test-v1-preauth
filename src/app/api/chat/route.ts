import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';
import { createClient } from '@/lib/supabase/server';
import { extractVisaIntent, configureUserFromIntent } from '@/lib/visa-intent';

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
    let currentUser: any = null;

    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (user && !authError) {
        isSignedIn = true;
        currentUser = user;
        
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

    // ✅ VISA INTENT EXTRACTION & AUTO-CONFIGURATION
    let visaIntentExtracted = false;
    let enhancedAnswer = null;
    let configuredVisa = null;

    if (currentUser && conversationHistory.length >= 1) {
      try {
        // Combine new question with conversation history for context
        const chatContext = [...conversationHistory, { role: 'user', content: question }];
        const visaIntent = await extractVisaIntent(chatContext);
        
        if (visaIntent && visaIntent.destination_country && visaIntent.visa_type) {
          console.log('🎯 Extracted visa intent:', visaIntent);
          
          // Check if user profile needs updating
          const supabase = await createClient();
          const { data: currentProfile } = await supabase
            .from('user_profiles')
            .select('destination_country, visa_type')
            .eq('id', currentUser.id)
            .single();

          const needsUpdate = !currentProfile?.destination_country || 
                             !currentProfile?.visa_type ||
                             currentProfile.destination_country !== visaIntent.destination_country ||
                             currentProfile.visa_type !== visaIntent.visa_type;

          if (needsUpdate) {
            await configureUserFromIntent(currentUser.id, visaIntent);
            visaIntentExtracted = true;
            configuredVisa = {
              type: visaIntent.visa_type,
              country: visaIntent.destination_country
            };
            
            // Update userContext with new visa info for the chat response
            userContext = {
              ...userContext,
              destination: visaIntent.destination_country,
              visaType: visaIntent.visa_type
            };

            console.log(`✅ Auto-configured user for ${visaIntent.visa_type} visa to ${visaIntent.destination_country}`);
          }
        }
      } catch (error) {
        console.error('Error processing visa intent:', error);
        // Don't fail the chat if intent extraction fails
      }
    }

    // Get chat response from AI
    const result = await visaChatAssistant({
      question,
      wishCount,
      conversationHistory,
      userContext,
      isSignedIn
    });

    // ✅ Enhance response if visa intent was detected and configured
    if (visaIntentExtracted && result.answer && configuredVisa) {
      enhancedAnswer = `🎯 **Visa Profile Configured!** I've set up your profile for **${configuredVisa.type} Visa** to **${configuredVisa.country}**. ${result.answer}`;
    }

    return NextResponse.json({
      answer: enhancedAnswer || result.answer,
      insights: result.insights,
      visaIntentDetected: visaIntentExtracted,
      ...(configuredVisa && { configuredVisa })
    });

  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}