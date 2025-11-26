import { genkit } from 'genkit';
import { googleAI, gemini20Flash } from '@genkit-ai/googleai';

const aiInstance = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY,
    }),
  ],
});

// Named exports - FIXED MODEL REFERENCE
export const ai = aiInstance;
export const geminiFlash = gemini20Flash; // ✅ Use the imported constant

// Keep default export for any potential future use
export default aiInstance;