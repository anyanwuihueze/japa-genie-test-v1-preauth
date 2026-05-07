#!/bin/bash

echo "🧪 AI COMPONENT VALIDATION"
echo "=========================="

# Test 1: Server running
echo "1️⃣  Server Health..."
curl -s http://localhost:9002/api/test > /dev/null && echo "✅ Server OK" || echo "❌ Server down"

# Test 2: Kimi (Visa Cost)
echo "2️⃣  Kimi API..."
curl -s -X POST http://localhost:9002/api/cost-calculator \
  -H "Content-Type: application/json" \
  -d '{"originCountry":"Nigeria","destinationCountry":"Germany","visaType":"student","dependents":0}' | \
  grep -q "totalCost" && echo "✅ Kimi OK" || echo "❌ Kimi failed"

# Test 3: Groq Key
echo "3️⃣  Groq API Key..."
GROQ_KEY=$(grep GROQ_API_KEY ~/studio/.env.local | cut -d= -f2)
curl -s -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer ${GROQ_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama-3.1-8b-instant","messages":[{"role":"user","content":"hi"}]}' | \
  grep -q "choices" && echo "✅ Groq OK" || echo "❌ Groq key invalid"

# Test 4: Gemini Key
echo "4️⃣  Gemini API Key..."
GEMINI_KEY=$(grep GEMINI_API_KEY ~/studio/.env.local | cut -d= -f2)
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"OK"}]}]}' | \
  grep -q "candidates" && echo "✅ Gemini OK" || echo "❌ Gemini key invalid"

# Test 5: Document Checker
echo "5️⃣  Document Checker..."
TEST_IMG="iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGP4DwAAAQEABRjYTgAAAABJRU5ErkJggg=="
curl -s -X POST http://localhost:9002/api/document-check \
  -H "Content-Type: application/json" \
  -d "{\"documentDataUri\":\"data:image/png;base64,${TEST_IMG}\",\"targetCountry\":\"Canada\",\"visaType\":\"student\"}" | \
  grep -q "documentType" && echo "✅ Doc Checker OK" || echo "❌ Doc Checker failed"

echo ""
echo "=========================="
echo "If all ✅, push to git:"
echo "git add -A && git commit -m 'AI migration complete' && git push origin main"
