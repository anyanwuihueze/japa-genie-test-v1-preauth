// src/app/api/analyze-pof/route.ts - EXACT SAME AS WORKING CHAT
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// SAME SETUP AS WORKING TOOLS
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Sign in for AI analysis' }, { status: 401 });
    }

    const { financialData, familyMembers } = await request.json();

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!userProfile) {
      return NextResponse.json({ error: 'Complete KYC first' }, { status: 400 });
    }

    console.log('🧠 POF analysis for user:', user.id);

    // ✅ EXACT SAME PATTERN AS WORKING CHAT ROUTE
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",  // ← SAME MODEL
      generationConfig: {          // ← ADD THIS
        temperature: 0.7,
        maxOutputTokens: 2000      // Higher for JSON analysis
      }
    });

    const prompt = `Analyze proof of funds for ${userProfile.destination_country} ${userProfile.visa_type} visa.

Financial Data: ${JSON.stringify(financialData, null, 2)}
Family Members: ${familyMembers}

Return ONLY valid JSON with this structure:
{
  "isAdequate": true/false,
  "requiredAmount": "amount in USD",
  "currentAmount": "amount in USD",
  "gap": "amount in USD",
  "recommendations": ["item1", "item2"],
  "strengths": ["item1", "item2"],
  "weaknesses": ["item1", "item2"]
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // ← SAME AS CHAT

    // Clean and parse JSON
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);

    // Save to DB
    await supabase.from('pof_analyses').insert({
      user_id: user.id,
      analysis_data: analysis,
      destination_country: userProfile.destination_country,
      visa_type: userProfile.visa_type,
      family_members: familyMembers
    });

    return NextResponse.json(analysis);

  } catch (error: any) {
    console.error('POF Analysis error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed: ' + error.message 
    }, { status: 500 });
  }
}
