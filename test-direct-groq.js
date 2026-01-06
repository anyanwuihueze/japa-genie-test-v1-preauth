const Groq = require('groq-sdk');

const groq = new Groq({ 
  apiKey: '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' 
});

console.log('Testing Groq with your key...');

// Test all available models
const models = [
  'llama-3.3-70b-versatile',
  'llama-3.1-70b-versatile', 
  'llama-3.2-3b-preview',
  'mixtral-8x7b-32768',
  'gemma-7b-it'
];

models.forEach(model => {
  console.log(`\n=== Testing ${model} ===`);
  groq.chat.completions.create({
    messages: [{ role: 'user', content: 'Say "test successful" and nothing else' }],
    model: model,
    max_tokens: 10,
    temperature: 0.1
  }).then(res => {
    console.log(`✅ ${model}: ${res.choices[0].message.content}`);
  }).catch(err => {
    console.log(`❌ ${model}: ${err.message}`);
  });
});
