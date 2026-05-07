'use server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';

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
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) }
  );
  const data = await res.json();
  if (data.error) throw new Error(`Gemini: ${data.error.message}`);
  const html = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  return { letterHTML: html.trim(), generatedAt: new Date().toISOString() };
}
