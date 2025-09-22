import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
});

export const geminiFlash = googleAI.model('gemini-1.5-flash-latest');
