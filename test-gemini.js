const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
console.log('Testing with key:', apiKey.substring(0, 15) + '...');

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

async function test() {
  try {
    console.log('Calling Gemini...');
    const result = await model.generateContent('Say "TEST SUCCESSFUL"');
    console.log('✅ RESULT:', result.response.text());
    return true;
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    if (error.message.includes('API key')) {
      console.error('API KEY ISSUE - Check if key is valid');
    }
    return false;
  }
}

test();
