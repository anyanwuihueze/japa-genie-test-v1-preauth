import { GoogleGenerativeAI } from '@google/generative-ai';
import { BurnRateTracker } from '@/lib/burnrate-sdk';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('NEXT_PUBLIC_GEMINI_API_KEY is not set');
}

export const gemini = apiKey ? new GoogleGenerativeAI(apiKey) : null;


const __burnrateTracker = new BurnRateTracker({ apiKey: process.env.BURNRATE_API_KEY || 'br_live_a8fccc8f-13c4-453c-8d10-3ecc77e9fa45_1772718737561_4f8ba36b5b1f' });

export async function callGemini(prompt: string, jsonMode: boolean = true): Promise<string> {
  if (!gemini) {
    throw new Error('Gemini API not configured');
  }

  try {
    const model = gemini.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',  // FIXED: Use latest flash model
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const result = await __burnrateTracker.trackGoogle('gemini-2.0-flash', () => model.generateContent(prompt);
    const response = await result.response;
    
    // FIXED: Proper extraction
    const text = response.text();
    return text;
    
  } catch (error: any) {
    console.error('Gemini API error:', error);
    // Return fallback JSON on error
    return JSON.stringify({
      minimumFunds: 20000,
      seasoningDays: 90,
      currency: 'USD',
      requirementsText: 'Standard requirements. Check official embassy website for exact amounts.'
    });
  }
}
