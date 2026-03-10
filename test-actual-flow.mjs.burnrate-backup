import { GoogleGenerativeAI } from '@google/generative-api';

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const geminiServer = new GoogleGenerativeAI(apiKey);

async function callGeminiServer(prompt) {
  const model = geminiServer.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function testFlow() {
  try {
    const prompt = `ACT AS VISA OFFICER. Return ONLY JSON:
    {
      "score": 75,
      "summary": "test",
      "strengths": ["s1"],
      "weaknesses": ["w1"],
      "recommendations": ["r1"],
      "alternativeDestinations": []
    }`;
    
    const response = await callGeminiServer(prompt);
    const clean = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);
    
    console.log('✅ FLOW WORKS:', JSON.stringify(parsed, null, 2));
  } catch (err) {
    console.error('❌ FLOW ERROR:', err.message);
  }
}

testFlow();
