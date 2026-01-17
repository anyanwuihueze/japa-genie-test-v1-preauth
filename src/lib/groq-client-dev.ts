import Groq from 'groq-sdk';

// DEVELOPMENT ONLY - requires env var
const getDevApiKey = () => {
  const key = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY || '';
  
  if (!key) {
    throw new Error('❌ GROQ_API_KEY not found. Add to .env.local');
  }
  
  return key;
};

export const groq = new Groq({ apiKey: getDevApiKey() });
