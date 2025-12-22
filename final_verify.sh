#!/bin/bash
echo "🎯 FINAL VERIFICATION SCRIPT"
echo "============================"

# 1. Kill and restart server
echo "1. Restarting server..."
pkill -f "next" 2>/dev/null
sleep 2
npm run dev -- -p 9002 &
sleep 5

# 2. Test all endpoints
echo "2. Testing endpoints..."
test_endpoint() {
    local name=$1
    local url=$2
    local data=$3
    local expected=$4
    
    echo -n "  $name: "
    result=$(curl -s -X POST "$url" \
        -H "Content-Type: application/json" \
        -d "$data" \
        -w " %{http_code}")
    
    http_code=$(echo "$result" | awk '{print $NF}')
    response=$(echo "$result" | sed 's/ [0-9]*$//')
    
    if [ "$http_code" = "$expected" ]; then
        echo "✅ HTTP $http_code"
        if echo "$response" | grep -q "Temporary Service Issue"; then
            echo "   ⚠️  Returns fallback (might be OK for now)"
        fi
    else
        echo "❌ HTTP $http_code (expected $expected)"
        echo "   Response: $response"
    fi
}

test_endpoint "Main Chat" "http://localhost:9002/api/chat" '{"question":"Test"}' "200"
test_endpoint "Insights" "http://localhost:9002/api/insights" '{"question":"Test"}' "200"
test_endpoint "Interview" "http://localhost:9002/api/interview" '{"visaType":"tourist","destination":"USA","userBackground":"Test","previousQuestions":[]}' "200"
test_endpoint "Visitor Chat" "http://localhost:9002/api/visitor-chat" '{"message":"Hello"}' "200"

echo ""
echo "3. File status:"
echo "   - Double prefix files: $(grep -r "NEXT_PUBLIC_NEXT_PUBLIC" ./src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)"
echo "   - Old model references: $(grep -r "gemini-2\.0" ./src --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l)"
