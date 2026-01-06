import Groq from 'groq-sdk';

function getGroqApiKey(): string {
  // PWA-safe: Use public variable first
  const key = 
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    process.env.GROQ_API_KEY ||
    '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';
  
  if (!key.includes('gsk_')) {
    console.error('⚠️ Invalid Groq API key format');
  }
  
  return key;
}

// Create and export the Groq instance
const groq = new Groq({ apiKey: getGroqApiKey() });

// EXPORT IT!
export { groq };
