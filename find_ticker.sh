#!/bin/bash
echo "Searching for ticker/marquee components..."
echo ""
echo "1. Components with 'news' or 'ticker' in name:"
find src -name "*ticker*" -o -name "*news*" -o -name "*marquee*" 2>/dev/null
echo ""
echo "2. Files containing ticker-related classes:"
grep -r "ticker\|marquee\|scroll.*horizontal" src --include="*.tsx" --include="*.ts" 2>/dev/null | head -15
