'use client';

import { VisaSuccessScore } from '@/components/dashboard/VisaSuccessScore';
import { RejectionRiskInsights } from '@/components/dashboard/RejectionRiskInsights';
import { POFSeasoningTracker } from '@/components/dashboard/pof-seasoning-tracker';
import { DocumentCheckerCard } from '@/components/dashboard/document-checker-card';
import { SmartNextAction } from '@/components/dashboard/SmartNextAction';
import { ConfidenceMeter } from '@/components/dashboard/confidence-meter';
import { CollapsibleCard } from '@/components/dashboard/CollapsibleCard';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardClientProps {
  user: any;
  userProfile?: any;
}

interface UserProgress {
  progressPercentage: number;
  documentsCompleted: number;
  totalDocuments: number;
}

export default function DashboardClientSimplified({ user, userProfile }: DashboardClientProps) {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    progressPercentage: 0,
    documentsCompleted: 0,
    totalDocuments: 8
  });
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    const supabase = createClient();
    
    try {
      // Fetch REAL document count
      const { count: docCount } = await supabase
        .from('user_documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Fetch REAL chat message count
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Calculate REAL progress
      let progressPercentage = 0;
      
      // Profile completion (30%)
      if (userProfile?.country && userProfile?.destination_country && userProfile?.visa_type) {
        progressPercentage += 30;
      }

      // Chat engagement (20%)
      if (messageCount && messageCount > 0) {
        progressPercentage += 20;
      }

      // Document uploads (50%)
      if (docCount && docCount > 0) {
        progressPercentage += Math.min((docCount / 8) * 50, 50);
      }

      setUserProgress({
        progressPercentage: Math.min(progressPercentage, 100),
        documentsCompleted: docCount || 0,
        totalDocuments: 8
      });
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className={`bg-white border-b ${isMobile ? 'p-4' : 'p-8'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight mb-2`}>
            {userProfile?.destination_country 
              ? `Your ${userProfile.destination_country} Visa Journey`
              : `Welcome back, ${user?.email?.split('@')[0] || 'Traveler'}! 👋`
            }
          </h1>
          <p className={`${isMobile ? 'text-sm' : 'text-lg'} text-muted-foreground`}>
            {userProfile?.visa_type || 'Your personalized AI guide to visa success'}
          </p>
        </div>
      </div>

      {/* Main Content - 5 Hero Cards */}
      <div className={`max-w-7xl mx-auto ${isMobile ? 'p-4' : 'p-8'} space-y-6`}>
        
        {/* CARD 1: VISA SUCCESS SCORE - Always Visible, Always Expanded */}
        <VisaSuccessScore 
          userId={user.id} 
          userProfile={userProfile}
          className="w-full"
        />

        {/* CARD 2: DOCUMENT CHECKER - Mobile: Collapsible, Desktop: Expanded */}
        {isMobile ? (
          <CollapsibleCard 
            title="📄 Document Readiness"
            badge={`${userProgress.documentsCompleted}/${userProgress.totalDocuments}`}
            defaultExpanded={userProgress.documentsCompleted < 3}
          >
            <DocumentCheckerCard 
              userId={user.id} 
              userProgress={userProgress}
            />
          </CollapsibleCard>
        ) : (
          <DocumentCheckerCard 
            userId={user.id} 
            userProgress={userProgress}
            className="w-full"
          />
        )}

        {/* CARD 3: POF SEASONING TRACKER - Mobile: Collapsible, Desktop: Expanded */}
        {isMobile ? (
          <CollapsibleCard 
            title="💰 Proof of Funds Status"
            badge="Track Progress"
            defaultExpanded={false}
          >
            <POFSeasoningTracker 
              userId={user.id} 
              userProfile={userProfile}
            />
          </CollapsibleCard>
        ) : (
          <POFSeasoningTracker 
              userId={user.id} 
              userProfile={userProfile}
              className="w-full"
          />
        )}

        {/* CARD 4: REJECTION RISK INSIGHTS - Mobile: Collapsible, Desktop: Expanded */}
        {isMobile ? (
          <CollapsibleCard 
            title="⚠️ Rejection Risk Analysis"
            badge="Avoid Issues"
            defaultExpanded={false}
          >
            <RejectionRiskInsights 
              userId={user.id} 
              userProfile={userProfile}
            />
          </CollapsibleCard>
        ) : (
          <RejectionRiskInsights 
              userId={user.id} 
              userProfile={userProfile}
              className="w-full"
          />
        )}

        {/* CARD 5: SMART NEXT ACTION - Always Visible, Always Expanded */}
        <SmartNextAction 
          userId={user.id} 
          userProfile={userProfile}
          currentProgress={userProgress.progressPercentage}
            className="w-full"
        />

        {/* BONUS: Apple Health Rings (Confidence Meter) - Desktop Only */}
        {!isMobile && (
          <div className="grid md:grid-cols-2 gap-6">
            <ConfidenceMeter 
              userId={user.id} 
              userProfile={userProfile}
              currentProgress={userProgress.progressPercentage}
              className="w-full"
            />
            {/* Placeholder for future widget */}
            <div className="bg-white/50 border-2 border-dashed border-gray-300 rounded-xl p-8 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <p className="text-sm font-medium">More insights coming soon</p>
                <p className="text-xs mt-1">Timeline tracker, expert sessions, etc.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Help Section */}
      <div className={`max-w-7xl mx-auto ${isMobile ? 'p-4' : 'p-8'} pb-12`}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">Need Help?</h3>
          <p className="text-sm opacity-90 mb-4">
            Our AI is here 24/7, or connect with verified visa experts
          </p>
          <div className="flex flex-wrap gap-3">
            <a 
              href="/chat" 
              className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium text-sm hover:bg-blue-50 transition-colors"
            >
              💬 Chat with AI
            </a>
            <a 
              href="/experts" 
              className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium text-sm hover:bg-white/30 transition-colors border border-white/30"
            >
              👤 Talk to Expert
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}