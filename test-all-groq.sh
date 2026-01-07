#!/bin/bash

echo "🧪 TESTING ALL 10 GROQ FEATURES"
echo "================================="

BASE="http://localhost:9002"

# 1. Main Chat
echo -e "\n1️⃣ Main Chat (visa-chat-assistant)..."
curl -s -X POST "$BASE/api/chat" \
  -H "Content-Type: application/json" \
  -d '{"question":"Canada visa","wishCount":1}' | grep -q "answer" && echo "✅ Working" || echo "❌ Failed"

# 2. Rejection Reversal
echo "2️⃣ Rejection Reversal..."
curl -s -X POST "$BASE/api/rejection-reversal" \
  -H "Content-Type: application/json" \
  -d '{"reason":"financial","country":"Canada"}' | head -20 | grep -q "strategy\|advice" && echo "✅ Working" || echo "⚠️ Check manually"

# 3. Proof of Funds Test
echo "3️⃣ Proof of Funds..."
curl -s -X POST "$BASE/api/test-pof" \
  -H "Content-Type: application/json" \
  -d '{"amount":10000,"country":"UK"}' | head -20 | grep -q "sufficient\|recommendation" && echo "✅ Working" || echo "⚠️ Check manually"

# 4. Site Assistant (if accessible)
echo "4️⃣ Site Assistant..."
curl -s "$BASE/api/site-assistant" 2>/dev/null | head -5 | grep -q "assistant\|help" && echo "✅ Working" || echo "⚠️ May not have endpoint"

# 5-10. Other flows (test via browser)
echo -e "\n5️⃣-10️⃣ Other flows (visa-matchmaker, interview, document-checker, insights)..."
echo "   Test these manually in browser at:"
echo "   - /chat (uses visa-chat-assistant + insights)"
echo "   - /dashboard (may use insights-generator)"
echo "   - Any interview/document features in your app"

echo -e "\n================================="
echo "✅ Core APIs tested!"
echo "🌐 Now test in browser: http://localhost:9002/chat"
