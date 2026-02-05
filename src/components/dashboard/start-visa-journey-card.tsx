'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Map, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface StartVisaJourneyCardProps {
  userProfile?: any;
  userProgress?: any;
  documentsCount?: number;
  className?: string;
  onStartJourney?: () => Promise<void>;
}

export function StartVisaJourneyCard({ className, onStartJourney }: StartVisaJourneyCardProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData();

  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-10 bg-gray-200 rounded w-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading journey data
        </CardContent>
      </Card>
    );
  }

  // Calculate progress - NO DUPLICATE FETCH, uses shared data
  const realProgress = calculateRealBaseline(dashboardData);

  // If journey already started, show progress
  if (dashboardData.userProgress?.journey_started) {
    return (
      <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <Map className="w-5 h-5" />
            Your Visa Journey Progress
          </CardTitle>
          <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
            Track your progress to {dashboardData.userProfile?.destination_country || 'your destination'}
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
          <div className="space-y-4">
            <Progress value={realProgress.progressPercentage} className="w-full h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{realProgress.progressPercentage}% Complete</span>
              <span>{realProgress.estimatedTimeline}</span>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Journey Locked In</p>
                  <p className="text-blue-700 text-sm">
                    You've unlocked all features for your visa path
                  </p>
                </div>
              </div>
            </div>

            <Button asChild className="w-full">
              <a href="/progress">View Full Journey</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If profile incomplete, show completion prompt
  if (!dashboardData.userProfile?.country || !dashboardData.userProfile?.destination_country || !dashboardData.userProfile?.visa_type) {
    return (
      <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Ready to Start Your Visa Journey?
          </CardTitle>
          <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
            Lock in your personalized visa path
          </CardDescription>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Profile Incomplete</p>
                  <p className="text-yellow-700 text-sm">
                    Complete your profile to unlock the full visa journey
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Profile Complete</span>
                <span className="font-medium">{dashboardData.userProfile?.country ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Destination Set</span>
                <span className="font-medium">{dashboardData.userProfile?.destination_country ? '✓' : '✗'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Visa Type Selected</span>
                <span className="font-medium">{dashboardData.userProfile?.visa_type ? '✓' : '✗'}</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <a href="/kyc-profile">Complete Profile First</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show start journey prompt
  const benefits = [
    'Proof of funds tracking (3 seasons)',
    'Document requirement seasons',
    'Application timeline with deadlines',
    'Season-based progress tracking'
  ];

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} border-2 border-blue-200`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} bg-gradient-to-r from-blue-50 to-purple-50`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <Target className="w-5 h-5 text-blue-600" />
          Ready to Start Your Visa Journey?
        </CardTitle>
        <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>
          {realProgress.progressPercentage}% complete - Lock in your visa path to {dashboardData.userProfile?.destination_country}
        </CardDescription>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-900">Profile Complete!</p>
                <p className="text-blue-700 text-sm">
                  Starting your journey unlocks:
                </p>
              </div>
            </div>
          </div>

          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                {benefit}
              </li>
            ))}
          </ul>

          <Button 
            onClick={onStartJourney} 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            size={isMobile ? "lg" : "default"}
          >
            Start My Visa Journey
          </Button>

          <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-center text-muted-foreground`}>
            This will lock in your path and enable all tracking features
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function calculateRealBaseline(dashboardData: any) {
  const userProgress = dashboardData.userProgress || {};
  const userProfile = dashboardData.userProfile || {};
  const messageCount = dashboardData.messageCount || 0;
  const documentCount = dashboardData.documentCount || 0;

  let progressPercentage = userProgress.progress_percentage || 0;
  let nextMilestone = userProgress.next_milestone || "Complete Your Profile";
  let currentStage = userProgress.current_stage || "Onboarding";

  // Build comprehensive progress from all available data
  if (userProfile?.country && userProfile?.destination_country && userProfile?.visa_type) {
    progressPercentage += 30;
    nextMilestone = "Upload Documents";
    currentStage = "Document Preparation";
  }

  if (messageCount > 0) {
    progressPercentage += 20;
    if (progressPercentage >= 30) nextMilestone = "Complete Document Upload";
  }

  if (documentCount > 0) {
    progressPercentage += Math.min(documentCount * 5, 30);
    if (progressPercentage >= 50) {
      nextMilestone = "Schedule Interview Practice";
      currentStage = "Interview Preparation";
    }
  }

  progressPercentage = Math.min(progressPercentage, 100);

  const moneySaved = Math.round(progressPercentage * 24000);
  const aheadOfPercentage = Math.floor(progressPercentage * 0.8);
  const successProbability = Math.min(65 + Math.floor(progressPercentage / 2), 95);
  const estimatedTimeline = progressPercentage > 50 ? "4-5 months" : "6-8 months";
  const daysToDeadline = Math.max(30 - Math.floor(progressPercentage / 3), 7);
  const journey_started = userProgress.journey_started || null;

  return {
    progressPercentage,
    nextMilestone,
    daysToDeadline,
    moneySaved,
    aheadOfPercentage,
    successProbability,
    estimatedTimeline,
    currentStage,
    journey_started
  };
}
