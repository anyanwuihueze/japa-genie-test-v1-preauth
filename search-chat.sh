#!/bin/bash
echo "🔍 SEARCHING FOR FRONTEND CHAT COMPONENTS"
echo "=========================================="

echo ""
echo "1. COMPONENT FILES:"
find src -name "*chat*" -type f | grep -v node_modules

echo ""
echo "2. CHAT CONTEXT/PROVIDER:"
grep -r "ChatProvider\|ChatContext" src --include="*.tsx" --include="*.ts" | grep -v node_modules

echo ""
echo "3. CHAT BUTTON/UI:"
grep -r "floating-chat-button\|chat-button" src --include="*.tsx" --include="*.ts" | grep -v node_modules

echo ""
echo "4. PAGES USING CHAT:"
grep -r "api/chat\|visaChatAssistant" src/app --include="*.tsx" --include="*.ts" | grep -v node_modules
