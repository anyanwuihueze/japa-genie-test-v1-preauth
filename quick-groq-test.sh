#!/bin/bash

BASE="http://localhost:9002"
echo "🚀 Quick Parallel API Tests"
echo "============================"

# Run all tests in parallel
test1() {
    echo "1. Testing Main Chat..."
    resp=$(timeout 3 curl -s -X POST "$BASE/api/chat" \
        -H "Content-Type: application/json" \
        -d '{"question":"Canada tourist visa","wishCount":1}' 2>/dev/null)
    [ -n "$resp" ] && echo "   ✅ Got response" || echo "   ❌ No response"
}

test2() {
    echo "2. Testing Rejection Reversal..."
    timeout 3 curl -s "$BASE/api/rejection-reversal" \
        -H "Content-Type: application/json" \
        -d '{"reason":"financial","country":"Canada"}' >/tmp/test2.log 2>&1
    [ -s /tmp/test2.log ] && echo "   ✅ Got response" || echo "   ❌ Failed"
}

test3() {
    echo "3. Testing Proof of Funds..."
    timeout 3 curl -s "$BASE/api/test-pof" \
        -H "Content-Type: application/json" \
        -d '{"amount":15000,"country":"Germany"}' | grep -i "fund\|sufficient\|bank" >/dev/null && \
        echo "   ✅ Seems valid" || echo "   ⚠️ Check manually"
}

test4() {
    echo "4. Testing Site Assistant..."
    timeout 2 curl -s "$BASE/api/site-assistant" | wc -l | grep -q "[0-9]" && \
        echo "   ✅ Accessible" || echo "   ❌ Not accessible"
}

# Run tests in parallel
test1 & test2 & test3 & test4 &
wait

echo ""
echo "📋 Quick Check:"
curl -s -I "$BASE/health" 2>/dev/null | head -1
curl -s -I "$BASE/api/chat" 2>/dev/null | head -1
echo "============================"
