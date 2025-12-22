import { NextRequest, NextResponse } from 'next/server';
import { generateInsights } from '@/ai/insights-generator';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  let userQuestion: string | undefined;
  let userId: string | undefined;
  
  try {
    const body = await request.json();
    const { question, userId: requestUserId } = body;
    userQuestion = question;
    userId = requestUserId;

    if (!userQuestion || userQuestion.trim().length === 0) {
      return NextResponse.json(
        { error: 'Question is required and cannot be empty' }, 
        { status: 400 }
      );
    }

    console.log('🔄 Generating premium insights for question:', userQuestion.substring(0, 100));

    let userProfile = undefined;
    
    if (userId) {
      try {
        const supabase = await createClient();
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('age, profession, country, destination_country, visa_type')
          .eq('id', userId)
          .single();

        if (profile && !profileError) {
          userProfile = {
            age: profile.age,
            profession: profile.profession,
            country: profile.country,
            destinationCountry: profile.destination_country,
            visaType: profile.visa_type,
          };
          console.log('✅ User profile loaded for personalization:', {
            country: userProfile.country,
            destination: userProfile.destinationCountry,
          });
        }
      } catch (profileFetchError) {
        console.error('❌ Error fetching user profile:', profileFetchError);
      }
    }

    let insights;
    let attempts = 0;
    const maxAttempts = 3;
    let lastError;

    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Attempt ${attempts}/${maxAttempts} to generate insights...`);
        
        // CALL WITH JUST question - NO userProfile parameter
        insights = await generateInsights({ 
          question: userQuestion
        });

        if (insights && insights.insights && insights.insights.length > 0) {
          console.log('✅ Premium insights generated successfully on attempt', attempts);
          break;
        } else {
          throw new Error('AI returned empty insights');
        }
        
      } catch (attemptError: any) {
        lastError = attemptError;
        console.error(`❌ Attempt ${attempts} failed:`, attemptError.message);
        
        if (attempts < maxAttempts) {
          const delay = Math.min(1000 * Math.pow(2, attempts - 1), 5000);
          console.log(`⏳ Waiting ${delay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    if (!insights || !insights.insights || insights.insights.length === 0) {
      throw lastError || new Error('Failed to generate insights after all retries');
    }

    if (userId) {
      try {
        const supabase = await createClient();
        
        const { error: saveError } = await supabase
          .from('visa_insights')
          .insert({
            user_id: userId,
            insight_data: insights,
            question: userQuestion,
            created_at: new Date().toISOString(),
          });

        if (!saveError) {
          console.log('✅ Insights saved to database for user:', userId);
        }
      } catch (dbError) {
        console.error('❌ Database save error:', dbError);
      }
    }

    return NextResponse.json(insights, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });

  } catch (error: any) {
    console.error('❌ Critical error in insights API:', error);

    return NextResponse.json({
      insights: [
        {
          headline: 'Service Temporarily Unavailable',
          detail: 'The Genie is experiencing technical difficulties. Please try again in a moment, or rephrase your question.',
          url: undefined,
        }
      ],
      costEstimates: [],
      visaAlternatives: [],
      genieRecommendation: undefined,
      levelUpSuggestions: undefined,
      similarCountries: undefined,
      insiderTips: undefined,
      chartData: undefined,
      timeline: undefined,
      alternativeStrategies: undefined,
      error: true,
      errorMessage: error.message || 'Unknown error occurred',
    }, { 
      status: 500 
    });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}