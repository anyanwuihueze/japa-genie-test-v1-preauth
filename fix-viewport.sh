#!/bin/bash

echo "=== APPLYING VIEWPORT FIX ==="

# Backup
cp src/app/layout.tsx src/app/layout.tsx.backup.$(date +%s)

# Fix the viewport line - three different ways to ensure it works
sed -i 's/maximum-scale=5/maximum-scale=1, user-scalable=no, viewport-fit=cover/g' src/app/layout.tsx

# If the above didn't work, try a more aggressive replacement
if grep -q "maximum-scale=5" src/app/layout.tsx; then
  echo "First attempt failed, trying alternative..."
  sed -i 's/<meta name="viewport"[^>]*>/<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" \/>/g' src/app/layout.tsx
fi

# Check result
echo "=== NEW VIEWPORT META ==="
grep "viewport" src/app/layout.tsx

echo ""
echo "=== CLEAR CACHE AND RESTART ==="
rm -rf .next
echo "Cache cleared. Starting dev server..."
npm run dev &
echo "Wait 3 seconds, then test at http://localhost:9003"
echo "Use Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)"
echo "Check that pinch-to-zoom is disabled"
