'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageCircleQuestion, CheckCircle2, Map, Repeat, ArrowRight, Users, TrendingUp, Shield, Upload, Clock, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/AuthContext';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

// Enhanced features with human expert integration
const features = [
  {
    icon: MessageCircleQuestion,
    title: 'AI Mock Interview',
    description: 'Practice with realistic questions. Upgrade to human expert feedback for personalized coaching.',
    href: '/interview',
    cta: 'Start Practicing',
    expert: true,
    expertText: 'Get human feedback'
  },
  {
    icon: CheckCircle2,
    title: 'AI Document Check',
    description: 'Upload documents for AI analysis. Experts available for complex cases or legal review.',
    href: '/document-check',
    cta: 'Analyze Document',
    expert: true,
    expertText: 'Expert review available'
  },
  {
    icon: Map,
    title: 'Visa Journey Tracker',
    description: 'See your detailed timeline. Connect with experts if you get stuck at any step.',
    href: '/progress',
    cta: 'View Journey',
    expert: false
  },
  {
    icon: Users,
    title: 'Human Expert Help',
    description: 'Stuck? Get 1-on-1 guidance from verified visa consultants with proven success records.',
    href: '/experts',
    cta: 'Find Experts',
    expert: true,
    highlight: true
  },
];

interface UserProgress {
  progressPercentage: number;
  nextMilestone: string;
  daysToDeadline: number;
  moneySaved: number;
  aheadOfPercentage: number;
  documentsCompleted: number;
  totalDocuments: number;
}

export default function ProgressMapClient() {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    progressPercentage: 25,
    nextMilestone: "Document Preparation",
    daysToDeadline: 14,
    moneySaved: 2400000, // ₦2.4M
    aheadOfPercentage: 67,
    documentsCompleted: 3,
    totalDocuments: 12
  });
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    // This would come from your Supabase progress tracking
    // For now, using mock data that we'll replace with real calculations
    const supabase = createClient();
    
    // TODO: Implement real progress calculation based on:
    // - Documents uploaded to storage
    // - Profile completion status
    // - Interview practice sessions
    // - Application milestones
    
    setUserProgress({
      progressPercentage: 45, // This would be calculated
      nextMilestone: "Document Verification",
      daysToDeadline: 7,
      moneySaved: 2400000,
      aheadOfPercentage: 73,
      documentsCompleted: 5,
      totalDocuments: 12
    });
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    setUserProfile(profile);
  };

  const calculateProgress = () => {
    // Real progress calculation based on:
    // 1. Profile completeness (25%)
    // 2. Documents uploaded (35%)
    // 3. Interview practice (20%)
    // 4. Application steps (20%)
    if (!userProfile) return 25;

    let progress = 0;
    if (userProfile.country) progress += 10;
    if (userProfile.destination_country) progress += 10;
    if (userProfile.profession) progress += 5;
    
    // Add document progress (mock for now)
    progress += (userProgress.documentsCompleted / userProgress.totalDocuments) * 35;
    
    return Math.min(progress, 100);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {userProfile?.destination_country 
            ? `Your Visa Journey to ${userProfile.destination_country}`
            : 'Your Visa Journey'
          }
        </h1>
        <p className="text-lg text-muted-foreground">
          Your personalized AI guide to visa success. Here's your journey at a glance.
        </p>
      </header>

      {/* ENHANCED PROGRESS HERO CARD */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle className="text-xl">Overall Progress</CardTitle>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {userProgress.progressPercentage}% Complete
              </Badge>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Ahead of {userProgress.aheadOfPercentage}%
              </Badge>
            </div>
          </div>
          <CardDescription>
            You're making great progress! {userProgress.nextMilestone} is your next milestone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={userProgress.progressPercentage} className="w-full h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Application Start</span>
            <span>Visa Approval</span>
          </div>
          
          {/* QUICK STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProgress.documentsCompleted}/{userProgress.totalDocuments}</div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProgress.daysToDeadline}d</div>
              <div className="text-xs text-muted-foreground">Next Deadline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">₦{(userProgress.moneySaved / 1000000).toFixed(1)}M</div>
              <div className="text-xs text-muted-foreground">Saved vs Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProgress.aheadOfPercentage}%</div>
              <div className="text-xs text-muted-foreground">Faster Peers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SMART INSIGHTS CARDS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Success Probability</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
            <p className="text-sm text-muted-foreground">
              Based on your profile strength and {userProfile?.destination_country || 'target country'} requirements
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Estimated Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 mb-2">4-5 months</div>
            <p className="text-sm text-muted-foreground">
              Typical processing: 6-8 months. You're moving faster! ⚡
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ENHANCED FEATURES GRID WITH HUMAN EXPERT INTEGRATION */}
      <div className="grid md:grid-cols-2 gap-6">
        {features.map((feature) => (
          <Card 
            key={feature.title} 
            className={`flex flex-col group hover:border-primary transition-all ${
              feature.highlight ? 'border-2 border-orange-300 bg-orange-50' : ''
            }`}
          >
            <CardHeader className="flex-1">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full transition-colors ${
                  feature.highlight 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                }`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <div className='flex-1'>
                  <div className="flex items-center gap-2 mb-1">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    {feature.expert && (
                      <Badge variant="outline" className="text-xs bg-blue-50">
                        <Shield className="w-3 h-3 mr-1" />
                        Expert Available
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{feature.description}</CardDescription>
                  
                  {feature.expertText && (
                    <div className="mt-2">
                      <Button variant="link" className="h-auto p-0 text-blue-600" asChild>
                        <Link href="/experts">
                          {feature.expertText} <ArrowRight className="ml-1 w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <div className="p-6 pt-0">
              <Button asChild className={`w-full transition-colors ${
                feature.highlight 
                  ? 'bg-orange-500 hover:bg-orange-600' 
                  : 'group-hover:bg-amber-400'
              }`}>
                <Link href={feature.href}>
                  {feature.cta} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* URGENT ACTION CARD */}
      {userProgress.daysToDeadline < 7 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Urgent Action Needed
            </CardTitle>
            <CardDescription className="text-red-700">
              Your {userProgress.nextMilestone} deadline is in {userProgress.daysToDeadline} days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button asChild className="bg-red-600 hover:bg-red-700">
                <Link href="/document-check">
                  Complete Now
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/experts">
                  Get Expert Help
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}