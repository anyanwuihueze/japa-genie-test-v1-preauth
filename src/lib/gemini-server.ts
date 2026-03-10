import { GoogleGenerativeAI } from '@google/generative-ai';
import { BurnRateTracker } from '@/lib/burnrate-sdk';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set - server-side AI will not work');
}

export const geminiServer = apiKey ? new GoogleGenerativeAI(apiKey) : null;


const __burnrateTracker = new BurnRateTracker({ apiKey: process.env.BURNRATE_API_KEY || '' });

export async function callGeminiServer(prompt: string, jsonMode: boolean = true): Promise<string> {
  if (!geminiServer) {
    throw new Error('Gemini API not configured on server');
  }

  try {
    const model = geminiServer.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const result = await __burnrateTracker.trackGoogle('gemini-2.0-flash', () => model.generateContent(prompt));
    const response = await result.response;
    return response.text();
    
  } catch (error: any) {
    console.error('Gemini Server API error:', error);
    throw error;
  }
}
