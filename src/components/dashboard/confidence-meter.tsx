'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, Shield, MessageSquare, FileText, Users, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConfidenceMeterProps {
  className?: string;
}

export function ConfidenceMeter({ className }: ConfidenceMeterProps) {
  const isMobile = useIsMobile();
  const { quickStats, userProfile, documentCount, messageCount, pofSeasons, loading, error } = useDashboardData('');

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading confidence data
        </CardContent>
      </Card>
    );
  }

  const kycComplete = !!userProfile?.country && !!userProfile?.destination_country && !!userProfile?.visa_type;
  const documentProgress = calculateDocumentProgress(documentCount);
  const chatProgress = calculateChatProgress(messageCount);
  const pofProgress = calculatePofProgress(pofSeasons);
  
  const confidenceScore = Math.round((kycComplete ? 85 : 0 + documentProgress + chatProgress + pofProgress) / 4);
  const expertProgress = calculateExpertProgress(userProfile);

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <Shield className="w-5 h-5" />
          Visa Success Confidence
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Based on your real progress and data
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="text-center">
            <div className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold mb-2`}>
              {confidenceScore}%
            </div>
            <Progress value={confidenceScore} className="w-full h-3" />
            <p className={`text-muted-foreground mt-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
              {getMessage(confidenceScore)}
            </p>
          </div>

          {/* Breakdown */}
          <div className="space-y-3">
            <ConfidenceItem
              icon={<Target className="w-4 h-4" />}
              label="Profile Complete"
              value={kycComplete ? 85 : 0}
              isMobile={isMobile}
            />
            <ConfidenceItem
              icon={<FileText className="w-4 h-4" />}
              label="Documents Ready"
              value={documentProgress}
              isMobile={isMobile}
            />
            <ConfidenceItem
              icon={<MessageSquare className="w-4 h-4" />}
              label="AI Guidance"
              value={chatProgress}
              isMobile={isMobile}
            />
            <ConfidenceItem
              icon={<TrendingUp className="w-4 h-4" />}
              label="Journey Progress"
              value={pofProgress}
              isMobile={isMobile}
            />
            <ConfidenceItem
              icon={<Users className="w-4 h-4" />}
              label="Expert Support"
              value={expertProgress}
              isMobile={isMobile}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ConfidenceItem({ 
  icon, 
  label, 
  value, 
  isMobile 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  isMobile: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{label}</span>
      </div>
      <div className={`flex items-center gap-2 ${isMobile ? 'text-sm' : 'text-base'}`}>
        <span>{value}%</span>
        <div className="w-20">
          <Progress value={value} className="h-2" />
        </div>
      </div>
    </div>
  );
}

function calculateDocumentProgress(documentCount: number): number {
  return Math.min((documentCount / 8) * 100, 100);
}

function calculateChatProgress(messageCount: number): number {
  return Math.min((messageCount / 20) * 100, 100);
}

function calculatePofProgress(seasons: any[]): number {
  if (!seasons.length) return 0;
  const totalSeasons = seasons.length;
  const completedSeasons = seasons.filter((s: any) => s.status === 'completed').length;
  return Math.round((completedSeasons / totalSeasons) * 100);
}

function getMessage(score: number): string {
  if (score >= 80) return "Excellent! Your application is very strong.";
  if (score >= 60) return "Good progress! Let's strengthen a few areas.";
  if (score >= 40) return "Keep going! Focus on completing your profile.";
  return "Let's work together to strengthen your application.";
}
function calculateExpertProgress(userProfile: any): number {
  if (!userProfile) return 0;
  if (userProfile.consultation_booked || userProfile.expert_session_count > 0) return 100;
  if (userProfile.expert_chat_count > 0) return 75;
  if (userProfile.expert_section_views > 0) return 50;
  return 25; // Base for having access to experts
}
