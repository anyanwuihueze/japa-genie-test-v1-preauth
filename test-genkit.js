const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
  const genAI = new GoogleGenerativeAI('AIzaSyALV2D_iVVD2jngcgFbeUFotK2FDGV1mek');
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  try {
    const result = await model.generateContent("Hello");
    console.log('✅ Gemini API works:', result.response.text());
  } catch (error) {
    console.error('❌ Gemini API error:', error.message);
  }
}

testGemini();
