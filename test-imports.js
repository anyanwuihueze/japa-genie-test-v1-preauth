console.log("=== TESTING IMPORTS ===");

try {
  console.log("1. Testing Groq import...");
  const Groq = require('groq-sdk');
  console.log("✅ Groq can be imported");
} catch (e) {
  console.log("❌ Groq import failed:", e.message);
}

try {
  console.log("2. Testing Gemini import...");
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  console.log("✅ Gemini can be imported");
} catch (e) {
  console.log("❌ Gemini import failed:", e.message);
}

console.log("3. Environment check:");
console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
console.log("NEXT_PUBLIC_GEMINI_API_KEY exists:", !!process.env.NEXT_PUBLIC_GEMINI_API_KEY);
