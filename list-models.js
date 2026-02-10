const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    
    console.log('=== AVAILABLE MODELS FOR YOUR KEY ===\n');
    
    if (data.models) {
      data.models.forEach(model => {
        console.log(`✅ ${model.name}`);
        console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      });
    } else {
      console.log('❌ No models found or API error');
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
