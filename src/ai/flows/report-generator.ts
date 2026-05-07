'use server';

const KIMI_API_KEY = process.env.KIMI_API_KEY || '';
const KIMI_BASE_URL = 'https://integrate.api.nvidia.com/v1';
const KIMI_MODEL = 'moonshotai/kimi-k2.5';

export async function generatePersonalizedReport(analysisResult: any, targetCountry: string, visaType: string) {
  const prompt = `You are a friendly visa consultant writing a personalized report for someone applying for a ${visaType} visa to ${targetCountry}.

Document analysis results:
${JSON.stringify(analysisResult, null, 2)}

Write a warm, encouraging letter (400-600 words, HTML tags: <h1><h2><p><strong><ul><li>) that:
1. Greets the reader
2. Summarises the analysed document
3. Explains each critical issue in plain language with step-by-step fixes
4. Lists warnings with practical recommendations
5. Celebrates passed checks
6. Ends with encouraging next steps

Return ONLY the HTML content (no markdown, no code blocks).`;

  const res = await fetch(
    `${KIMI_BASE_URL}/chat/completions`,
    { 
      method: 'POST', 
      headers: { 
        'Authorization': `Bearer ${KIMI_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ 
        model: KIMI_MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 4000,
        chat_template_kwargs: { thinking: false }
      }) 
    }
  );
  
  const data = await res.json();
  if (data.error) throw new Error(`Kimi: ${data.error.message}`);
  
  const html = data.choices?.[0]?.message?.content || '';
  return { letterHTML: html.trim(), generatedAt: new Date().toISOString() };
}
