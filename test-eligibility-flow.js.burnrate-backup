// Quick test of eligibility analysis
const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = 'AIzaSyDzwMoYHyv9JYbrYIMdP1S70JArTn5MjhI';
const genAI = new GoogleGenerativeAI(apiKey);

async function testEligibility() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Analyze this visa profile and return ONLY JSON:
    {
      "topWeaknesses": ["weakness 1", "weakness 2", "weakness 3"],
      "actionPlan": ["action 1", "action 2"],
      "countrySpecificTips": ["tip 1", "tip 2"],
      "readinessScore": 75
    }
    
    Country: Canada, Visa: Student, Has passport: yes, Bank balance: no`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('✅ RAW RESPONSE:', text.substring(0, 200));
    
    // Try to parse JSON
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(clean);
    
    console.log('\n✅ PARSED JSON:', JSON.stringify(parsed, null, 2));
    console.log('\n🎉 ELIGIBILITY FLOW WORKS!');
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
  }
}

testEligibility();
