'use client';

import { useState, useEffect } from 'react';
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
  const [localProfile, setLocalProfile] = useState<any>(null);

  useEffect(() => {
    const kycData = sessionStorage.getItem('kycData');
    if (kycData) {
      const parsed = JSON.parse(kycData);
      setLocalProfile({
        country: parsed.country,
        destination_country: parsed.destination,
        visa_type: parsed.visaType
      });
    }
  }, []);

  const mergedProfile = localProfile || userProfile;

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

  const kycComplete = !!mergedProfile?.country && !!mergedProfile?.destination_country && !!mergedProfile?.visa_type;
  const documentProgress = calculateDocumentProgress(documentCount);
  const chatProgress = calculateChatProgress(messageCount);
  const pofProgress = calculatePofProgress(pofSeasons);
  const expertProgress = calculateExpertProgress(mergedProfile);

  const confidenceScore = Math.round(
    (kycComplete ? 20 : 0) +
    documentProgress * 0.2 +
    chatProgress * 0.2 +
    pofProgress * 0.2 +
    expertProgress * 0.2
  );

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Visa Success Confidence
        </CardTitle>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-6">
          <div className="text-center">
            <div className={`${isMobile ? 'text-4xl' : 'text-5xl'} font-bold ${getConfidenceColor(confidenceScore)}`}>
              {confidenceScore}%
            </div>
            <p className="text-muted-foreground mt-2">
              {getConfidenceMessage(confidenceScore)}
            </p>
          </div>

          <Progress value={confidenceScore} className="h-3" />

          <div className="space-y-3">
            <ConfidenceItem
              icon={<Shield className="w-4 h-4" />}
              label="Profile Complete"
              value={kycComplete ? 100 : 0}
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
              label="POF Progress"
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

function ConfidenceItem({ icon, label, value, isMobile }: { icon: React.ReactNode; label: string; value: number; isMobile: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{label}</span>
      </div>
      <span className={`font-bold ${isMobile ? 'text-sm' : 'text-base'}`}>{Math.round(value)}%</span>
    </div>
  );
}

function getConfidenceColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
}

function getConfidenceMessage(score: number): string {
  if (score >= 80) return 'Excellent! You are well prepared.';
  if (score >= 60) return 'Good progress. Keep going!';
  if (score >= 40) return 'Getting there. Complete more tasks.';
  return 'Let us work together to strengthen your application.';
}

function calculateDocumentProgress(count: number): number {
  return Math.min(100, (count / 8) * 100);
}

function calculateChatProgress(count: number): number {
  return Math.min(100, (count / 10) * 100);
}

function calculatePofProgress(seasons: any[]): number {
  if (!seasons || seasons.length === 0) return 0;
  const completed = seasons.filter((s: any) => s.status === 'completed').length;
  return (completed / seasons.length) * 100;
}

function calculateExpertProgress(profile: any): number {
  if (!profile) return 0;
  if (profile.consultation_booked || profile.expert_session_count > 0) return 100;
  if (profile.expert_chat_count > 0) return 75;
  if (profile.expert_section_views > 0) return 50;
  return 25;
}
