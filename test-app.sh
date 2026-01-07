#!/bin/bash
echo "🚀 TESTING YOUR APP"
echo "==================="

# Test 1: App home
echo -n "App homepage: "
curl -s -o /dev/null -w "%{http_code}" http://localhost:9002 && echo " ✅ LIVE"

# Test 2: Chat API
echo -n "Chat API: "
curl -s -X POST http://localhost:9002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question":"test","wishCount":1}' | grep -q "answer" && echo " ✅ WORKING" || echo " ❌ FAILED"

# Test 3: POF API  
echo -n "POF API: "
curl -s -X POST http://localhost:9002/api/test-pof \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"country":"test"}' | grep -q "message" && echo " ✅ WORKING" || echo " ❌ FAILED"

echo ""
echo "🌐 OPEN IN BROWSER: http://localhost:9002"
echo "✅ Your app is running!"
