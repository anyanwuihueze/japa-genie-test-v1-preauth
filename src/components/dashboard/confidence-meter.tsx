'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, CheckCircle, Target } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ConfidenceMeterProps {
  userProfile: any;
  className?: string;
}

export function ConfidenceMeter({ userProfile, className }: ConfidenceMeterProps) {
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [confidenceLevel, setConfidenceLevel] = useState<'low' | 'medium' | 'high'>('low');
  const isMobile = useIsMobile();

  useEffect(() => {
    // Calculate confidence based on profile completeness and key factors
    const calculateConfidence = () => {
      let score = 0;
      let maxScore = 100;

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

      // Determine level
      if (score >= 70) setConfidenceLevel('high');
      else if (score >= 40) setConfidenceLevel('medium');
      else setConfidenceLevel('low');
    };

    calculateConfidence();
  }, [userProfile]);

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
            {confidenceLevel === 'high' && 'Excellent! You\'re well-prepared for your visa journey.'}
            {confidenceLevel === 'medium' && 'Good progress! Focus on completing missing documents.'}
            {confidenceLevel === 'low' && 'Let\'s work together to strengthen your application.'}
          </p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            {confidenceLevel === 'low' && (
              <>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Complete Profile
                </span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                  Add Documents
                </span>
              </>
            )}
            {confidenceLevel === 'medium' && (
              <>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Review Timeline
                </span>
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  Check Funds
                </span>
              </>
            )}
            {confidenceLevel === 'high' && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                Ready to Apply
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
