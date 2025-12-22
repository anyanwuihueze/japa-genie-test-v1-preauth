#!/bin/bash
echo "📊 CODE QUALITY AUDIT"
echo "====================="

# Find long functions
echo "1. Functions longer than 50 lines..."
find ./src -name "*.ts" -o -name "*.tsx" | xargs awk '
  /^[[:space:]]*(export[[:space:]]+)?(async[[:space:]]+)?function/ || /^[[:space:]]*(export[[:space:]]+)?const.*=.*\(/ {
    fn=$0; start=NR; in_fn=1; lines=0
  }
  in_fn { lines++ }
  /^[[:space:]]*}[[:space:]]*$/ && in_fn {
    if (lines > 50) print FILENAME ":" start " - Function: " fn " (" lines " lines)"
    in_fn=0
  }
'

# Find TODO/FIXME comments
echo "2. TODO/FIXME comments..."
grep -r "TODO\|FIXME\|HACK" ./src --include="*.ts" --include="*.tsx" | head -20

# Check TypeScript any usage
echo "3. TypeScript 'any' usage..."
grep -r ": any" ./src --include="*.ts" --include="*.tsx" | wc -l | xargs echo "  Found: $count 'any' types"
