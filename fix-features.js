const fs = require('fs');

const fixes = [
  { file: 'src/ai/flows/visa-chat-assistant.ts', feature: 'visa-chat' },
  { file: 'src/ai/flows/interview-flow.ts', feature: 'interview' },
  { file: 'src/ai/flows/rejection-reversal.ts', feature: 'rejection-reversal' },
  { file: 'src/ai/flows/site-assistant-flow.ts', feature: 'site-assistant' },
  { file: 'src/ai/flows/visa-matchmaker.ts', feature: 'visa-matchmaker' },
  { file: 'src/ai/insights-generator.ts', feature: 'insights' },
  { file: 'src/app/api/rejection-reversal/route.ts', feature: 'rejection-reversal-api' },
  { file: 'src/app/api/test-pof/route.ts', feature: 'proof-of-funds' },
  { file: 'src/lib/gemini-client.ts', feature: 'gemini' },
  { file: 'src/lib/gemini.ts', feature: 'gemini' },
  { file: 'src/lib/gemini-server.ts', feature: 'gemini-server' },
];

for (const { file, feature } of fixes) {
  const full = `/home/user/studio/${file}`;
  let c = fs.readFileSync(full, 'utf-8');
  c = c.replace(/\btrackGroq\('([^']+)',\s*\(\)\s*=>/g, `trackGroq('$1', () =>`);
  c = c.replace(/\btrackGoogle\('([^']+)',\s*\(\)\s*=>/g, `trackGoogle('$1', () =>`);
  c = c.replace(/\btrackAnthropic\('([^']+)',\s*\(\)\s*=>/g, `trackAnthropic('$1', () =>`);
  c = c.replace(/\), '(?!${feature})[^']*'\);/g, `), '${feature}');`);
  c = c.replace(/trackGroq\('([^']+)', \(\) => ([^;]+)\);(?!\s*')/g, `trackGroq('$1', () => $2, '${feature}');`);
  c = c.replace(/trackGoogle\('([^']+)', \(\) => ([^;]+)\);(?!\s*')/g, `trackGoogle('$1', () => $2, '${feature}');`);
  fs.writeFileSync(full, c);
  console.log(`✓ ${file} → ${feature}`);
}
