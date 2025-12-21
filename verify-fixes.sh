#!/bin/bash
echo "=== MOBILE PWA FIXES VERIFICATION ==="
echo "Timestamp: $(date)"
echo ""

# Check 1: Viewport meta
echo "1. VIEWPORT META CHECK:"
VIEWPORT_LINE=$(grep "viewport" src/app/layout.tsx)
if echo "$VIEWPORT_LINE" | grep -q "maximum-scale=1"; then
  echo "   ✅ CORRECT: Viewport has maximum-scale=1"
else
  echo "   ❌ WRONG: Viewport missing maximum-scale=1"
  echo "   Current: $VIEWPORT_LINE"
fi

# Check 2: CSS zoom removed
echo ""
echo "2. CSS ZOOM CHECK:"
if grep -q "zoom:" src/app/globals.css; then
  echo "   ⚠️  WARNING: CSS still contains 'zoom:' property"
  grep -n "zoom:" src/app/globals.css
else
  echo "   ✅ GOOD: No 'zoom:' properties in CSS"
fi

# Check 3: Server running
echo ""
echo "3. SERVER STATUS:"
if curl -s http://localhost:9003 > /dev/null 2>&1; then
  echo "   ✅ Server is responding on port 9003"
  echo "   Main app: http://localhost:9003"
  echo "   Debug page: http://localhost:9003/debug-mobile"
else
  echo "   ❌ Server not responding on port 9003"
fi

# Check 4: Package versions
echo ""
echo "4. PACKAGE VERSIONS:"
grep -E '"next"|"react"|"react-dom"' package.json | head -3

echo ""
echo "=== NEXT ACTIONS ==="
echo "If viewport shows 'maximum-scale=1':"
echo "1. The fix is applied correctly"
echo "2. Test on mobile: http://$(hostname -I | awk '{print $1}'):9003"
echo "3. Try pinch zoom - should NOT work"
echo ""
echo "If still magnified on mobile:"
echo "1. Clear mobile browser cache"
echo "2. Uninstall/reinstall PWA if installed"
echo "3. Test in incognito mode"
