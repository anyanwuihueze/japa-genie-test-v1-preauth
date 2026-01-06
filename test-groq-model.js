const { groq } = require('./src/lib/groq-client');

async function test() {
  console.log('Testing Groq with llama-3.3-70b-versatile...');
  try {
    const response = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Say hello in one word' }],
      model: 'llama-3.3-70b-versatile',
      max_tokens: 10
    });
    console.log('✅ SUCCESS! Response:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.log('❌ ERROR:', error.message);
    console.log('Full error:', error);
    return false;
  }
}

test();
