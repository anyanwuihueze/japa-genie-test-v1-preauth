'use server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

export interface QuickEligibilityRequest {
  destination: string;
  visaType: string;
  background: string;
  currentSituation: string;
}

export interface QuickEligibilityResponse {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  alternativeDestinations: Array<{country: string; score: number; reason: string}>;
}

export async function analyzeQuickEligibility(request: QuickEligibilityRequest): Promise<QuickEligibilityResponse> {
  try {
    const prompt = `ACT AS A SENIOR VISA OFFICER with 15 years experience at ${request.destination} embassy.

APPLICANT PROFILE:
- Destination: ${request.destination}
- Visa Type: ${request.visaType}
- Background: ${request.background}
- Current Situation: ${request.currentSituation}

Analyze this visa application and return ONLY valid JSON:
{
  "score": number (0-100),
  "summary": string,
  "strengths": string[],
  "weaknesses": string[],
  "recommendations": string[],
  "alternativeDestinations": [{"country": string, "score": number, "reason": string}]
}

BE BRUTALLY HONEST but ENCOURAGING.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );
    
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanText);

    return {
      score: result.score ?? 75,
      summary: result.summary ?? `Analysis for ${request.destination}`,
      strengths: result.strengths ?? [],
      weaknesses: result.weaknesses ?? [],
      recommendations: result.recommendations ?? [],
      alternativeDestinations: result.alternativeDestinations ?? []
    };
    
  } catch (error: any) {
    console.error('Eligibility analysis error:', error);
    throw error;
  }
}