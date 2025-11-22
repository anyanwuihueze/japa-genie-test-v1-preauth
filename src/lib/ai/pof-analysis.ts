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
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp" 
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

    Return as valid JSON matching the POFAnalysis interface.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    const analysis = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    return analysis;

  } catch (error) {
    console.error('POF Analysis error:', error);
    throw new Error('Financial analysis failed: ' + (error as Error).message);
  }
}
