const fs = require('fs');
const content = fs.readFileSync('src/app/visa-matchmaker/page.tsx', 'utf8');

// Find the exact CTA section in your file and add mt-8 margin
const fixedContent = content.replace(
  '        {/* Hidden Matches Teaser */}\n        {!isPremium && hiddenMatchesCount > 0 && (\n          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center">',
  '        {/* Hidden Matches Teaser - MOVED TO BOTTOM */}\n        {!isPremium && hiddenMatchesCount > 0 && (\n          <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl p-8 text-white text-center mt-8">'
);

fs.writeFileSync('src/app/visa-matchmaker/page.tsx', fixedContent);
console.log('✅ EXACT FIX: Added mt-8 margin to move CTA to bottom');
