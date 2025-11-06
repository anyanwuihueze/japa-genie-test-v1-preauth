#!/bin/bash
PORT=9002
echo "🧪 Testing Visa Intent Detection on port $PORT..."
echo "=============================================="

echo "1. 🇩🇪 Germany Student Visa:"
curl -s -X POST http://localhost:$PORT/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to study computer science in Germany", "conversationHistory": []}' \
  | jq -r '.answer'

echo -e "\n2. 🇨🇦 Canada Work Visa:"
curl -s -X POST http://localhost:$PORT/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Looking for tech jobs in Canada", "conversationHistory": []}' \
  | jq -r '.answer'

echo -e "\n3. 🇦🇪 Dubai Tourist Visa:"
curl -s -X POST http://localhost:$PORT/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Planning vacation to Dubai", "conversationHistory": []}' \
  | jq -r '.answer'

echo -e "\n4. 📊 Detection Status:"
curl -s -X POST http://localhost:$PORT/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "I want to study computer science in Germany", "conversationHistory": []}' \
  | jq '{visaIntentDetected: .visaIntentDetected, isSignedIn: .isSignedIn}'
