'use server';

const KIMI_API_KEY = process.env.KIMI_API_KEY || '';
const KIMI_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const KIMI_MODEL = 'moonshotai/kimi-k2.6';

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
{"score":number,"summary":"string","strengths":["string"],"weaknesses":["string"],"recommendations":["string"],"alternativeDestinations":[{"country":"string","score":number,"reason":"string"}]}

BE BRUTALLY HONEST but ENCOURAGING.`;

    const response = await fetch(`${KIMI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KIMI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: KIMI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 2000,
        chat_template_kwargs: { thinking: false },
      }),
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    const text = data.choices?.[0]?.message?.content || '';
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result = JSON.parse(cleanText);

    return {
      score: result.score ?? 75,
      summary: result.summary ?? `Analysis for ${request.destination}`,
      strengths: result.strengths ?? [],
      weaknesses: result.weaknesses ?? [],
      recommendations: result.recommendations ?? [],
      alternativeDestinations: result.alternativeDestinations ?? [],
    };
  } catch (error: any) {
    console.error('Eligibility analysis error:', error);
    throw error;
  }
}
