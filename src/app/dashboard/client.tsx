'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { 
  TrendingUp, Users, Target, Clock, MessageSquare, Loader2, 
  CheckCircle2, Circle, Calendar, AlertCircle, Zap, Upload 
} from 'lucide-react';
import Link from 'next/link';
import { EnhancedProfileCard } from '@/components/dashboard/enhanced-profile-card';
import VisaPulseTicker from '@/components/visa-pulse-ticker';

interface DashboardClientProps {
  user: any;
  userProfile?: any;
}

interface Milestone {
  id: string;
  label: string;
  completed: boolean;
  icon: any;
}

interface ProgressData {
  overall_progress: number;
  current_stage: string;
  target_country: string;
  visa_type: string;
  target_travel_date: string;
  application_deadline: string;
  profile_completed: boolean;
  documents_uploaded: boolean;
  documents_verified: boolean;
  financial_ready: boolean;
  interview_prep_done: boolean;
  application_submitted: boolean;
  decision_received: boolean;
  total_chat_messages: number;
  last_chat_date: string;
}

export default function DashboardClient({ user, userProfile }: DashboardClientProps) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChats: 0,
    totalInsights: 0,
    progress: 0,
    currentStage: 'Getting Started'
  });
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [timelineStats, setTimelineStats] = useState({
    daysUntilDeadline: 0,
    daysUntilTravel: 0,
    isUrgent: false
  });

  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      // ✅ FIXED: Fetch progress data (this now contains chat messages count)
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // ✅ FIXED: Fetch insights count
      const { data: insights } = await supabase
        .from('visa_insights')
        .select('id')
        .eq('user_id', user.id);

      if (progress) {
        setProgressData(progress);
        
        // Calculate auto progress from milestones
        const calculatedProgress = calculateProgress(progress);
        
        // Build milestones list
        const milestonesData = buildMilestones(progress);
        setMilestones(milestonesData);
        
        // Calculate timeline
        const timeline = calculateTimeline(progress);
        setTimelineStats(timeline);

        // ✅ FIXED: Use real data from progress table
        setStats({
          totalChats: progress.total_chat_messages || 0,
          totalInsights: insights?.length || 0,
          progress: calculatedProgress,
          currentStage: progress.current_stage || determineStage(milestonesData)
        });
      } else {
        // No progress record yet, create one
        await createInitialProgress();
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Still try to show insights even if progress fails
      try {
        const { data: insights } = await supabase
          .from('visa_insights')
          .select('id')
          .eq('user_id', user.id);
        
        setStats(prev => ({
          ...prev,
          totalInsights: insights?.length || 0
        }));
      } catch (insightError) {
        console.error('Error loading insights:', insightError);
      }
    } finally {
      setLoading(false);
    }
  }

  // AUTO-CALCULATE PROGRESS FROM MILESTONES
  function calculateProgress(data: ProgressData): number {
    const milestoneChecks = [
      data.profile_completed,
      data.documents_uploaded,
      data.documents_verified,
      data.financial_ready,
      data.interview_prep_done,
      data.application_submitted,
      data.decision_received
    ];
    
    const completed = milestoneChecks.filter(Boolean).length;
    return Math.round((completed / 7) * 100);
  }

  // BUILD MILESTONES ARRAY
  function buildMilestones(data: ProgressData): Milestone[] {
    return [
      {
        id: 'profile',
        label: 'Complete Profile',
        completed: data.profile_completed || false,
        icon: Users
      },
      {
        id: 'documents',
        label: 'Upload Documents',
        completed: data.documents_uploaded || false,
        icon: Upload
      },
      {
        id: 'verified',
        label: 'Documents Verified',
        completed: data.documents_verified || false,
        icon: CheckCircle2
      },
      {
        id: 'financial',
        label: 'Financial Proof Ready',
        completed: data.financial_ready || false,
        icon: Target
      },
      {
        id: 'interview',
        label: 'Interview Preparation',
        completed: data.interview_prep_done || false,
        icon: MessageSquare
      },
      {
        id: 'submit',
        label: 'Submit Application',
        completed: data.application_submitted || false,
        icon: Zap
      },
      {
        id: 'decision',
        label: 'Decision Received',
        completed: data.decision_received || false,
        icon: CheckCircle2
      }
    ];
  }

  // DETERMINE CURRENT STAGE
  function determineStage(milestones: Milestone[]): string {
    const completed = milestones.filter(m => m.completed).length;
    if (completed === 0) return 'Getting Started';
    if (completed <= 2) return 'Building Profile';
    if (completed <= 4) return 'Preparing Documents';
    if (completed <= 5) return 'Ready to Apply';
    if (completed === 6) return 'Application Submitted';
    return 'Completed';
  }

  // CALCULATE TIMELINE
  function calculateTimeline(data: ProgressData) {
    const now = new Date();
    
    let daysUntilDeadline = 0;
    let daysUntilTravel = 0;
    
    if (data.application_deadline) {
      const deadline = new Date(data.application_deadline);
      daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    if (data.target_travel_date) {
      const travelDate = new Date(data.target_travel_date);
      daysUntilTravel = Math.ceil((travelDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }
    
    return {
      daysUntilDeadline,
      daysUntilTravel,
      isUrgent: daysUntilDeadline > 0 && daysUntilDeadline < 30
    };
  }

  // CREATE INITIAL PROGRESS RECORD
  async function createInitialProgress() {
    const { data } = await supabase
      .from('user_progress')
      .insert({
        user_id: user.id,
        current_stage: 'Getting Started',
        overall_progress: 0,
        profile_completed: false,
        documents_uploaded: false,
        documents_verified: false,
        financial_ready: false,
        interview_prep_done: false,
        application_submitted: false,
        decision_received: false,
        total_chat_messages: 0
      })
      .select()
      .single();
      
    if (data) {
      setProgressData(data);
      setMilestones(buildMilestones(data));
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const nextMilestone = milestones.find(m => !m.completed);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          Welcome back, {userProfile?.full_name || 'Traveler'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {progressData?.target_country && progressData?.visa_type 
            ? `Your ${progressData.visa_type} visa journey to ${progressData.target_country}`
            : 'Your visa journey dashboard'
          }
        </p>
      </header>

      <VisaPulseTicker />

      {/* TIMELINE URGENCY BANNER */}
      {timelineStats.isUrgent && (
        <Card className="border-orange-500 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <div>
                <h3 className="font-bold text-orange-800">Urgent: Deadline Approaching!</h3>
                <p className="text-sm text-orange-700">
                  Only {timelineStats.daysUntilDeadline} days until application deadline
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PROGRESS CARD WITH STAGE */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Visa Journey Progress</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-white">
                  {stats.currentStage}
                </Badge>
                {nextMilestone && (
                  <span className="text-sm">
                    Next: {nextMilestone.label}
                  </span>
                )}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{stats.progress}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={stats.progress} className="w-full h-4 mb-4" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Started</span>
            <span>{milestones.filter(m => m.completed).length} of 7 milestones</span>
            <span>Visa Approved</span>
          </div>
        </CardContent>
      </Card>

      {/* ✅ ADDED: ENGAGEMENT STATS CARD */}
      {progressData && (progressData.total_chat_messages > 0 || progressData.last_chat_date) && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Your Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm font-medium">Chat Messages</span>
                </div>
                <div className="text-2xl font-bold">{progressData.total_chat_messages}</div>
              </div>
              {progressData.last_chat_date && (
                <div>
                  <div className="flex items-center gap-2 text-purple-600 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Last Active</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {new Date(progressData.last_chat_date).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* TIMELINE CARDS */}
      {(timelineStats.daysUntilDeadline > 0 || timelineStats.daysUntilTravel > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timelineStats.daysUntilDeadline > 0 && (
            <Card className={timelineStats.isUrgent ? 'border-orange-400' : 'border-blue-200'}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Application Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {timelineStats.daysUntilDeadline} days
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(progressData?.application_deadline || '').toLocaleDateString()}
                </p>
                {timelineStats.isUrgent && (
                  <Badge className="mt-2 bg-orange-500">Urgent</Badge>
                )}
              </CardContent>
            </Card>
          )}

          {timelineStats.daysUntilTravel > 0 && (
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Target Travel Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {timelineStats.daysUntilTravel} days
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(progressData?.target_travel_date || '').toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* MILESTONES CHECKLIST */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Milestones</CardTitle>
          <CardDescription>Track your progress step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon;
              return (
                <div 
                  key={milestone.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    milestone.completed 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`flex-shrink-0 ${milestone.completed ? 'text-green-600' : 'text-gray-400'}`}>
                    {milestone.completed ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className={`font-medium ${milestone.completed ? 'text-green-800' : 'text-gray-700'}`}>
                        {milestone.label}
                      </span>
                    </div>
                  </div>
                  {milestone.completed && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                      Complete
                    </Badge>
                  )}
                  {!milestone.completed && index === milestones.findIndex(m => !m.completed) && (
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <EnhancedProfileCard userProfile={userProfile} />
        
        <Card>
          <CardContent className="pt-6 text-center">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold">{stats.totalChats}</div>
            <div className="text-sm text-muted-foreground">Chat Messages</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Target className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold">{stats.totalInsights}</div>
            <div className="text-sm text-muted-foreground">Insights Generated</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold">{milestones.filter(m => m.completed).length}/7</div>
            <div className="text-sm text-muted-foreground">Milestones</div>
          </CardContent>
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          {nextMilestone && (
            <CardDescription>
              Recommended: Complete "{nextMilestone.label}"
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button asChild>
              <Link href="/chat">Continue Chat</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/kyc">Update Profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/dashboard/proof-of-funds">Proof of Funds</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/document-check">Upload Documents</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}