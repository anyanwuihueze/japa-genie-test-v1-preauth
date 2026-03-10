const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI');

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = `Analyze visa for Canada Student visa. Return ONLY JSON with score, summary, strengths, weaknesses, recommendations`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log('✅ RESPONSE:', text.substring(0, 300));
  } catch (err) {
    console.error('❌ ERROR:', err.message);
  }
}

test();
