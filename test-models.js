const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const genAI = new GoogleGenerativeAI(apiKey);

const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-1.5-pro-latest',
  'gemini-pro',
  'gemini-1.0-pro',
  'gemini-1.0-pro-latest'
];

async function testModel(modelName) {
  try {
    console.log(\`Testing \${modelName}...\`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say "Hello"');
    console.log(\`✅ \${modelName}: \${result.response.text().substring(0, 50)}...\`);
    return modelName;
  } catch (error) {
    console.log(\`❌ \${modelName}: \${error.message.split('\\n')[0]}\`);
    return null;
  }
}

async function findWorkingModel() {
  console.log('Testing available models...');
  for (const modelName of modelsToTest) {
    const working = await testModel(modelName);
    if (working) {
      console.log(\`\\n🎯 USE THIS MODEL: \${working}\`);
      return working;
    }
  }
  console.log('\\n❌ No working models found. Check API key or quota.');
}

findWorkingModel();
