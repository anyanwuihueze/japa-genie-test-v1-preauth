import Groq from 'groq-sdk';

function getGroqApiKey(): string {
  // PWA-safe: Use public variable first
  const key = 
    process.env.NEXT_PUBLIC_GROQ_API_KEY ||
    process.env.GROQ_API_KEY ||
    '';
  
  if (!key) {
    throw new Error('❌ GROQ_API_KEY not found in environment variables');
  }
  
  if (!key.includes('gsk_')) {
    console.error('⚠️ Invalid Groq API key format');
  }
  
  return key;
}

// Create and export the Groq instance
export const groq = new Groq({ apiKey: getGroqApiKey() });
