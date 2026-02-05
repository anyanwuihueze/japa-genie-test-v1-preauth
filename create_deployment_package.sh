#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PACKAGE="dashboard_reality_fix_${TIMESTAMP}.txt"

echo "🎯 DASHBOARD REALITY FIX PACKAGE - $(date)" > $PACKAGE
echo "============================================================" >> $PACKAGE
echo "" >> $PACKAGE

# Function to create file with clear markers
create_file() {
    local filepath=$1
    local description=$2
    local code=$3
    
    echo "" >> $PACKAGE
    echo "============================================================" >> $PACKAGE
    echo "📝 FILE: $filepath" >> $PACKAGE
    echo "🎯 DESCRIPTION: $description" >> $PACKAGE
    echo "⚠️  ACTION: Replace existing file" >> $PACKAGE
    echo "============================================================" >> $PACKAGE
    echo "" >> $PACKAGE
    echo "$code" >> $PACKAGE
    echo "" >> $PACKAGE
    echo "// --- FILE COMPLETE ---" >> $PACKAGE
}

# Example: Fixed Start Journey Card
create_file "src/components/dashboard/start-visa-journey-card.tsx" "REAL progress calculation instead of hardcoded 25%" '
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Rocket, CheckCircle, Calendar, FileText, Target } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

interface StartVisaJourneyCardProps {
  userId: string;
  userProfile?: any;
  userProgressSummary?: any;
  onStartJourney: () => Promise<void>;
}

export function StartVisaJourneyCard({ userId, userProfile, userProgressSummary, onStartJourney }: StartVisaJourneyCardProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [realProgress, setRealProgress] = useState(0);
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    setSupabase(createClient());
    calculateRealBaseline();
  }, [userId]);

  // Calculate REAL baseline progress instead of hardcoded 25%
  const calculateRealBaseline = async () => {
    if (!userId) return;
    
    try {
      const supabase = createClient();
      
      // Get actual user data
      const [
        { data: messages },
        { data: documents },
        { data: progress }
      ] = await Promise.all([
        supabase.from("messages").select("count").eq("user_id", userId).single(),
        supabase.from("user_documents").select("status").eq("user_id", userId),
        supabase.from("user_progress").select("progress_percentage").eq("user_id", userId).single()
      ]);

      // Calculate REAL baseline (copy confidence meter approach)
      let baselineProgress = 0;
      
      // Profile completion (30% max)
      if (userProfile?.country) baselineProgress += 10;
      if (userProfile?.destination_country) baselineProgress += 10;
      if (userProfile?.visa_type) baselineProgress += 10;

      // Chat engagement (20% max)
      const messageCount = messages?.count || 0;
      if (messageCount >= 5) baselineProgress += 20;
      else if (messageCount >= 1) baselineProgress += 10;

      // Document uploads (30% max)
      const approvedDocs = documents?.filter(d => d.status === "approved").length || 0;
      baselineProgress += Math.min(approvedDocs * 5, 30);

      // Existing progress (20% max)
      baselineProgress += Math.min(progress?.progress_percentage || 0, 20);

      setRealProgress(Math.round(baselineProgress));

    } catch (error) {
      console.error("Error calculating real baseline:", error);
      setRealProgress(15); // Conservative fallback
    }
  };

  // Only show if KYC completed but journey not started
  const shouldShow = userProfile?.kyc_completed === true && !userProgressSummary?.journey_started;

  if (!shouldShow) return null;

  const handleStartJourney = async () => {
    if (!supabase) return;
    
    setIsStarting(true);
    try {
      await onStartJourney();
      
      // Create journey record with REAL progress, not 25%
      await supabase.from("user_progress_summary").upsert({
        user_id: userId,
        journey_started: new Date().toISOString(),
        current_stage: "planning",
        overall_progress: realProgress // <-- REAL DATA HERE!
      });

      // Refresh to show updated state
      window.location.reload();
    } catch (error) {
      console.error("Error starting journey:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Card className="border-green-200 bg-green-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-green-600" />
          Ready to Start Your Visa Journey?
        </CardTitle>
        <CardDescription>
          Current progress: {realProgress}% - Lock in your visa path
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Progress indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-500" 
              style={{ width: `${realProgress}%` }}
            ></div>
          </div>

          {/* Completed Items */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Basic profile setup</span>
            </div>
            {userProfile?.country && userProfile?.destination_country && (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Country selection: {userProfile.country} → {userProfile.destination_country}</span>
              </div>
            )}
          </div>

          {/* What Unlocks */}
          <div className="bg-white p-3 rounded-lg border">
            <h4 className="font-medium text-sm mb-2">Starting your journey unlocks:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                <span>Proof of funds tracking (3 seasons)</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                <span>Document requirement seasons</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                <span>Application timeline with deadlines</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3" />
                <span>Season-based progress tracking</span>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <Button 
            onClick={handleStartJourney}
            disabled={isStarting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Rocket className="mr-2 h-4 w-4" />
            {isStarting ? "Starting Journey..." : `Start Journey (${realProgress}% Complete)`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
'

# Add more files as needed...

echo ""
echo "============================================================" >> $PACKAGE
echo "🧪 TESTING COMMANDS" >> $PACKAGE
echo "============================================================" >> $PACKAGE
echo "" >> $PACKAGE
echo "# After replacing files, run these commands:" >> $PACKAGE
echo "npx tsc --noEmit" >> $PACKAGE
echo "npm run dev" >> $PACKAGE
echo "" >> $PACKAGE
echo "# Check for errors in console, then test:" >> $PACKAGE
echo "1. Start journey button should show real progress %" >> $PACKAGE
echo "2. Timeline stages should update based on real actions" >> $PACKAGE
echo "3. Confidence meter should remain working" >> $PACKAGE

echo ""
echo "✅ Package created: $PACKAGE"
echo "📊 Size: $(wc -c < $PACKAGE) bytes"

