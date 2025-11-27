#!/bin/bash

echo "=== 🩺 ENHANCED PROFILE CARD DIAGNOSTIC TOOL ==="
echo ""

echo "1. 🔍 CHECKING COMPLETION LOGIC (Lines around filledFields)"
echo "------------------------------------------------------------"
grep -n -A 5 -B 5 "const filledFields" src/components/dashboard/enhanced-profile-card.tsx
echo ""

echo "2. 🗂️ CHECKING REQUIRED FIELDS DEFINITION"
echo "-----------------------------------------"
grep -n -A 10 "const requiredFields" src/components/dashboard/enhanced-profile-card.tsx
echo ""

echo "3. 📊 CHECKING DASHBOARD REDIRECT LOGIC"
echo "---------------------------------------"
grep -n -A 3 -B 3 "if (!profile?.country)" src/app/dashboard/page.tsx
echo ""

echo "4. 🐛 CHECKING FOR COMMON BUG PATTERNS"
echo "--------------------------------------"
echo "a) Checking for incorrect field mappings:"
grep -E "(key: ['\\\"](country|destination|age|visa_type|user_type|timeline_urgency)['\\\"])" src/components/dashboard/enhanced-profile-card.tsx
echo ""

echo "b) Checking completion threshold:"
grep -n -A 2 -B 2 "completion < 50" src/components/dashboard/enhanced-profile-card.tsx
echo ""

echo "5. 📝 CHECKING BROWSER CONSOLE OUTPUT"
echo "-------------------------------------"
echo "Please also check your browser console (F12) for these debug logs:"
echo "   '🚨 URGENT DEBUG - userProfile OBJECT:'"
echo "   '🚨 URGENT DEBUG - userProfile KEYS:'" 
echo "   '🎯 COMPLETION DEBUG - Filled:'"
echo ""

echo "=== ✅ DIAGNOSTIC COMPLETE ==="
echo "Check the output above for mismatches between expected and actual field names, and incorrect completion logic."
