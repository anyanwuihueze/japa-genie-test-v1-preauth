import Groq from 'groq-sdk';

// PRODUCTION - requires environment variable
const getProdApiKey = () => {
  const key = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!key) throw new Error('GROQ_API_KEY environment variable required');
  return key;
};

export const groq = new Groq({ apiKey: getProdApiKey() });
