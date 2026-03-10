const { GoogleGenerativeAI } = require('@google/generative-api');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const genAI = new GoogleGenerativeAI(apiKey);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent('Say "Working!"');
    const response = await result.response;
    console.log('✅ GEMINI WORKS:', response.text());
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

test();
