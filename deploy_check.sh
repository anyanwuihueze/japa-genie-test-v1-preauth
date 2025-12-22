#!/bin/bash
echo "🚀 DEPLOYMENT READINESS CHECK"
echo "============================="

# Check for broken imports
echo "1. Checking TypeScript compilation..."
npx tsc --noEmit 2>&1 | grep -E "error|Error" | head -10

# Check build
echo "2. Testing build..."
npm run build 2>&1 | tail -20

# Check environment variables
echo "3. Environment variables..."
required_vars="NEXT_PUBLIC_GEMINI_API_KEY NEXT_PUBLIC_SUPABASE_URL NEXT_PUBLIC_SUPABASE_ANON_KEY"
for var in $required_vars; do
  if grep -q "$var=" .env.local; then
    echo "  ✅ $var: Found"
  else
    echo "  ❌ $var: MISSING"
  fi
done

# Check API endpoints
echo "4. API endpoint health..."
curl -s http://localhost:3000/api/chat -o /dev/null -w "  Main Chat: %{http_code}\n"
curl -s http://localhost:3000/api/insights -o /dev/null -w "  Insights: %{http_code}\n"
