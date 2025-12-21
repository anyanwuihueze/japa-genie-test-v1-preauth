#!/bin/bash
echo "Searching for CSS zoom/scale/transform properties..."
grep -n "zoom\|scale\|transform.*scale" src/app/globals.css | head -10
echo ""
echo "Checking components for zoom/scale..."
find src/components -name "*.tsx" -o -name "*.ts" | xargs grep -l "zoom\|scale\|transform" 2>/dev/null | head -5
