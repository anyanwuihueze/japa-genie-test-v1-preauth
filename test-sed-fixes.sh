#!/bin/bash
echo "🧪 TESTING SED FIXES"
echo "==================="

# Backup original files
cp ./src/app/globals.css ./src/app/globals.css.test-backup
cp ./src/ai/insights-generator.ts ./src/ai/insights-generator.ts.test-backup

echo ""
echo "1. Original CSS line 3465 was:"
echo "   group-hover\\\\:scale-110:hover"
echo ""
echo "2. After sed, line 3465 is:"
sed -n '3465p' ./src/app/globals.css

echo ""
echo "3. Original import was:"
echo "   from './schemas/insight-schemas'"
echo ""
echo "4. After sed, import is:"
grep "from.*schemas" ./src/ai/insights-generator.ts

echo ""
echo "5. Testing TypeScript compilation:"
npx tsc --noEmit ./src/ai/insights-generator.ts 2>&1 | grep -i "error\|cannot find" || echo "✅ No TypeScript errors"

# Restore backups
cp ./src/app/globals.css.test-backup ./src/app/globals.css
cp ./src/ai/insights-generator.ts.test-backup ./src/ai/insights-generator.ts

echo ""
echo "✅ Test complete - original files restored"
