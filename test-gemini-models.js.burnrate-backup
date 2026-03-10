const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const genAI = new GoogleGenerativeAI(apiKey);

const models = [
  'gemini-2.0-flash-exp',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-pro'
];

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say OK');
    const response = await result.response;
    console.log(`✅ ${modelName}: ${response.text().substring(0, 50)}`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName}: ${error.message}`);
    return false;
  }
}

async function findWorkingModel() {
  console.log('Testing Gemini models...\n');
  for (const model of models) {
    const works = await testModel(model);
    if (works) {
      console.log(`\n🎯 USE THIS MODEL: "${model}"`);
      break;
    }
  }
}

findWorkingModel();
