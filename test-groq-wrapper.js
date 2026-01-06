// Simulate what the wrapper does
const key = process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_GROQ_API_KEY || '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';
console.log('API Key available:', !!key);
console.log('Key length:', key.length);
console.log('Key starts with:', key.substring(0, 10) + '...');

// Try to require Groq
try {
  const Groq = require('groq-sdk');
  console.log('Groq SDK can be loaded');
  const groq = new Groq({ apiKey: key });
  console.log('Groq instance created');
} catch (e) {
  console.log('Groq error:', e.message);
}
