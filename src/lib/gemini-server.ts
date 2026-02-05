import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';

if (!apiKey) {
  console.warn('GEMINI_API_KEY is not set - server-side AI will not work');
}

export const geminiServer = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function callGeminiServer(prompt: string, jsonMode: boolean = true): Promise<string> {
  if (!geminiServer) {
    throw new Error('Gemini API not configured on server');
  }

  try {
    const model = geminiServer.getGenerativeModel({ 
      model: 'gemini-1.5-flash-latest',
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
      }
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const text = response.text();
    
    // Log for debugging (remove in production if needed)
    console.log('Gemini server response received, length:', text.length);
    
    return text;
    
  } catch (error: any) {
    console.error('Gemini Server API error:', error);
    throw error; // Let caller handle fallback
  }
}
