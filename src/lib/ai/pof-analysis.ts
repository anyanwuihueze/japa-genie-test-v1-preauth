// src/lib/ai/pof-analysis.ts - FIXED VERSION
'use server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface POFAnalysis {
  summary: {
    totalScore: number;
    meetsRequirements: boolean;
    riskLevel: 'low' | 'medium' | 'high';
    confidence: number;
  };
  financialAnalysis: {
    totalAssets: number;
    liquidAssets: number;
    seasoningDays: number;
    currency: string;
    stabilityScore: number;
  };
  complianceCheck: {
    passes: boolean;
    issues: string[];
    specificAdvice: string[];
  };
  accountBreakdown: Array<{
    institution: string;
    balance: number;
    seasoning: number;
    type: string;
    status: string;
    notes: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeline: string;
  }>;
  embassySpecific: {
    minimumFunds: number;
    seasoningRequirements: number;
    documentChecklist: string[];
    commonRejectionReasons: string[];
  };
}

export async function analyzeProofOfFunds(
  userProfile: any,
  financialData: any,
  familyMembers: number = 1
): Promise<POFAnalysis> {
  try {
    // ✅ FIXED: Use same model as working tools + add generationConfig
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",  // ← CHANGED FROM -exp
      generationConfig: {          // ← ADDED
        temperature: 0.7,
        maxOutputTokens: 2000
      }
    });

    const prompt = `
    Analyze Proof of Funds for visa application:

    APPLICANT PROFILE:
    - From: ${userProfile.nationality || 'Unknown'}
    - Destination: ${userProfile.destination_country}
    - Visa Type: ${userProfile.visa_type}
    - Family Members: ${familyMembers}

    FINANCIAL DATA:
    ${JSON.stringify(financialData, null, 2)}

    Provide comprehensive analysis including:
    1. Overall compliance score (0-10)
    2. Risk assessment
    3. Financial stability analysis
    4. Embassy requirement compliance
    5. Specific recommendations

    Return ONLY valid JSON matching this exact structure:
    {
      "summary": {
        "totalScore": 8,
        "meetsRequirements": true,
        "riskLevel": "low",
        "confidence": 85
      },
      "financialAnalysis": {
        "totalAssets": 25000,
        "liquidAssets": 20000,
        "seasoningDays": 90,
        "currency": "USD",
        "stabilityScore": 8
      },
      "complianceCheck": {
        "passes": true,
        "issues": [],
        "specificAdvice": ["Maintain current balance"]
      },
      "accountBreakdown": [],
      "recommendations": [],
      "embassySpecific": {
        "minimumFunds": 20000,
        "seasoningRequirements": 60,
        "documentChecklist": [],
        "commonRejectionReasons": []
      }
    }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text(); // ← CHANGED: removed await

    console.log('✅ POF Analysis response received');

    // Parse the JSON response
    const cleanedText = responseText.replace(/```json\n?|\n?```/g, '').trim();
    const analysis = JSON.parse(cleanedText);
    
    return analysis;

  } catch (error) {
    console.error('❌ POF Analysis error:', error);
    throw new Error('Financial analysis failed: ' + (error as Error).message);
  }
}
