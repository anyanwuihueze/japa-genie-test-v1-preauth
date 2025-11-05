'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, Upload, Users, Target, Clock, FileText, AlertCircle, CheckCircle, ArrowRight, Calendar, MapPin, BookOpen, Briefcase, Heart, Plane } from 'lucide-react';
import Link from 'next/link';
import { DocumentUpload } from '@/components/dashboard/document-upload';
import { ProofOfFundsCard } from '@/components/dashboard/proof-of-funds-card';
import VisaPulseTicker from '@/components/visa-pulse-ticker';

interface DashboardClientProps {
  user: any;
  userProfile?: any;
}

interface VisaProgress {
  progress_percentage: number;
  visa_type: string;
  target_country: string;
  completed_documents: string[];
  missing_documents: string[];
  current_milestone: string;
  estimated_timeline: string;
}

export default function DashboardClient({ user, userProfile }: DashboardClientProps) {
  const [progress, setProgress] = useState(0);
  const [visaProgress, setVisaProgress] = useState<VisaProgress | null>(null);
  const [metrics, setMetrics] = useState({
    documentsCompleted: 0,
    totalDocuments: 12,
    daysToDeadline: 30,
    moneySaved: 2400000,
    aheadOfPercentage: 50,
    nextMilestone: "Complete Your Profile",
    successProbability: 65
  });

  const supabase = createClient();

  useEffect(() => {
    if (userProfile) {
      calculateProgress(userProfile);
      loadVisaProgress();
    }
  }, [userProfile]);

  // NEW: Load visa-specific progress from database
  const loadVisaProgress = async () => {
    if (!user) return;

    try {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (progressData) {
        setVisaProgress(progressData);
        setProgress(progressData.progress_percentage || 0);
        
        // Update metrics with real data
        setMetrics(prev => ({
          ...prev,
          documentsCompleted: progressData.completed_documents?.length || 0,
          totalDocuments: (progressData.completed_documents?.length || 0) + (progressData.missing_documents?.length || 0),
          nextMilestone: progressData.current_milestone || "Complete Your Profile",
          successProbability: Math.min(95, 65 + (progressData.progress_percentage || 0) / 2)
        }));
      }
    } catch (error) {
      console.error('Error loading visa progress:', error);
    }
  };

  const calculateProgress = (profile: any) => {
    if (visaProgress) return; // Use real progress if available

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

  // NEW: Get visa type icon
  const getVisaIcon = (visaType: string) => {
    switch (visaType?.toLowerCase()) {
      case 'student': return <BookOpen className="w-5 h-5" />;
      case 'work': return <Briefcase className="w-5 h-5" />;
      case 'tourist': return <Plane className="w-5 h-5" />;
      case 'family': return <Heart className="w-5 h-5" />;
      case 'business': return <Briefcase className="w-5 h-5" />;
      case 'asylum': return <AlertCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  // NEW: Get timeline estimate based on visa type
  const getTimelineEstimate = (visaType: string, country: string) => {
    const timelines: any = {
      student: { canada: '12-16 weeks', usa: '8-12 weeks', uk: '3-6 weeks', general: '8-12 weeks' },
      work: { canada: '8-12 weeks', usa: '6-10 weeks', uk: '4-8 weeks', general: '6-10 weeks' },
      tourist: { canada: '4-8 weeks', usa: '3-6 weeks', uk: '3-5 weeks', general: '4-6 weeks' },
      business: { canada: '4-8 weeks', usa: '3-6 weeks', uk: '3-5 weeks', general: '4-6 weeks' },
      family: { canada: '12-24 months', usa: '10-18 months', uk: '6-12 months', general: '12-18 months' },
      asylum: { canada: 'Varies (Expedited)', usa: 'Varies', uk: 'Varies', general: 'Case-dependent' }
    };
    
    const countryKey = country?.toLowerCase() || 'general';
    return timelines[visaType?.toLowerCase()]?.[countryKey] || timelines[visaType?.toLowerCase()]?.general || '4-8 weeks';
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          {visaProgress?.visa_type && getVisaIcon(visaProgress.visa_type)}
          <h1 className="text-4xl font-bold">
            {visaProgress ? (
              <>Your {visaProgress.visa_type} Journey to {visaProgress.target_country}</>
            ) : userProfile?.destination_country ? (
              <>Your Journey to {userProfile.destination_country}</>
            ) : (
              'Your Visa Dashboard'
            )}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-2">
          {progress < 20 
            ? "Let's get started! Complete your profile to begin." 
            : progress < 50 
            ? "Great start! Keep building your application."
            : "You're making excellent progress! Almost there."
          }
          {visaProgress?.current_milestone && (
            <span className="block text-sm text-blue-600 mt-1">
              Current: {visaProgress.current_milestone}
            </span>
          )}
        </p>
      </header>

      <VisaPulseTicker />

      {/* Enhanced Progress Card with Visa Details */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {visaProgress ? `${visaProgress.visa_type} Visa Progress` : 'Overall Progress'}
            </CardTitle>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800">{progress}% Complete</Badge>
              {visaProgress && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {visaProgress.target_country}
                </Badge>
              )}
              {progress > 25 && (
                <Badge className="bg-orange-100 text-orange-800">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Ahead of {metrics.aheadOfPercentage}%
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {visaProgress ? (
              <div className="flex items-center gap-4">
                <span>Next: {metrics.nextMilestone}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Timeline: {getTimelineEstimate(visaProgress.visa_type, visaProgress.target_country)}
                </span>
              </div>
            ) : (
              `Next: ${metrics.nextMilestone} • ${metrics.daysToDeadline} days until deadline`
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Getting Started</span>
            <span>Visa Approved</span>
          </div>

          {/* Visa-Specific Document Tracking */}
          {visaProgress && visaProgress.missing_documents && visaProgress.missing_documents.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <h4 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Missing Required Documents
              </h4>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {visaProgress.missing_documents.slice(0, 4).map((doc, index) => (
                  <div key={index} className="flex items-center gap-1 text-amber-700">
                    <AlertCircle className="w-3 h-3" />
                    {doc}
                  </div>
                ))}
                {visaProgress.missing_documents.length > 4 && (
                  <div className="text-amber-600">
                    +{visaProgress.missing_documents.length - 4} more...
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Metrics with Visa Context */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {metrics.documentsCompleted}/{metrics.totalDocuments}
            </div>
            <div className="text-sm text-muted-foreground">Documents</div>
            {visaProgress && (
              <div className="text-xs text-green-600 mt-1">
                {visaProgress.completed_documents?.length || 0} verified
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">
              {getTimelineEstimate(visaProgress?.visa_type, visaProgress?.target_country).split(' ')[0]}
            </div>
            <div className="text-sm text-muted-foreground">Est. Timeline</div>
            <div className="text-xs text-muted-foreground mt-1">
              {visaProgress?.visa_type || 'Visa'}
            </div>
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
            {visaProgress && (
              <div className="text-xs text-orange-600 mt-1">
                Based on {visaProgress.target_country} requirements
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visa-Specific Guidance */}
      {visaProgress?.visa_type && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                <CardTitle className="text-lg">Visa Success Probability</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {metrics.successProbability}%
              </div>
              <p className="text-sm text-muted-foreground">
                Based on your current progress and {visaProgress.target_country} {visaProgress.visa_type} visa requirements
              </p>
              {visaProgress.missing_documents && visaProgress.missing_documents.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-50 rounded text-xs">
                  <strong>Improve to 85%+ by completing:</strong>
                  <div className="mt-1">
                    {visaProgress.missing_documents.slice(0, 2).map((doc, i) => (
                      <div key={i}>• {doc}</div>
                    ))}
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
                {getTimelineEstimate(visaProgress.visa_type, visaProgress.target_country)}
              </div>
              <p className="text-sm text-muted-foreground">
                {progress > 70 ? 'You\'re moving fast! Maintain momentum. ⚡' : 
                 progress > 40 ? 'Good pace! Keep uploading required documents.' : 
                 `Typical processing for ${visaProgress.visa_type} visa to ${visaProgress.target_country}`}
              </p>
              {visaProgress.missing_documents && visaProgress.missing_documents.length > 0 && (
                <div className="mt-2 text-xs text-blue-600">
                  <strong>Next:</strong> Upload {visaProgress.missing_documents[0]}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Rest of your existing dashboard components */}
      <div className="grid md:grid-cols-3 gap-6">
        <DocumentUpload />
        <div id="proof-of-funds-section" className="scroll-mt-20">
          <ProofOfFundsCard userId={user.id} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Expert Help
            </CardTitle>
            <CardDescription>Get 1-on-1 guidance when you're stuck</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <Link href="/experts">Find Visa Experts</Link>
            </Button>
            {visaProgress && (
              <div className="text-xs text-muted-foreground text-center">
                Specialists in {visaProgress.target_country} {visaProgress.visa_type} visas
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          {visaProgress?.missing_documents && visaProgress.missing_documents.length > 0 && (
            <CardDescription>
              Priority: Upload {visaProgress.missing_documents[0]}
            </CardDescription>
          )}
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