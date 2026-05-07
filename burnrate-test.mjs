import Groq from 'groq-sdk';
const SUPABASE_URL = 'https://thbpkpynvoueniovmdop.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRoYnBrcHludm91ZW5pb3ZtZG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MTI5MTAsImV4cCI6MjA4NzA4ODkxMH0.tIzHk1eWEd7NrF21jdP6FiwgwEp3EjGikcHC1xs9Lak';
const apiKey = 'br_live_a8fccc8f-13c4-453c-8d10-3ecc77e9fa45_1772718737561_4f8ba36b5b1f';
const match = apiKey.match(/br_live_([a-f0-9-]{36})/i);
const userId = match ? match[1] : '';
const groq = new Groq({ apiKey: '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' });
const res = await groq.chat.completions.create({ model: 'llama-3.3-70b-versatile', messages: [{ role: 'user', content: 'say hi' }] });
const inp = res.usage.prompt_tokens;
const out = res.usage.completion_tokens;
const r = await fetch(SUPABASE_URL + '/functions/v1/track-usage', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + SUPABASE_KEY },
  body: JSON.stringify({ metrics: [{ user_id: userId, provider: 'groq', model: 'llama-3.3-70b-versatile', tokens_input: inp, tokens_output: out, cost: 0.0001, timestamp: new Date().toISOString(), feature: 'visa-chat', metadata: { status: 'success' } }] })
});
const data = await r.json();
console.log('userId:', userId);
console.log('tokens:', inp, out);
console.log('supabase:', JSON.stringify(data));
