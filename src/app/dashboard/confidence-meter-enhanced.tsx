'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle, Target, FileText, MessageSquare, Clock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { createClient } from '@/lib/supabase/client';

interface ConfidenceMeterEnhancedProps {
  userId: string;
  userProfile?: any;
  currentProgress?: number;
  className?: string;
}

export function ConfidenceMeterEnhanced({ userId, userProfile, currentProgress, className }: ConfidenceMeterEnhancedProps) {
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState<'low' | 'medium' | 'high'>('low');
  const [confidenceFactors, setConfidenceFactors] = useState<any[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const calculateRealConfidence = async () => {
      try {
        const supabase = createClient();
        
        // Fetch real user data
        const [
          { data: messages },
          { data: documents },
          { data: progress },
          { data: expertSessions }
        ] = await Promise.all([
          supabase.from('messages').select('count').eq('user_id', userId).single(),
          supabase.from('user_documents').select('status').eq('user_id', userId),
          supabase.from('user_progress').select('*').eq('user_id', userId).single(),
          supabase.from('expert_sessions').select('count').eq('user_id', userId).single()
        ]);

        let score = 0;
        const factors: any[] = [];

        // 1. Profile Completeness (25% weight)
        let profileScore = 0;
        if (userProfile?.country) profileScore += 20;
        if (userProfile?.destination_country) profileScore += 20;
        if (userProfile?.visa_type) profileScore += 15;
        if (userProfile?.age) profileScore += 10;
        if (userProfile?.profession) profileScore += 15;
        if (userProfile?.timeline_urgency) profileScore += 20;
        
        const profileWeight = 0.25;
        score += (profileScore / 100) * 25;
        factors.push({
          name: 'Profile Complete',
          score: profileScore,
          weight: profileWeight,
          status: profileScore >= 80 ? 'excellent' : profileScore >= 60 ? 'good' : 'needs_work',
          tip: profileScore < 100 ? 'Complete your profile for better recommendations' : 'Profile complete!'
        });

        // 2. Document Readiness (30% weight)
        let docScore = 0;
        const totalDocs = 8; // Target
        const approvedDocs = documents?.filter(d => d.status === 'approved').length || 0;
        const pendingDocs = documents?.filter(d => d.status === 'pending_review').length || 0;
        
        docScore += (approvedDocs / totalDocs) * 70; // 70% for approved docs
        docScore += (pendingDocs / totalDocs) * 30; // 30% for pending docs
        
        const docWeight = 0.30;
        score += (docScore / 100) * 30;
        factors.push({
          name: 'Documents Ready',
          score: docScore,
          weight: docWeight,
          status: docScore >= 80 ? 'excellent' : docScore >= 50 ? 'good' : 'needs_work',
          tip: approvedDocs === 0 ? 'Start uploading your documents' : 
               approvedDocs < totalDocs ? `${totalDocs - approvedDocs} more documents needed` :
               'All documents approved!'
        });

        // 3. AI Engagement (20% weight)
        let aiScore = 0;
        const messageCount = messages?.count || 0;
        if (messageCount >= 10) aiScore = 100;
        else if (messageCount >= 5) aiScore = 75;
        else if (messageCount >= 1) aiScore = 50;
        
        const aiWeight = 0.20;
        score += (aiScore / 100) * 20;
        factors.push({
          name: 'AI Guidance',
          score: aiScore,
          weight: aiWeight,
          status: aiScore >= 75 ? 'excellent' : aiScore >= 50 ? 'good' : 'needs_work',
          tip: messageCount === 0 ? 'Chat with our AI assistant' :
               messageCount < 5 ? 'Ask more questions for better guidance' :
               'Great engagement with AI!'
        });

        // 4. Progress Momentum (15% weight)
        let progressScore = 0;
        const progressPercentage = currentProgress || progress?.progress_percentage || 0;
        
        if (progressPercentage >= 80) progressScore = 100;
        else if (progressPercentage >= 60) progressScore = 80;
        else if (progressPercentage >= 40) progressScore = 60;
        else if (progressPercentage >= 20) progressScore = 40;
        else if (progressPercentage > 0) progressScore = 20;
        
        const progressWeight = 0.15;
        score += (progressScore / 100) * 15;
        factors.push({
          name: 'Journey Progress',
          score: progressScore,
          weight: progressWeight,
          status: progressScore >= 80 ? 'excellent' : progressScore >= 40 ? 'good' : 'needs_work',
          tip: progressPercentage === 0 ? 'Start your visa journey' :
               progressPercentage < 40 ? 'Keep building momentum' :
               progressPercentage < 80 ? 'Great progress, almost there!' :
               'Final steps ahead!'
        });

        // 5. Expert Support (10% weight)
        let expertScore = 0;
        const expertCount = expertSessions?.count || 0;
        if (expertCount >= 3) expertScore = 100;
        else if (expertCount >= 2) expertScore = 75;
        else if (expertCount >= 1) expertScore = 50;
        
        const expertWeight = 0.10;
        score += (expertScore / 100) * 10;
        factors.push({
          name: 'Expert Support',
          score: expertScore,
          weight: expertWeight,
          status: expertScore >= 75 ? 'excellent' : expertScore >= 50 ? 'good' : 'needs_work',
          tip: expertCount === 0 ? 'Consider expert consultation' :
               expertCount < 3 ? 'More expert sessions recommended' :
               'Excellent expert support!'
        });

        setConfidenceScore(Math.round(score));
        setConfidenceFactors(factors);

        // Determine confidence level
        if (score >= 80) setConfidenceLevel('high');
        else if (score >= 60) setConfidenceLevel('medium');
        else setConfidenceLevel('low');

      } catch (error) {
        console.error('Error calculating confidence:', error);
        // Fallback to basic calculation
        fallbackCalculation();
      }
    };

    const fallbackCalculation = () => {
      let score = 0;
      
      // Profile completeness (40%)
      if (userProfile?.country) score += 15;
      if (userProfile?.destination_country) score += 15;
      if (userProfile?.visa_type) score += 10;

      // Financial readiness (30%)
      if (userProfile?.funds_available) score += 20;
      if (userProfile?.employment_status) score += 10;

      // Document status (30%)
      if (userProfile?.documents_ready) score += 15;
      if (userProfile?.timeline_clarity) score += 15;

      setConfidenceScore(score);
      setConfidenceFactors([]);

      if (score >= 70) setConfidenceLevel('high');
      else if (score >= 40) setConfidenceLevel('medium');
      else setConfidenceLevel('low');
    };

    if (userId) {
      calculateRealConfidence();
    } else {
      fallbackCalculation();
    }
  }, [userId, userProfile, currentProgress]);

  const getConfidenceColor = () => {
    switch (confidenceLevel) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
    }
  };

  const getConfidenceIcon = () => {
    switch (confidenceLevel) {
      case 'high': return CheckCircle;
      case 'medium': return AlertTriangle;
      case 'low': return Target;
    }
  };

  const ConfidenceIcon = getConfidenceIcon();

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <TrendingUp className="w-5 h-5" />
          Visa Success Confidence
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Based on your real progress and data
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} space-y-4`}>
        <div className="flex items-center justify-between">
          <span className={`text-2xl font-bold ${getConfidenceColor()}`}>
            {confidenceScore}%
          </span>
          <ConfidenceIcon className={`w-8 h-8 ${getConfidenceColor()}`} />
        </div>
        
        <Progress value={confidenceScore} className="h-3" />
        
        <div className="space-y-2">
          <p className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>
            {confidenceLevel === 'high' && '🎉 Excellent! You\'re well-prepared for your visa journey.'}
            {confidenceLevel === 'medium' && '👍 Good progress! Focus on completing missing documents.'}
            {confidenceLevel === 'low' && '💪 Let\'s work together to strengthen your application.'}
          </p>
          
          {/* Confidence Factors Breakdown */}
          {confidenceFactors.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>Confidence Breakdown:</h4>
              {confidenceFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2">
                    {factor.status === 'excellent' && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {factor.status === 'good' && <Clock className="w-3 h-3 text-yellow-500" />}
                    {factor.status === 'needs_work' && <Target className="w-3 h-3 text-red-500" />}
                    {factor.name}
                  </span>
                  <span className="text-gray-500">{Math.round(factor.score)}%</span>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-3">
            {confidenceLevel === 'low' && (
              <>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  Complete Profile
                </span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Add Documents
                </span>
              </>
            )}
            {confidenceLevel === 'medium' && (
              <>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Review Timeline
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Chat More
                </span>
              </>
            )}
            {confidenceLevel === 'high' && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                Ready to Apply
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
