'use client';

import { useState } from 'react';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowRight, CheckCircle2, Clock, AlertTriangle, User, FileText, MessageSquare, Target, Calendar, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface NextBestActionProps {
  className?: string;
}

export function NextBestAction({ className }: NextBestActionProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData('');
  const [currentActionIndex, setCurrentActionIndex] = useState(0);

  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-48" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </Card>
    );
  }

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading recommendations
        </CardContent>
      </Card>
    );
  }

  const recommendedActions = generateRecommendations({
    userProfile: dashboardData.userProfile,
    messageCount: dashboardData.messageCount,
    documentCount: dashboardData.documentCount,
    currentProgress: dashboardData.progressPercentage,
    recentMessages: dashboardData.recentMessages
  });

  const currentAction = recommendedActions[currentActionIndex];

  if (recommendedActions.length === 0) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'} mb-2`}>
            All Caught Up! 🎉
          </h3>
          <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
            You've completed all recommended actions. Keep up the great work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <Brain className="w-5 h-5" />
          Next Best Action
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          AI-powered recommendations based on your progress
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          {/* Current Recommendation */}
          {currentAction && (
            <>
              {/* Priority and Category - DYNAMIC VALUES */}
              <div className="flex items-center justify-between">
                <Badge className={`${getPriorityColor(currentAction.priority)} ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {currentAction.priority.toUpperCase()} PRIORITY
                </Badge>
                <div className="flex items-center gap-2 text-muted-foreground">
                  {getCategoryIcon(currentAction.category)}
                  <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{currentAction.category}</span>
                </div>
              </div>

              {/* Impact Score - DYNAMIC VALUE */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`${isMobile ? 'text-sm' : 'text-base'} font-medium`}>
                    Success Impact
                  </span>
                  <span className={`font-bold text-green-600 ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {currentAction.estimatedImpact}%
                  </span>
                </div>
                <Progress value={currentAction.estimatedImpact} className="h-2" />
              </div>

              {/* Main Content - DYNAMIC VALUES */}
              <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <h3 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} text-gray-900`}>
                  {currentAction.title}
                </h3>
                <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {currentAction.description}
                </p>

                {/* Smart Tip - DYNAMIC */}
                {currentAction.smartTip && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className={`text-yellow-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <span className="font-medium">AI Tip:</span> {currentAction.smartTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Why Important - DYNAMIC */}
                {currentAction.whyImportant && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className={`text-blue-800 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                      <span className="font-medium">Why this matters:</span> {currentAction.whyImportant}
                    </p>
                  </div>
                )}

                {/* Benefits - DYNAMIC */}
                {currentAction.benefits && currentAction.benefits.length > 0 && (
                  <div className="mt-3">
                    <p className={`font-medium mb-2 ${isMobile ? 'text-sm' : 'text-base'}`}>Benefits:</p>
                    <ul className="space-y-1">
                      {currentAction.benefits.map((benefit: string, index: number) => (
                        <li key={index} className={`flex items-center gap-2 text-green-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Action Button - DYNAMIC URL */}
              <Button asChild className="w-full" size={isMobile ? "sm" : "default"}>
                <Link href={currentAction.actionUrl} className="flex items-center justify-center gap-2">
                  {currentAction.actionText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>

              {/* Time Estimate - DYNAMIC */}
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                  Estimated time: {currentAction.estimatedTime}
                </span>
              </div>
            </>
          )}

          {/* Navigation - DYNAMIC */}
          {recommendedActions.length > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentActionIndex(Math.max(0, currentActionIndex - 1))}
                disabled={currentActionIndex === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-1">
                {recommendedActions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentActionIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentActionIndex ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentActionIndex(Math.min(recommendedActions.length - 1, currentActionIndex + 1))}
                disabled={currentActionIndex === recommendedActions.length - 1}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function generateRecommendations(userData: any) {
  const { userProfile, messageCount, documentCount, currentProgress } = userData;
  const actions: any[] = [];

  // CRITICAL: Profile Completion
  if (!userProfile?.country || !userProfile?.destination_country || !userProfile?.visa_type) {
    actions.push({
      id: 'complete-profile',
      title: 'Complete Your Profile',
      description: 'Add your current country, destination, and visa type for personalized guidance',
      priority: 'critical',
      category: 'profile',
      estimatedImpact: 95,
      estimatedTime: '5 mins',
      actionUrl: '/kyc',
      actionText: 'Complete Profile',
      whyImportant: 'This unlocks all personalized features and AI recommendations',
      smartTip: 'Your destination country determines 80% of your visa requirements',
      benefits: ['Personalized checklist', 'Accurate timeline', 'Targeted advice']
    });
  }

  // HIGH: Document Upload
  if (documentCount < 3 && currentProgress > 20) {
    actions.push({
      id: 'upload-documents',
      title: 'Upload Core Documents',
      description: `Upload your passport, photos, and financial statements (${documentCount}/8 completed)`,
      priority: 'high',
      category: 'documents',
      estimatedImpact: 85,
      estimatedTime: '15 mins',
      actionUrl: '/document-check',
      actionText: 'Upload Documents',
      whyImportant: 'Documents are the foundation of your visa application',
      smartTip: 'Use our AI document checker to ensure everything meets requirements',
      benefits: ['Faster processing', 'Fewer rejections', 'Professional review']
    });
  }

  // HIGH: AI Chat Engagement
  if (messageCount < 5) {
    actions.push({
      id: 'chat-with-ai',
      title: 'Chat with AI Assistant',
      description: 'Get personalized guidance by asking questions about your visa journey',
      priority: 'high',
      category: 'expert',
      estimatedImpact: 80,
      estimatedTime: '10 mins',
      actionUrl: '/chat',
      actionText: 'Start Chat',
      whyImportant: 'Our AI has helped 10,000+ applicants successfully get their visas',
      smartTip: 'Ask about your specific situation - the AI gets smarter with context',
      benefits: ['24/7 support', 'Personalized answers', 'Expert insights']
    });
  }

  // MEDIUM: Interview Prep
  if (currentProgress > 50) {
    actions.push({
      id: 'schedule-interview',
      title: 'Schedule Mock Interview',
      description: 'Practice with realistic visa interview questions and get expert feedback',
      priority: 'medium',
      category: 'interview',
      estimatedImpact: 90,
      estimatedTime: '30 mins',
      actionUrl: '/interview',
      actionText: 'Book Interview',
      whyImportant: 'Interview success rate increases 3x with proper preparation',
      smartTip: 'Book early - our expert slots fill up quickly during peak seasons',
      benefits: ['Real practice', 'Expert feedback', 'Confidence building']
    });
  }

  return actions.sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case 'profile': return <User className="w-5 h-5" />;
    case 'documents': return <FileText className="w-5 h-5" />;
    case 'interview': return <MessageSquare className="w-5 h-5" />;
    case 'timeline': return <Calendar className="w-5 h-5" />;
    case 'expert': return <Brain className="w-5 h-5" />;
    case 'financial': return <DollarSign className="w-5 h-5" />;
    default: return <Target className="w-5 h-5" />;
  }
}
