#!/bin/bash

echo "🔍 SMART AI FIX SCRIPT"
echo "======================"

# 1. BACKUP FIRST
BACKUP_DIR="./src-backup-$(date +%s)"
echo "📦 Creating backup: $BACKUP_DIR"
cp -r ./src "$BACKUP_DIR"

# 2. FIND ALL FILES WITH AI CODE
echo "🔎 Finding all AI-related files..."
AI_FILES=$(find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec grep -l "GoogleGenerativeAI\|getGenerativeModel" {} \; 2>/dev/null)

echo "📁 Found $(echo "$AI_FILES" | wc -l) AI files"

# 3. FIX API KEY IN ALL FILES
echo "🔑 Fixing API key variable..."
for file in $AI_FILES; do
    if [ -f "$file" ]; then
        # Update GEMINI_API_KEY to NEXT_PUBLIC_GEMINI_API_KEY
        sed -i 's/process\.env\.GEMINI_API_KEY/process.env.NEXT_PUBLIC_GEMINI_API_KEY/g' "$file"
        
        # Also fix any direct string references
        sed -i 's/GEMINI_API_KEY/NEXT_PUBLIC_GEMINI_API_KEY/g' "$file" 2>/dev/null
        
        echo "  ✅ Updated: $file"
    fi
done

# 4. FIX ALL MODEL NAMES
echo "🤖 Fixing model names..."
# Update all gemini-2.0 variants to gemini-2.5-flash
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '
    s/"gemini-2\.0-flash-exp"/"gemini-2.5-flash"/g
    s/"gemini-2\.0-flash-lite"/"gemini-2.5-flash"/g
    s/"gemini-2\.0-flash"/"gemini-2.5-flash"/g
    s/gemini-2\.0-flash-exp/gemini-2.5-flash/g
    s/gemini-2\.0-flash-lite/gemini-2.5-flash/g
    s/gemini-2\.0-flash/gemini-2.5-flash/g
' {} \;

# 5. REMOVE OLD MODEL COMMENTS
echo "🧹 Cleaning up old comments..."
find ./src -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '
    s/\/\/.*gemini-2\.0.*//g
    s/\/\*.*gemini-2\.0.*\*\///g
' {} \;

# 6. VERIFY CHANGES
echo "✅ Verification:"
echo "   - Files using NEXT_PUBLIC_GEMINI_API_KEY: $(grep -r "NEXT_PUBLIC_GEMINI_API_KEY" ./src --include="*.ts" --include="*.tsx" | wc -l)"
echo "   - Files using gemini-2.5-flash: $(grep -r "gemini-2\.5-flash" ./src --include="*.ts" --include="*.tsx" | wc -l)"
echo "   - Files STILL using gemini-2.0: $(grep -r "gemini-2\.0" ./src --include="*.ts" --include="*.tsx" | wc -l)"

echo ""
echo "🎯 SCRIPT COMPLETE!"
echo "Restart your server with: npm run dev"
