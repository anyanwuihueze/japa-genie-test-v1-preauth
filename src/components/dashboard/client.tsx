'use client';

import { EnhancedProfileCard } from '@/components/dashboard/enhanced-profile-card';
import { ConfidenceMeter } from '@/components/dashboard/confidence-meter';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { ActionItemsWidgetFixed } from '@/components/dashboard/action-items-widget-fixed';
import { NextBestAction } from '@/components/dashboard/next-best-action';
import { ApplicationTimeline } from '@/components/dashboard/application-timeline';
import { StartVisaJourneyCard } from '@/components/dashboard/start-visa-journey-card';
import { VisaAssistantCard } from '@/components/dashboard/visa-assistant-card';
import { DocumentCheckerCard } from '@/components/dashboard/document-checker-card';
import { POFSeasoningTracker } from '@/components/dashboard/pof-seasoning-tracker';
import { InsightsCard } from "@/components/dashboard/insights-card";
import { DocumentAIAnalysis } from '@/components/dashboard/document-ai-analysis';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageCircleQuestion, Map, Users, Shield, ArrowRight, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { createClient } from '@/lib/supabase/client';

// ✅ Tool cards - ONLY WORKING TOOLS (3 total)
const features = [
  {
    icon: MessageCircleQuestion,
    title: 'AI Mock Interview',
    description: 'Practice with realistic questions. Upgrade to human expert feedback for personalized coaching.',
    href: '/interview',
    cta: 'Start Practicing',
    expert: true,
    expertText: 'Get human feedback',
    highlight: false
  },
  {
    icon: Map,
    title: 'Visa Journey Tracker',
    description: 'See your detailed timeline. Connect with experts if you get stuck at any step.',
    href: '/progress',
    cta: 'View Journey',
    expert: false,
    highlight: false
  },
  {
    icon: Users,
    title: 'Human Expert Help',
    description: 'Stuck? Get 1-on-1 guidance from verified visa consultants with proven success records.',
    href: '/experts',
    cta: 'Find Experts',
    expert: true,
    highlight: true
  },
];

export default function DashboardClientFinal({ user }: { user: any }) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData();

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (dashboardData.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
          <p>Error loading dashboard: {dashboardData.error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isMobile ? 'p-4' : ''}`}>
      {/* Header - Responsive */}
      <header className="space-y-2">
        <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight`}>
          {dashboardData.userProfile?.destination_country 
            ? `Your Visa Journey to ${dashboardData.userProfile.destination_country}`
            : `Welcome back, ${user?.email?.split('@')[0] || 'Traveler'}! 👋`
          }
        </h1>
        <p className={`${isMobile ? 'text-base' : 'text-lg'} text-muted-foreground`}>
          Your personalized AI guide to visa success. Here's your journey at a glance.
        </p>
      </header>

      {/* 🍎 APPLE HEALTH RINGS - Hero Component */}
      <QuickStats />

      {/* 🔮 INSIGHTS CARD - AI Predictions based on real data */}
      <InsightsCard />

      {/* NEW: ACTION ITEMS WIDGET - Real-time task extraction */}
      <ActionItemsWidgetFixed userId={dashboardData.userId} />

      {/* 🎯 SMART TOOLS GRID - Apple-style layout */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'} gap-6`}>
        <VisaAssistantCard userId={dashboardData.userId} />
        <NextBestAction />
      </div>

      {/* 🌍 POF SEASONING TRACKER - Progressive unlocking */}
      <POFSeasoningTracker userId={dashboardData.userId} />

      {/* 📄 DOCUMENT AI ANALYSIS - Intelligent compliance */}
      <DocumentAIAnalysis userId={dashboardData.userId} />

      {/* CONFIDENCE METER & APPLICATION TIMELINE */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'} gap-6`}>
        <ConfidenceMeter />
        <ApplicationTimeline />
      </div>

      {/* JOURNEY LOCK-IN & DOCUMENT CHECKER */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'} gap-6`}>
        <StartVisaJourneyCard 
          onStartJourney={async () => {
            const supabase = createClient();
            await supabase.from('user_progress_summary').upsert({
              user_id: dashboardData.userId,
              journey_started: new Date().toISOString(),
              current_stage: 'planning',
              overall_progress: dashboardData.progressPercentage
            });
          }}
        />
        <DocumentCheckerCard />
      </div>

      {/* PROFILE CARD */}
      <EnhancedProfileCard 
        onProfileUpdate={() => window.location.reload()} 
      />

      {/* ENHANCED FEATURES GRID - Simplified */}
      <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-2'} gap-6`}>
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className={`flex flex-col group hover:border-primary transition-all ${
              feature.highlight ? 'border-2 border-orange-300 bg-orange-50' : ''
            }`}
          >
            <CardHeader className="flex-1">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full transition-colors ${
                  feature.highlight 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className='flex-1'>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className={`${isMobile ? 'text-base' : 'text-xl'}`}>{feature.title}</CardTitle>
                    {feature.expert && (
                      <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'} bg-blue-50`}>
                        <Shield className="w-3 h-3 mr-1" />
                        Expert Available
                      </Badge>
                    )}
                  </div>
                  <CardDescription className={`${isMobile ? 'text-sm' : 'text-base'}`}>{feature.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <div className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
              <Button asChild className={`w-full transition-colors ${
                feature.highlight 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'group-hover:bg-amber-400'
              }`}>
                <Link href={feature.href} className="flex items-center justify-center gap-2">
                  {feature.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
