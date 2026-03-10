import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set');
}

export const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function callGemini(prompt: string, jsonMode: boolean = true): Promise<string> {
  if (!gemini) {
    throw new Error('Gemini API not configured');
  }

  try {
    const model = gemini.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
    
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return JSON.stringify({
      minimumFunds: 20000,
      seasoningDays: 90,
      currency: 'USD',
      requirementsText: 'Standard requirements. Check official embassy website.'
    });
  }
}
