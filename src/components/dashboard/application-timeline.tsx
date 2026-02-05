'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Clock, AlertCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Badge } from '@/components/ui/badge';

interface ApplicationTimelineProps {
  className?: string;
}

export function ApplicationTimeline({ className }: ApplicationTimelineProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData('');

  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading timeline
        </CardContent>
      </Card>
    );
  }

  const stages = [
    {
      id: 'onboarding',
      title: 'Getting Started',
      description: 'Complete your profile and understand your visa requirements',
      milestone: 'Profile Complete'
    },
    {
      id: 'documents',
      title: 'Document Preparation',
      description: 'Gather and prepare all required documents for your application',
      milestone: 'Documents Ready'
    },
    {
      id: 'submission',
      title: 'Application Submission',
      description: 'Complete and submit your visa application with professional review',
      milestone: 'Application Submitted'
    },
    {
      id: 'interview',
      title: 'Interview Preparation',
      description: 'Prepare for your visa interview with mock sessions and expert guidance',
      milestone: 'Interview Ready'
    },
    {
      id: 'approval',
      title: 'Visa Approval & Travel',
      description: 'Celebrate your approval and prepare for your journey',
      milestone: 'Visa Approved'
    }
  ];

  const currentStageIndex = getStageIndex(dashboardData.userProgress?.current_stage || 'onboarding');

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
          Application Timeline
        </CardTitle>
        <div className={`${isMobile ? 'text-sm' : 'text-base'} text-muted-foreground`}>
          {dashboardData.progressPercentage}% Complete - {dashboardData.userProgress?.nextMilestone || 'Getting Started'}
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-6">
          {/* Overall Progress */}
          <div className="text-center">
            <Progress value={dashboardData.progressPercentage} className="w-full h-3" />
            <div className={`flex justify-between mt-1 ${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
              <span>{dashboardData.progressPercentage}%</span>
              <span>{dashboardData.userProgress?.estimatedTimeline || '6-8 months'}</span>
            </div>
          </div>

          {/* Timeline Stages */}
          <div className="space-y-4">
            {stages.map((stage, index) => {
              const isCompleted = index < currentStageIndex;
              const isCurrent = index === currentStageIndex;
              const isUpcoming = index > currentStageIndex;

              return (
                <div key={stage.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-green-500 text-white' :
                      isCurrent ? 'bg-blue-500 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                       isCurrent ? <AlertCircle className="w-5 h-5" /> :
                       <Circle className="w-5 h-5" />}
                    </div>
                    {index < stages.length - 1 && (
                      <div className={`w-0.5 flex-1 my-2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>

                  <div className={`flex-1 pb-4 ${isUpcoming ? 'opacity-50' : ''}`}>
                    <div className={`flex items-center justify-between mb-1 ${isMobile ? 'flex-col items-start gap-1' : ''}`}>
                      <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'}`}>
                        {stage.title}
                      </h3>
                      {isCurrent && (
                        <Badge variant="outline" className={`bg-blue-50 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          In Progress
                        </Badge>
                      )}
                      {isCompleted && (
                        <Badge variant="outline" className={`bg-green-50 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'} mb-2`}>
                      {stage.description}
                    </p>
                    <p className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {stage.milestone}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Milestone */}
          {dashboardData.userProgress?.nextMilestone && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">
                    Next Milestone
                  </p>
                  <p className="text-blue-700">
                    {dashboardData.userProgress.nextMilestone}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getStageIndex(stageName: string): number {
  const stages = ['onboarding', 'documents', 'submission', 'interview', 'approval'];
  return Math.max(0, stages.indexOf(stageName));
}
