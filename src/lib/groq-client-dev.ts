import Groq from 'groq-sdk';

// DEVELOPMENT ONLY - has fallback
const getDevApiKey = () => 
  process.env.NEXT_PUBLIC_GROQ_API_KEY ||
  process.env.GROQ_API_KEY ||
  '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';

export const groq = new Groq({ apiKey: getDevApiKey() });
