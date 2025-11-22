// src/app/api/analyze-pof/route.ts - WITH DETAILED LOGGING
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  console.log('🚀 ========== POF API CALLED ==========');
  
  try {
    const supabase = await createClient();
    console.log('✅ Step 1: Supabase client created');
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('✅ Step 2: User ID:', user?.id);
    
    if (!user) {
      console.log('❌ FAILED: No user authenticated');
      return NextResponse.json({ error: 'Sign in for AI analysis' }, { status: 401 });
    }

    const body = await request.json();
    console.log('✅ Step 3: Request body received:', JSON.stringify(body).substring(0, 100));
    
    const { financialData, familyMembers } = body;

    // Try both table names
    let userProfile = null;
    const { data: profile1, error: error1 } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile1) {
      userProfile = profile1;
      console.log('✅ Step 4a: Found profile in user_profiles');
    } else {
      console.log('⚠️ Step 4a: user_profiles failed:', error1?.message);
      
      const { data: profile2, error: error2 } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (profile2) {
        userProfile = profile2;
        console.log('✅ Step 4b: Found profile in profiles table');
      } else {
        console.log('❌ Step 4b: profiles also failed:', error2?.message);
        // Continue anyway with default values
        userProfile = {
          destination_country: 'Unknown',
          visa_type: 'Tourist',
        };
        console.log('⚠️ Using default profile values');
      }
    }

    console.log('📋 Profile data:', userProfile);
    console.log('✅ Step 5: Preparing Gemini API call...');
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    });

    const prompt = `Analyze proof of funds for ${userProfile.destination_country} ${userProfile.visa_type} visa.

Financial Data: ${typeof financialData === 'string' ? financialData : JSON.stringify(financialData, null, 2)}
Family Members: ${familyMembers}

Return ONLY valid JSON with this EXACT structure (no markdown, no code blocks):
{
  "summary": {
    "totalScore": 7,
    "meetsRequirements": true,
    "riskLevel": "medium",
    "confidence": 80
  },
  "financialAnalysis": {
    "totalAssets": 50000,
    "liquidAssets": 40000,
    "seasoningDays": 90,
    "currency": "USD",
    "stabilityScore": 7
  },
  "complianceCheck": {
    "passes": true,
    "issues": [],
    "specificAdvice": ["Maintain current balance for next 60 days"]
  },
  "accountBreakdown": [],
  "recommendations": [
    {
      "priority": "medium",
      "action": "Maintain stable balance",
      "timeline": "60 days",
      "impact": "Demonstrates financial stability"
    }
  ],
  "embassySpecific": {
    "minimumFunds": 40000,
    "seasoningRequirements": 90,
    "documentChecklist": ["Bank statements (6 months)", "Bank letter", "Source of funds"],
    "commonRejectionReasons": ["Insufficient funds", "Unexplained deposits"]
  }
}`;

    console.log('✅ Step 6: Calling Gemini API (model: gemini-2.0-flash)...');
    
    const result = await model.generateContent(prompt);
    console.log('✅ Step 7: Gemini API responded');
    
    const responseText = result.response.text();
    console.log('✅ Step 8: Raw response length:', responseText.length);
    console.log('📄 First 300 chars:', responseText.substring(0, 300));

    // Clean the response
    let cleanedText = responseText.trim();
    
    // Remove markdown code blocks if present
    cleanedText = cleanedText.replace(/```json\n?/g, '');
    cleanedText = cleanedText.replace(/```\n?/g, '');
    cleanedText = cleanedText.trim();
    
    console.log('✅ Step 9: Cleaned response length:', cleanedText.length);
    console.log('🧹 First 300 chars of cleaned:', cleanedText.substring(0, 300));

    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
      console.log('✅ Step 10: JSON parsed successfully!');
      console.log('📊 Analysis summary:', {
        hasData: !!analysis,
        hasSummary: !!analysis?.summary,
        score: analysis?.summary?.totalScore,
        riskLevel: analysis?.summary?.riskLevel
      });
    } catch (parseError: any) {
      console.error('❌ Step 10 FAILED: JSON parse error:', parseError.message);
      console.error('🔍 Attempting to parse this text:', cleanedText.substring(0, 500));
      
      // Try to extract JSON if it's mixed with other text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('🔧 Found JSON pattern, retrying parse...');
        analysis = JSON.parse(jsonMatch[0]);
        console.log('✅ Retry successful!');
      } else {
        throw new Error('Could not parse AI response as JSON. Response: ' + cleanedText.substring(0, 200));
      }
    }

    // Validate the analysis has required structure
    if (!analysis.summary || !analysis.summary.riskLevel) {
      console.error('❌ Invalid analysis structure:', analysis);
      throw new Error('AI returned invalid analysis structure');
    }

    console.log('✅ Step 11: Attempting to save to database...');
    
    const { error: insertError } = await supabase.from('pof_analyses').insert({
      user_id: user.id,
      analysis_data: analysis,
      destination_country: userProfile.destination_country,
      visa_type: userProfile.visa_type,
      family_members: familyMembers
    });

    if (insertError) {
      console.error('⚠️ Step 11: DB insert failed (non-critical):', insertError.message);
    } else {
      console.log('✅ Step 11: Saved to database successfully');
    }

    console.log('✅ Step 12: Returning analysis to client');
    console.log('🎉 ========== POF API SUCCESS ==========');
    
    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('❌❌❌ POF Analysis FAILED ❌❌❌');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: 'Analysis failed: ' + error.message,
      errorType: error.constructor.name,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
