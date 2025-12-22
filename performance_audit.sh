#!/bin/bash
echo "⚡ PERFORMANCE AUDIT"
echo "===================="

# Find large imports
echo "1. Large dependency imports..."
find ./src -name "*.ts" -o -name "*.tsx" | xargs grep -l "import.*from.*'@/" | while read file; do
  count=$(grep -c "import.*from" "$file")
  if [ "$count" -gt 10 ]; then
    echo "  📦 $file: $count imports"
  fi
done

# Find unoptimized images
echo "2. Image optimization check..."
find ./public -name "*.jpg" -o -name "*.png" | xargs -I {} sh -c '
  size=$(stat -f%z "{}" 2>/dev/null || stat -c%s "{}")
  if [ "$size" -gt 500000 ]; then
    echo "  🖼️  {}: $(($size/1000))KB"
  fi
'

# Check for missing alt tags
echo "3. Missing image alt tags..."
grep -r "<img" ./src --include="*.tsx" | grep -v "alt="
