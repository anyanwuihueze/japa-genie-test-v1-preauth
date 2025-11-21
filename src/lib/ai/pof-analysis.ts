// src/lib/ai/pof-analysis.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

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
    requirements: string[];
    specificAdvice: string[];
  };
  accountBreakdown: {
    institution: string;
    balance: number;
    seasoning: number;
    type: string;
    status: 'healthy' | 'warning' | 'critical';
    notes: string;
  }[];
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    timeline: string;
    impact: string;
  }[];
  embassySpecific: {
    minimumFunds: number;
    seasoningRequirements: number;
    documentChecklist: string[];
    commonRejectionReasons: string[];
  };
}

export async function analyzeProofOfFunds(
  userProfile: any,
  financialData: string,
  familyMembers: number
): Promise<POFAnalysis> {
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-exp"
  });

  const prompt = `
  CRITICAL: You are a VISA FINANCIAL COMPLIANCE OFFICER with 15 years experience. Analyze this proof of funds for embassy submission.

  === APPLICANT PROFILE ===
  Destination: ${userProfile.destination_country}
  Visa Type: ${userProfile.visa_type}
  Age: ${userProfile.age}
  Profession: ${userProfile.profession || 'Not specified'}
  Timeline: ${userProfile.timeline_urgency}
  Family Members: ${familyMembers}

  === FINANCIAL DATA ===
  ${financialData}

  === ANALYSIS REQUIREMENTS ===
  Provide EXPERT analysis on:

  1. FINANCIAL SUFFICIENCY:
     - Calculate minimum required funds for ${userProfile.visa_type} visa in ${userProfile.destination_country}
     - Account for ${familyMembers} family members
     - Consider living costs, tuition (if student), healthcare

  2. ACCOUNT SEASONING:
     - Analyze transaction history for stability
     - Flag sudden large deposits (last 3-6 months)
     - Assess account age and consistency

  3. EMBASSY-SPECIFIC COMPLIANCE:
     - ${userProfile.destination_country} embassy requirements for ${userProfile.visa_type}
     - Document formatting and verification needs
     - Common rejection reasons for this profile

  4. RISK ASSESSMENT:
     - Red flags in transaction patterns
     - Insufficient seasoning periods
     - Currency conversion issues
     - Documentation gaps

  5. ACTIONABLE RECOMMENDATIONS:
     - Immediate fixes (high priority)
     - Medium-term improvements
     - Documentation preparation

  Return as structured JSON matching this interface:
  {
    summary: { totalScore: number, meetsRequirements: boolean, riskLevel: string, confidence: number },
    financialAnalysis: { totalAssets: number, liquidAssets: number, seasoningDays: number, currency: string, stabilityScore: number },
    complianceCheck: { passes: boolean, issues: string[], requirements: string[], specificAdvice: string[] },
    accountBreakdown: Array<{ institution: string, balance: number, seasoning: number, type: string, status: string, notes: string }>,
    recommendations: Array<{ priority: string, action: string, timeline: string, impact: string }>,
    embassySpecific: { minimumFunds: number, seasoningRequirements: number, documentChecklist: string[], commonRejectionReasons: string[] }
  }

  Base analysis on ACTUAL embassy policies and financial compliance standards.
  Be brutally honest about risks and requirements.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    
    return analysis;
  } catch (error) {
    console.error('AI Analysis failed:', error);
    throw new Error('Financial analysis failed. Please try again.');
  }
}