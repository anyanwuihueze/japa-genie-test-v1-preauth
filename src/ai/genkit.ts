import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});

// ✅ CORRECT - Simple string model name (PROVEN TO WORK)
export const geminiFlash = 'gemini-2.0-flash-exp';
