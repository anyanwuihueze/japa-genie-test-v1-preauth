#!/bin/bash

# Fix the completion logic to handle NULL values properly
sed -i '/const filledFields = requiredFields.filter(field =>/,/).length;/c\
const filledFields = requiredFields.filter(field => {\
  const value = userProfile?.[field.key];\
  return value !== null && value !== undefined && value !== "" && value.toString().trim() !== "";\
}).length;' src/components/dashboard/enhanced-profile-card.tsx

echo "✅ Applied robust completion logic that handles NULL values"
