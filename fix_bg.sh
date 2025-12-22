#!/bin/bash
echo "=== SAFE BACKGROUND FIX ==="
echo ""
echo "Current background color:"
grep -n "--background:" src/app/globals.css
echo ""
echo "Will change: 98% → 100% (off-white → pure white)"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Create temp file with the change
  sed 's/--background: 210 40% 98%/--background: 210 40% 100%/g' src/app/globals.css > globals.temp.css
  # Replace original
  mv globals.temp.css src/app/globals.css
  echo "✅ Done! New background:"
  grep -n "--background:" src/app/globals.css
else
  echo "❌ Cancelled."
fi
