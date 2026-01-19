// components/dashboard/start-visa-journey-card.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Rocket, CheckCircle, Calendar, FileText, Target } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

interface StartVisaJourneyCardProps {
  userId: string;
  userProfile?: any;
  userProgressSummary?: any;
  onStartJourney: () => Promise<void>;
}

export function StartVisaJourneyCard({ userId, userProfile, userProgressSummary, onStartJourney }: StartVisaJourneyCardProps) {
  const [isStarting, setIsStarting] = useState(false);
  const supabase = createClient();

  // Only show if KYC completed but journey not started
  const shouldShow = userProfile?.kyc_completed === true && !userProgressSummary?.journey_started;

  if (!shouldShow) return null;

  const handleStartJourney = async () => {
    setIsStarting(true);
    try {
      await onStartJourney();
      
      // Create journey record
      await supabase.from('user_progress_summary').upsert({
        user_id: userId,
        journey_started: new Date().toISOString(),
        current_stage: 'planning',
        overall_progress: 25
      });

      // Refresh to show updated state
      window.location.reload();
    } catch (error) {
      console.error('Error starting journey:', error);
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
          You've completed the basics - now lock in your visa path
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
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
            {isStarting ? "Starting Journey..." : "Start Visa Journey"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}