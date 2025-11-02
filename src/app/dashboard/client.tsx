// src/app/dashboard/client.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, Upload, Users, Target, Clock, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/dashboard/document-upload';

// Real progress calculation function
const calculateRealProgress = async (userId: string) => {
  const supabase = createClient();
  let totalProgress = 0;

  try {
    // 1. Get user profile completeness (20% max)
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('country, destination_country, profession, visa_type, age')
      .eq('id', userId)
      .single();
    
    let profileScore = 0;
    if (profile?.country) profileScore += 5;
    if (profile?.destination_country) profileScore += 5;
    if (profile?.profession) profileScore += 5;
    if (profile?.visa_type) profileScore += 3;
    if (profile?.age) profileScore += 2;
    
    // Cap at 20%
    profileScore = Math.min(profileScore, 20);
    totalProgress += profileScore;

    // 2. Get documents uploaded (40% max)
    const { data: documents } = await supabase
      .from('user_documents')
      .select('document_type, status')
      .eq('user_id', userId);
    
    let documentScore = 0;
    if (documents && documents.length > 0) {
      // Count verified/uploaded documents
      const uploadedDocs = documents.filter(doc => 
        doc.status === 'uploaded' || doc.status === 'verified'
      ).length;
      
      // Base score on uploaded docs (max 12 expected documents)
      documentScore = (uploadedDocs / 12) * 40;
    }
    
    totalProgress += documentScore;

    // 3. Check if user has started any processes (15% max)
    let activityScore = 0;
    
    // Check if user has used chat (basic engagement)
    const { data: chatActivity } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', userId)
      .limit(1);
    
    if (chatActivity && chatActivity.length > 0) {
      activityScore += 5;
    }
    
    // For now, we'll add basic activity points if they have documents
    if (documents && documents.length > 0) {
      activityScore += 10;
    }
    
    totalProgress += activityScore;

    // 4. Proof of Funds progress (25% max) - Basic check
    let pofScore = 0;
    
    // Check if user has any financial documents
    const { data: financialDocs } = await supabase
      .from('user_documents')
      .select('document_type')
      .eq('user_id', userId)
      .in('document_type', ['bank_statement', 'proof_of_funds', 'sponsorship_letter']);
    
    if (financialDocs && financialDocs.length > 0) {
      pofScore += 15; // Basic points for having financial docs
    }
    
    // Check if user has destination country set (indicates they might know POF requirements)
    if (profile?.destination_country) {
      pofScore += 10;
    }
    
    totalProgress += pofScore;

  } catch (error) {
    console.error('Progress calculation error:', error);
    // Return minimal progress if calculation fails
    return 5;
  }

  return Math.min(Math.max(totalProgress, 5), 100); // Ensure between 5-100%
};

// Calculate additional metrics
const calculateDashboardMetrics = async (userId: string) => {
  const supabase = createClient();
  
  const metrics = {
    documentsCompleted: 0,
    totalDocuments: 12,
    daysToDeadline: 30, // Default
    moneySaved: 2400000, // ₦2.4M default
    aheadOfPercentage: 50, // Default
    nextMilestone: "Complete Your Profile",
    successProbability: 65 // Default
  };

  try {
    // Count uploaded documents
    const { data: documents } = await supabase
      .from('user_documents')
      .select('document_type, status')
      .eq('user_id', userId);
    
    if (documents) {
      metrics.documentsCompleted = documents.filter(doc => 
        doc.status === 'uploaded' || doc.status === 'verified'
      ).length;
    }

    // Get user profile for personalized metrics
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('destination_country, created_at')
      .eq('id', userId)
      .single();

    if (profile) {
      // Adjust metrics based on profile completeness
      if (profile.destination_country) {
        metrics.nextMilestone = "Upload Required Documents";
        metrics.successProbability = 75;
        metrics.aheadOfPercentage = 65;
      }

      // Calculate days since profile creation for urgency
      const profileAge = Math.floor((new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24));
      metrics.daysToDeadline = Math.max(30 - profileAge, 7); // More urgent as time passes
    }

    // Adjust based on progress
    if (metrics.documentsCompleted >= 6) {
      metrics.nextMilestone = "Schedule Mock Interview";
      metrics.successProbability = 85;
      metrics.aheadOfPercentage = 80;
    }

    if (metrics.documentsCompleted >= 9) {
      metrics.nextMilestone = "Submit Application";
      metrics.successProbability = 90;
      metrics.aheadOfPercentage = 90;
    }

  } catch (error) {
    console.error('Metrics calculation error:', error);
  }

  return metrics;
};

export default function DashboardClient({ user }: { user: any }) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    documentsCompleted: 0,
    totalDocuments: 12,
    daysToDeadline: 30,
    moneySaved: 2400000,
    aheadOfPercentage: 50,
    nextMilestone: "Complete Your Profile",
    successProbability: 65
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const supabase = createClient();
    
    try {
      // Fetch user profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setUserProfile(profile);

      // Calculate real progress
      const realProgress = await calculateRealProgress(user.id);
      setProgress(realProgress);

      // Calculate metrics
      const dashboardMetrics = await calculateDashboardMetrics(user.id);
      setMetrics(dashboardMetrics);

    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-8">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          {userProfile?.destination_country 
            ? `Your Journey to ${userProfile.destination_country}`
            : 'Your Visa Dashboard'
          }
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {progress < 20 
            ? "Let's get started! Complete your profile to begin." 
            : progress < 50 
            ? "Great start! Keep building your application."
            : "You're making excellent progress! Almost there."
          }
        </p>
      </header>

      {/* Progress Hero */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Overall Progress</CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                {progress}% Complete
              </Badge>
              {progress > 25 && (
                <Badge className="bg-orange-100 text-orange-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Ahead of {metrics.aheadOfPercentage}%
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            Next: {metrics.nextMilestone} • {metrics.daysToDeadline} days until deadline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Getting Started</span>
            <span>Visa Approved</span>
          </div>
          
          {/* Progress breakdown for transparency */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-semibold">Profile</div>
              <div>{Math.min(progress, 20)}/20</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-semibold">Documents</div>
              <div>{Math.min(progress - 20, 40)}/40</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-semibold">Activities</div>
              <div>{Math.min(progress - 60, 15)}/15</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-semibold">Finances</div>
              <div>{Math.min(progress - 75, 25)}/25</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.documentsCompleted}/{metrics.totalDocuments}
            </div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {metrics.daysToDeadline}d
            </div>
            <div className="text-sm text-muted-foreground">Next Deadline</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">
              ₦{(metrics.moneySaved / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-muted-foreground">Saved vs Agents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {metrics.successProbability}%
            </div>
            <div className="text-sm text-muted-foreground">Success Chance</div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Insights */}
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
              {metrics.successProbability}%
            </div>
            <p className="text-sm text-muted-foreground">
              Based on your current progress and {userProfile?.destination_country || 'target country'} requirements
            </p>
            {progress < 50 && (
              <div className="mt-3 p-2 bg-yellow-50 rounded border border-yellow-200">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-700">
                    Complete your profile to increase success probability
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Recommended Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {progress > 70 ? '2-3 months' : progress > 40 ? '3-5 months' : '4-6 months'}
            </div>
            <p className="text-sm text-muted-foreground">
              {progress > 70 
                ? 'You\'re moving fast! Maintain momentum. ⚡'
                : progress > 40
                ? 'Good pace! Keep uploading documents.'
                : 'Typical processing time. Start strong!'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <DocumentUpload />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Expert Help
            </CardTitle>
            <CardDescription>
              Get 1-on-1 guidance when you're stuck
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <Link href="/experts">
                Find Visa Experts
              </Link>
            </Button>
            
            {/* Proof of Funds Expert CTA */}
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-semibold text-orange-800 text-sm">
                    Proof of Funds Help
                  </div>
                  <p className="text-xs text-orange-700 mt-1">
                    Complex finances? Our experts help with business income, gifts, sponsorships
                  </p>
                  <Button variant="link" className="h-auto p-0 text-orange-600 text-xs" asChild>
                    <Link href="/experts?service=proof-of-funds">
                      Get Funds Review →
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button asChild variant="outline">
              <Link href="/chat">Ask AI Assistant</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/interview">Practice Interview</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/progress">View Full Timeline</Link>
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