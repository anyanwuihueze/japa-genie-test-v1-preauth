// src/app/dashboard/client.tsx - COMPLETE FIXED VERSION WITH REAL-TIME PROFILE DATA
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { 
  TrendingUp, Users, Target, Clock, MessageSquare, Loader2, 
  CheckCircle2, Circle, Calendar, AlertCircle, Zap, Upload, MapPin 
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
  alternative_countries?: string[];
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
  }, [userProfile]); // 🚀 RELOAD WHEN PROFILE CHANGES

  async function loadDashboardData() {
    try {
      // ✅ USE PASSED PROFILE DATA (REAL-TIME)
      if (userProfile) {
        setProgressData({
          ...userProfile,
          target_country: userProfile.destination_country,
          visa_type: userProfile.visa_type || 'Not Set',
          overall_progress: 0,
          current_stage: 'Active',
          profile_completed: true,
          documents_uploaded: false,
          documents_verified: false,
          financial_ready: false,
          interview_prep_done: false,
          application_submitted: false,
          decision_received: false,
          total_chat_messages: 0,
          last_chat_date: ''
        });

        // Calculate timeline
        const timeline = calculateTimeline(userProfile);
        setTimelineStats(timeline);

        // Build milestones
        const milestonesData = buildMilestones(userProfile);
        setMilestones(milestonesData);

        // Set stats
        setStats({
          totalChats: 0,
          totalInsights: 0,
          progress: 75, // Basic completion for now
          currentStage: determineStage(milestonesData)
        });
      }

      // Get insights count
      const { data: insights } = await supabase
        .from('visa_insights')
        .select('id')
        .eq('user_id', user.id);

      setStats(prev => ({
        ...prev,
        totalInsights: insights?.length || 0
      }));

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  function calculateTimeline(data: any) {
    const now = new Date();
    
    let daysUntilDeadline = 0;
    let daysUntilTravel = 0;
    
    if (data.timeline_urgency === 'asap') {
      daysUntilDeadline = 30;
    } else if (data.timeline_urgency === '3-6_months') {
      daysUntilDeadline = 120;
    } else if (data.timeline_urgency === '6-12_months') {
      daysUntilDeadline = 270;
    }
    
    return {
      daysUntilDeadline,
      daysUntilTravel,
      isUrgent: daysUntilDeadline > 0 && daysUntilDeadline < 60
    };
  }

  function buildMilestones(data: any): Milestone[] {
    return [
      {
        id: 'profile',
        label: 'Complete Profile',
        completed: true, // Since we have profile data
        icon: Users
      },
      {
        id: 'documents',
        label: 'Upload Documents',
        completed: false,
        icon: Upload
      },
      {
        id: 'verified',
        label: 'Documents Verified',
        completed: false,
        icon: CheckCircle2
      },
      {
        id: 'financial',
        label: 'Financial Proof Ready',
        completed: false,
        icon: Target
      },
      {
        id: 'interview',
        label: 'Interview Preparation',
        completed: false,
        icon: MessageSquare
      },
      {
        id: 'submit',
        label: 'Submit Application',
        completed: false,
        icon: Zap
      },
      {
        id: 'decision',
        label: 'Decision Received',
        completed: false,
        icon: CheckCircle2
      }
    ];
  }

  function determineStage(milestones: Milestone[]): string {
    const completed = milestones.filter(m => m.completed).length;
    if (completed === 0) return 'Getting Started';
    if (completed <= 2) return 'Building Profile';
    if (completed <= 4) return 'Preparing Documents';
    if (completed <= 5) return 'Ready to Apply';
    if (completed === 6) return 'Application Submitted';
    return 'Completed';
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          Welcome back, {userProfile?.preferred_name || user.email?.split('@')[0] || 'Traveler'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {userProfile?.destination_country && userProfile?.visa_type 
            ? `Your ${userProfile.visa_type} visa journey to ${userProfile.destination_country}`
            : 'Your visa journey dashboard'
          }
        </p>
      </header>

      <VisaPulseTicker />

      {/* 🎯 ENHANCED PROFILE CARD WITH ALTERNATIVE COUNTRIES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedProfileCard userProfile={userProfile} userId={user.id} onProfileUpdate={() => window.location.reload()} />
        </div>
        
        <div className="space-y-4">
          {/* ALTERNATIVE COUNTRIES SECTION */}
          {userProfile?.alternative_countries && userProfile.alternative_countries.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alternative Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userProfile.alternative_countries.map((country: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm font-medium">{country}</span>
                      <Badge variant="outline" className="text-xs">
                        Option {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QUICK STATS */}
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{stats.totalInsights}</div>
              <div className="text-sm text-muted-foreground">Insights Generated</div>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/chat">Continue Chat</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/kyc-profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🚀 COMPLETE USER STATUS SECTION */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Your Complete Journey Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile?.age || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Age</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile?.profession || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Profession</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProfile?.timeline_urgency || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProfile?.user_type || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Profile Type</div>
            </div>
          </div>

          {userProfile?.alternative_countries && userProfile.alternative_countries.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Alternative Destinations</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.alternative_countries.map((country: string) => (
                  <Badge key={country} variant="secondary" className="text-sm">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MILESTONES SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Milestones</CardTitle>
          <CardDescription>Track your progress step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Complete Profile', 'Upload Documents', 'Documents Verified', 'Financial Ready', 'Interview Prep', 'Submit Application', 'Decision Received'].map((label, index) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="text-gray-400">
                  <Circle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  Pending
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}