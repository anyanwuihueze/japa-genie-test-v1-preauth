#!/bin/bash

echo "🔍 TESTING CALLBACK ENDPOINT"
echo ""

# Test if callback route is accessible
echo "Testing: https://japa-genie-test-v1-preauth.vercel.app/auth/callback"

curl -I https://japa-genie-test-v1-preauth.vercel.app/auth/callback 2>&1 | head -5

echo ""
echo "📊 Expected: Should redirect (301/302) to home or show 400 (missing code)"
echo "❌ Bad: 404 Not Found = Route not deployed"
echo "❌ Bad: 500 Internal Error = Runtime error in callback"
