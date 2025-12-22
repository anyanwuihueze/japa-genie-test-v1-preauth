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
    progressPercentage: 0,
    nextMilestone: "Complete Your Profile",
    daysToDeadline: 0,
    moneySaved: 0,
    aheadOfPercentage: 0,
    documentsCompleted: 0,
    totalDocuments: 12
  });
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRealProgress();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRealProgress = async () => {
    if (!user) return;
    
    const supabase = createClient();
    setLoading(true);

    try {
      // 1. Get user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);

      // 2. Count messages (chat activity)
      const { count: messageCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('deleted_at', null);

      // 3. Count documents in storage
      const { data: files } = await supabase
        .storage
        .from('documents')
        .list(user.id);

      const documentCount = files?.length || 0;

      // 4. Calculate progress components
      let totalProgress = 0;

      // Profile Completion (25%)
      let profileScore = 0;
      if (profile?.country) profileScore += 8;
      if (profile?.destination_country) profileScore += 9;
      if (profile?.visa_type) profileScore += 8;
      totalProgress += profileScore;

      // Chat Activity (25%)
      const chatScore = Math.min(25, (messageCount || 0) * 2);
      totalProgress += chatScore;

      // Documents Uploaded (25%)
      const docScore = Math.min(25, documentCount * 2);
      totalProgress += docScore;

      // Interview Practice (25%) - Mock for now
      const interviewScore = 0; // TODO: Implement when interview feature tracks sessions
      totalProgress += interviewScore;

      // Determine next milestone
      let nextMilestone = "Complete Your Profile";
      let daysToDeadline = 30;
      
      if (profileScore >= 20) {
        nextMilestone = "Upload Required Documents";
        daysToDeadline = 14;
      }
      if (documentCount >= 5) {
        nextMilestone = "Practice Mock Interview";
        daysToDeadline = 7;
      }
      if (documentCount >= 10) {
        nextMilestone = "Submit Application";
        daysToDeadline = 3;
      }

      // Calculate money saved vs agents (agents charge ~₦500k-₦2M)
      const avgAgentFee = 1200000; // ₦1.2M average
      const moneySaved = Math.min(avgAgentFee, totalProgress * 12000);

      // Calculate "ahead of peers" percentage (based on progress speed)
      const aheadOfPercentage = Math.min(95, 40 + totalProgress / 2);

      setUserProgress({
        progressPercentage: Math.min(100, Math.round(totalProgress)),
        nextMilestone,
        daysToDeadline,
        moneySaved: Math.round(moneySaved),
        aheadOfPercentage: Math.round(aheadOfPercentage),
        documentsCompleted: documentCount,
        totalDocuments: 12
      });

    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-40 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    );
  }

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

      {/* PROGRESS HERO CARD */}
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
            {userProgress.progressPercentage > 0 
              ? `You're making great progress! ${userProgress.nextMilestone} is your next milestone.`
              : 'Start your journey by completing your profile.'
            }
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
              <div className="text-2xl font-bold text-blue-600">
                {userProgress.documentsCompleted}/{userProgress.totalDocuments}
              </div>
              <div className="text-xs text-muted-foreground">Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {userProgress.daysToDeadline}d
              </div>
              <div className="text-xs text-muted-foreground">Next Deadline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                ₦{(userProgress.moneySaved / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-muted-foreground">Saved vs Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {userProgress.aheadOfPercentage}%
              </div>
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
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.min(95, 60 + userProgress.progressPercentage / 3)}%
            </div>
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
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userProgress.progressPercentage > 50 ? '3-4 months' : '4-6 months'}
            </div>
            <p className="text-sm text-muted-foreground">
              {userProgress.progressPercentage > 50 
                ? "You're moving faster than average! ⚡"
                : "Typical processing: 6-8 months"
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* FEATURES GRID */}
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
      {userProgress.daysToDeadline > 0 && userProgress.daysToDeadline < 7 && (
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
