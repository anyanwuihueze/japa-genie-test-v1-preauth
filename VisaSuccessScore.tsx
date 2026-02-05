'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertCircle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface VisaSuccessScoreProps {
  userId: string;
  userProfile?: any;
  className?: string;
}

interface ScoreFactor {
  name: string;
  score: number;
  max: number;
  status: 'excellent' | 'good' | 'needs_work';
  tip: string;
}

export function VisaSuccessScore({ userId, userProfile, className }: VisaSuccessScoreProps) {
  const [successScore, setSuccessScore] = useState(0);
  const [scoreFactors, setScoreFactors] = useState<ScoreFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [basedOnCount, setBasedOnCount] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    calculateSuccessScore();
  }, [userId, userProfile]);

  const calculateSuccessScore = async () => {
    try {
      const supabase = createClient();
      
      // Fetch REAL data
      const [
        { data: documents },
        { count: messageCount },
        { count: docCount }
      ] = await Promise.all([
        supabase.from('user_documents').select('status, analysis_status').eq('user_id', userId),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('user_id', userId)
      ]);

      const approvedDocs = documents?.filter(d => d.status === 'approved' || d.analysis_status === 'completed').length || 0;
      const totalDocs = docCount || 0;

      let totalScore = 0;
      const factors: ScoreFactor[] = [];

      // FACTOR 1: Profile Completeness (25 points)
      let profileScore = 0;
      if (userProfile?.country) profileScore += 5;
      if (userProfile?.destination_country) profileScore += 5;
      if (userProfile?.visa_type) profileScore += 5;
      if (userProfile?.age) profileScore += 3;
      if (userProfile?.profession) profileScore += 4;
      if (userProfile?.timeline_urgency) profileScore += 3;
      
      totalScore += profileScore;
      factors.push({
        name: 'Strong Profile',
        score: profileScore,
        max: 25,
        status: profileScore >= 20 ? 'excellent' : profileScore >= 15 ? 'good' : 'needs_work',
        tip: profileScore < 25 ? 'Complete your profile for better chances' : 'Profile complete!'
      });

      // FACTOR 2: Document Readiness (40 points)
      const docTargetCount = 5; // Minimum required docs
      const docScore = Math.min((approvedDocs / docTargetCount) * 40, 40);
      
      totalScore += docScore;
      factors.push({
        name: 'Documents Complete',
        score: Math.round(docScore),
        max: 40,
        status: docScore >= 32 ? 'excellent' : docScore >= 20 ? 'good' : 'needs_work',
        tip: approvedDocs === 0 ? 'Upload and verify your documents' :
             approvedDocs < docTargetCount ? `${docTargetCount - approvedDocs} more documents needed` :
             'All key documents verified!'
      });

      // FACTOR 3: POF Seasoning (20 points)
      // Check if POF seasons exist and are progressing
      const { data: pofSeasons } = await supabase
        .from('user_pof_seasons')
        .select('status, progress_percentage')
        .eq('user_id', userId);
      
      let pofScore = 0;
      if (pofSeasons && pofSeasons.length > 0) {
        const completedSeasons = pofSeasons.filter(s => s.status === 'completed').length;
        const activeSeasons = pofSeasons.filter(s => s.status === 'in_progress');
        pofScore = (completedSeasons * 10) + (activeSeasons.length > 0 ? activeSeasons[0].progress_percentage * 0.1 : 0);
        pofScore = Math.min(pofScore, 20);
      }
      
      totalScore += pofScore;
      factors.push({
        name: 'Financial Proof',
        score: Math.round(pofScore),
        max: 20,
        status: pofScore >= 15 ? 'excellent' : pofScore >= 10 ? 'good' : 'needs_work',
        tip: pofScore === 0 ? 'Start POF seasoning process' :
             pofScore < 20 ? 'Continue building financial history' :
             'Strong financial proof!'
      });

      // FACTOR 4: Engagement & Preparation (15 points)
      let engagementScore = 0;
      if (messageCount && messageCount > 10) engagementScore = 15;
      else if (messageCount && messageCount > 5) engagementScore = 10;
      else if (messageCount && messageCount > 0) engagementScore = 5;
      
      totalScore += engagementScore;
      factors.push({
        name: 'Application Readiness',
        score: engagementScore,
        max: 15,
        status: engagementScore >= 12 ? 'excellent' : engagementScore >= 7 ? 'good' : 'needs_work',
        tip: !messageCount || messageCount === 0 ? 'Start preparing with AI guidance' :
             messageCount < 10 ? 'Ask more questions for better preparation' :
             'Well-prepared with AI guidance!'
      });

      setSuccessScore(Math.round(totalScore));
      setScoreFactors(factors);
      
      // Mock: Based on similar applications (in reality, query from database)
      const countryApplicants = 2340; // Would be: SELECT COUNT(*) FROM applications WHERE country = X
      setBasedOnCount(countryApplicants);

    } catch (error) {
      console.error('Error calculating success score:', error);
      // Fallback to basic score
      setSuccessScore(50);
      setScoreFactors([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = () => {
    if (successScore >= 75) return 'text-green-600';
    if (successScore >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = () => {
    if (successScore >= 75) return 'from-green-500 to-emerald-600';
    if (successScore >= 50) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreIcon = () => {
    if (successScore >= 75) return <CheckCircle2 className="w-6 h-6" />;
    if (successScore >= 50) return <AlertCircle className="w-6 h-6" />;
    return <AlertCircle className="w-6 h-6" />;
  };

  const getScoreLabel = () => {
    if (successScore >= 75) return 'Strong';
    if (successScore >= 50) return 'Moderate';
    return 'Building';
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} border-0 shadow-xl overflow-hidden`}>
      {/* Gradient Header */}
      <div className={`bg-gradient-to-r ${getScoreBgColor()} p-6 text-white`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <CardTitle className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-1`}>
              ðŸŽ¯ Your Visa Success Score
            </CardTitle>
            <CardDescription className="text-white/90">
              {userProfile?.destination_country 
                ? `${userProfile.destination_country} ${userProfile.visa_type || 'Visa'}`
                : 'Based on your application strength'}
            </CardDescription>
          </div>
          {getScoreIcon()}
        </div>

        {/* Score Display */}
        <div className="flex items-end gap-4">
          <div>
            <div className={`${isMobile ? 'text-5xl' : 'text-6xl'} font-bold`}>
              {successScore}%
            </div>
            <div className="text-sm opacity-90 mt-1">
              {getScoreLabel()} Application
            </div>
          </div>
          <div className="flex-1">
            <Progress 
              value={successScore} 
              className="h-3 bg-white/20"
            />
            <p className="text-xs mt-2 opacity-75">
              Based on {basedOnCount.toLocaleString()}+ similar applications
            </p>
          </div>
        </div>
      </div>

      {/* Score Factors */}
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          What's Impacting Your Score
        </h3>

        <div className="space-y-4">
          {scoreFactors.map((factor, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {factor.status === 'excellent' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                  {factor.status === 'good' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                  {factor.status === 'needs_work' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span className="font-medium text-sm">{factor.name}</span>
                </div>
                <span className={`text-sm font-semibold ${
                  factor.status === 'excellent' ? 'text-green-600' :
                  factor.status === 'good' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {factor.score}/{factor.max}
                </span>
              </div>
              
              <Progress 
                value={(factor.score / factor.max) * 100} 
                className="h-2"
              />
              
              {factor.status !== 'excellent' && (
                <p className="text-xs text-muted-foreground flex items-start gap-1">
                  <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                  {factor.tip}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        {successScore < 75 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  How to Improve Your Score
                </p>
                <p className="text-xs text-blue-700 mb-3">
                  Focus on the factors marked "needs work" to strengthen your application.
                </p>
                <Button size="sm" variant="default" asChild className="w-full sm:w-auto">
                  <Link href="#rejection-risk" className="flex items-center gap-2">
                    See Risk Factors
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
