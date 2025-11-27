#!/bin/bash

# Add debug logging to see the actual flow
sed -i '/if (!mounted) return null;/a\
console.log("🔍 PROFILE CARD - Mounted with profile:", userProfile);\
console.log("🔍 PROFILE CARD - User ID:", userId);\
console.log("🔍 PROFILE CARD - Profile exists:", !!userProfile);\
if (userProfile) {\
  console.log("🔍 PROFILE CARD - Profile keys:", Object.keys(userProfile));\
  requiredFields.forEach(field => {\
    const value = userProfile[field.key];\
    console.log(`🔍 FIELD: ${field.key} =`, value, "Type:", typeof value, "Filled:", value && value.toString().trim() !== "");\
  });\
}' src/components/dashboard/enhanced-profile-card.tsx

echo "✅ Added detailed debug logging"
