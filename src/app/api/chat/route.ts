import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';
import { createClient } from '@/lib/supabase/server';
import { extractVisaIntent, configureUserFromIntent } from '@/lib/visa-intent';

export const runtime = 'edge';

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

    // VISA INTENT DETECTION - WORKS FOR ALL USERS
    let visaIntentDetected = null;
    let enhancedAnswer = null;
    let configuredVisa = null;
    let isJourneyChange = false;

    try {
      const chatContext = [...conversationHistory, { role: 'user', content: question }];
      const visaIntent = await extractVisaIntent(chatContext);
      
      if (visaIntent && visaIntent.destination_country && visaIntent.visa_type) {
        visaIntentDetected = visaIntent;
        console.log('🎯 Extracted visa intent:', visaIntent);

        // FOR SIGNED-IN USERS: Auto-configure profile
        if (currentUser) {
          const supabase = await createClient();
          const { data: currentProfile } = await supabase
            .from('user_profiles')
            .select('destination_country, visa_type')
            .eq('id', currentUser.id)
            .single();

          const isChangingDestination = currentProfile?.destination_country && 
                                       currentProfile.destination_country !== visaIntent.destination_country;
          const isChangingVisaType = currentProfile?.visa_type && 
                                    currentProfile.visa_type !== visaIntent.visa_type;

          isJourneyChange = isChangingDestination || isChangingVisaType;

          const needsUpdate = !currentProfile?.destination_country || 
                             !currentProfile?.visa_type ||
                             isJourneyChange;

          if (needsUpdate) {
            await configureUserFromIntent(currentUser.id, visaIntent, currentProfile);
            configuredVisa = {
              type: visaIntent.visa_type,
              country: visaIntent.destination_country,
              isChange: isJourneyChange,
              from: isJourneyChange ? {
                country: currentProfile?.destination_country,
                visaType: currentProfile?.visa_type
              } : null
            };
            
            userContext = {
              ...userContext,
              destination: visaIntent.destination_country,
              visaType: visaIntent.visa_type
            };
          }
        }
        // FOR ANONYMOUS USERS: Just detect and suggest
        else {
          console.log('👤 Visa intent detected for anonymous user');
        }
      }
    } catch (error) {
      console.error('Error processing visa intent:', error);
    }

    // Get chat response from AI
    const result = await visaChatAssistant({
      question,
      wishCount,
      conversationHistory,
      userContext,
      isSignedIn
    });

    // ENHANCE RESPONSE BASED ON USER TYPE
    if (visaIntentDetected) {
      if (currentUser && configuredVisa) {
        // Signed-in user: Show configuration message
        if (isJourneyChange) {
          enhancedAnswer = `🔄 **Visa Journey Updated!** I've changed your profile from **${configuredVisa.from?.visaType} Visa to ${configuredVisa.from?.country}** to **${configuredVisa.type} Visa to ${configuredVisa.country}**. Your progress has been reset for the new requirements. \n\n${result.answer}`;
        } else {
          enhancedAnswer = `🎯 **Visa Profile Configured!** I've set up your profile for **${configuredVisa.type} Visa** to **${configuredVisa.country}**. \n\n${result.answer}`;
        }
      } else if (!currentUser) {
        // Anonymous user: Show suggestion message
        enhancedAnswer = `${result.answer}\n\n---\n\n🎯 **I see you're interested in ${visaIntentDetected.visa_type} visa for ${visaIntentDetected.destination_country}!** \n\nWant to track your progress and get personalized document checklist? **Sign up now** to:\n• Track your application progress\n• Get document verification\n• Receive deadline reminders\n• Access visa success predictors`;
      }
    }

    return NextResponse.json({
      answer: enhancedAnswer || result.answer,
      insights: result.insights,
      visaIntentDetected: !!visaIntentDetected,
      isSignedIn: !!currentUser,
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
