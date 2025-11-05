'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, Upload, Users, Target, Clock, FileText, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { ProofOfFundsCard } from '@/components/dashboard/proof-of-funds-card';
import VisaPulseTicker from '@/components/visa-pulse-ticker';

// ADD USERPROFILE PROP (NEW)
interface DashboardClientProps {
  user: any;
  userProfile?: any; // ADD THIS LINE
}

export default function DashboardClient({ user, userProfile }: DashboardClientProps) { // ADD userProfile HERE
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

  // REPLACE ENTIRE useEffect (UPDATE):
  useEffect(() => {
    if (userProfile) {
      calculateProgress(userProfile);
    }
  }, [userProfile]); // RUN WHEN USERPROFILE CHANGES

  const calculateProgress = (profile: any) => {
    let currentProgress = 0;
    let nextMilestone = "Complete Your Profile";

    if (profile?.destination_country && profile?.visa_type) {
      currentProgress += 25;
      nextMilestone = "Upload Key Documents";
    }
    
    const docsCompleted = 3; 
    currentProgress += (docsCompleted / metrics.totalDocuments) * 50;
    
    if (docsCompleted > 5) {
        nextMilestone = "Practice Mock Interview";
    }
    
    setProgress(Math.round(currentProgress));
    setMetrics(prev => ({
        ...prev,
        documentsCompleted: docsCompleted,
        nextMilestone: nextMilestone,
        successProbability: 65 + Math.round(currentProgress / 4)
    }));
  };

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

      <VisaPulseTicker />

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Overall Progress</CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">{progress}% Complete</Badge>
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
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6 text-center">
          <div className="text-2xl font-bold text-blue-600">{metrics.documentsCompleted}/{metrics.totalDocuments}</div>
          <div className="text-sm text-muted-foreground">Documents</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <div className="text-2xl font-bold text-green-600">{metrics.daysToDeadline}d</div>
          <div className="text-sm text-muted-foreground">Next Deadline</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <div className="text-2xl font-bold text-purple-600">₦{(metrics.moneySaved / 1000000).toFixed(1)}M</div>
          <div className="text-sm text-muted-foreground">Saved vs Agents</div>
        </CardContent></Card>
        <Card><CardContent className="pt-6 text-center">
          <div className="text-2xl font-bold text-orange-600">{metrics.successProbability}%</div>
          <div className="text-sm text-muted-foreground">Success Chance</div>
        </CardContent></Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-green-200"><CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Target className="w-5 h-5 text-green-600" /><CardTitle className="text-lg">Success Probability</CardTitle></div>
        </CardHeader><CardContent>
          <div className="text-3xl font-bold text-green-600 mb-2">{metrics.successProbability}%</div>
          <p className="text-sm text-muted-foreground">Based on your current progress and {userProfile?.destination_country || 'target country'} requirements</p>
        </CardContent></Card>

        <Card className="border-blue-200"><CardHeader className="pb-3">
          <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-blue-600" /><CardTitle className="text-lg">Recommended Timeline</CardTitle></div>
        </CardHeader><CardContent>
          <div className="text-2xl font-bold text-blue-600 mb-2">{progress > 70 ? '2-3 months' : progress > 40 ? '3-5 months' : '4-6 months'}</div>
          <p className="text-sm text-muted-foreground">{progress > 70 ? 'You\'re moving fast! Maintain momentum. ⚡' : progress > 40 ? 'Good pace! Keep uploading documents.' : 'Typical processing time. Start strong!'}</p>
        </CardContent></Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <DocumentUpload />
        <div id="proof-of-funds-section" className="scroll-mt-20"><ProofOfFundsCard userId={user.id} /></div>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Expert Help</CardTitle>
            <CardDescription>Get 1-on-1 guidance when you're stuck</CardDescription></CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600"><Link href="/experts">Find Visa Experts</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Button asChild variant="outline"><Link href="/chat">Ask AI Assistant</Link></Button>
            <Button asChild variant="outline"><Link href="/interview">Practice Interview</Link></Button>
            <Button asChild variant="outline"><Link href="/progress">View Full Timeline</Link></Button>
            <Button asChild variant="outline"><Link href="/document-check">Upload Documents</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}