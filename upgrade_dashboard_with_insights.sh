#!/bin/bash

# Backup your current dashboard
cp src/app/dashboard/client.tsx src/app/dashboard/client.tsx.backup

# Add InsightsCard import and component
sed -i '/import { DocumentAIAnalysis } from/i\
import { InsightsCard } from "@/components/dashboard/insights-card";' src/app/dashboard/client.tsx

# Add InsightsCard after Apple Health rings (where we designed it)
sed -i '/{\/\* 🍎 APPLE HEALTH RINGS - Hero Component \*\/}/a\
\
      {/* 🔮 INSIGHTS CARD - AI Predictions based on real data */}\
      <InsightsCard \
        userId={user.id} \
        userProfile={userProfile} \
        className="w-full" \
      />' src/app/dashboard/client.tsx

echo "✅ Insights card added to dashboard!"
