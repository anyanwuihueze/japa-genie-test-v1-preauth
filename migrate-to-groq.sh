[#!/bin/bash

echo "🚀 GEMINI → GROQ MIGRATION SCRIPT"
echo "================================"
echo ""

# Step 1: Install Groq SDK
echo "📦 Installing Groq SDK..."
npm install groq-sdk
echo "✅ Groq SDK installed"
echo ""

# Step 2: Backup all files
echo "📦 Creating backups..."
FILES=(
  "src/ai/flows/visa-chat-assistant.ts"
  "src/ai/flows/analyze-proof-of-funds.ts"
  "src/ai/flows/document-checker.ts"
  "src/ai/flows/site-assistant-flow.ts"
  "src/ai/flows/interview-flow.ts"
  "src/ai/flows/rejection-reversal.ts"
  "src/ai/flows/visa-matchmaker.ts"
  "src/ai/insights-generator.ts"
  "src/app/api/test-pof/route.ts"
  "src/app/api/analyze-pof/route.ts"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$file.gemini-backup"
    echo "✅ Backed up: $file"
  else
    echo "⚠️  File not found: $file"
  fi
done

echo ""
echo "✅ All backups created with .gemini-backup extension"
echo ""
echo "🔄 Ready to apply changes?"
echo "Press ENTER to continue or Ctrl+C to cancel..."
read

echo ""
echo "🔧 Applying Groq migration to all files..."
echo ""

# The actual file changes will be in the next script
# This is just the preparation

echo "✅ Migration prep complete!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. I'll provide the file conversion code"
echo "2. You apply it"
echo "3. We test with curl"
echo ""
echo "Ready for the conversion code? (y/n)"]
