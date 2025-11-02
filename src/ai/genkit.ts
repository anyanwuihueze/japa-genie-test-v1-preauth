import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const aiInstance = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});

// Named exports for ALL your components (they're already using this!)
export const ai = aiInstance;
export const geminiFlash = 'gemini-2.0-flash-exp';

// Keep default export for any potential future use
export default aiInstance;
