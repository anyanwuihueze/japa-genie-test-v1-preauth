#!/bin/bash

OUTPUT="project-audit.txt"

{
echo "=== JAPA GENIE PROJECT AUDIT ==="
echo "Generated: $(date)"
echo ""

echo "=== 1. ALL PAGES ==="
find src/app -name "page.tsx" 2>/dev/null | while read f; do
  echo "--- $f ---"
  cat "$f"
  echo ""
done

echo "=== 2. ALL API ROUTES ==="
find src/app/api -name "route.ts" 2>/dev/null | while read f; do
  echo "--- $f ---"
  cat "$f"
  echo ""
done

echo "=== 3. CONTEXTS ==="
echo "--- AuthContext ---"
cat src/lib/AuthContext.tsx 2>/dev/null || echo "Not found"
echo "--- ChatContext ---"
cat src/context/ChatContext.tsx 2>/dev/null || echo "Not found"

echo "=== 4. LAYOUTS ==="
cat src/app/layout.tsx 2>/dev/null
echo "--- AppShell ---"
cat src/components/pwa/AppShell.tsx 2>/dev/null || echo "Not found"

echo "=== 5. SUPABASE ==="
cat src/lib/supabase.ts 2>/dev/null || echo "Not found"

echo "=== 6. PACKAGE.JSON ==="
cat package.json

echo "=== 7. AI FLOWS ==="
find src/ai -type f 2>/dev/null | while read f; do
  echo "--- $f ---"
  cat "$f"
  echo ""
done

} > "$OUTPUT"

echo "Created: $OUTPUT"

