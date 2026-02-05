'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Banknote, 
  ShieldAlert,
  Calendar,
  RefreshCw,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { analyzeProofOfFunds, ProofOfFundsAnalysis } from '@/ai/flows/analyze-proof-of-funds';
import Link from 'next/link';

interface POFSeasoningTrackerProps {
  userId: string;
  userProfile: any;
}

interface AnalysisState {
  data: ProofOfFundsAnalysis | null;
  loading: boolean;
  error: string | null;
  isCached: boolean;
  lastUpdated: string | null;
}

export function POFSeasoningTracker({ userId, userProfile }: POFSeasoningTrackerProps) {
  const [localProfile, setLocalProfile] = useState<any>(null);

  useEffect(() => {
    const kycData = sessionStorage.getItem("kycData");
    if (kycData) {
      const parsed = JSON.parse(kycData);
      setLocalProfile({
        destination_country: parsed.destination,
        visa_type: parsed.visaType,
        nationality: parsed.country,
        family_size: 1
      });
    }
  }, []);

  const activeProfile = localProfile || userProfile;

  const [analysis, setAnalysis] = useState<AnalysisState>({
    data: null,
    loading: false,
    error: null,
    isCached: false,
    lastUpdated: null
  });

  const isProfileComplete = activeProfile?.destination_country && activeProfile?.visa_type;

  const mockFinancialData = {
    bankAccounts: [
      { bank: 'Sample Bank', balance: 25000, currency: 'USD', opened: '2024-01-15' },
      { bank: 'Savings Account', balance: 15000, currency: 'USD', opened: '2023-11-01' }
    ],
    totalAssets: 40000,
    lastUpdated: new Date().toISOString()
  };

  const loadAnalysis = async (forceRefresh = false) => {
    if (!isProfileComplete) {
      setAnalysis({
        data: null,
        loading: false,
        error: 'Complete your profile first',
        isCached: false,
        lastUpdated: null
      });
      return;
    }

    try {
      setAnalysis(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await analyzeProofOfFunds({
        userProfile: {
          destination_country: activeProfile.destination_country,
          visa_type: activeProfile.visa_type,
          nationality: activeProfile.nationality || activeProfile.country,
          family_size: activeProfile.family_size || 1
        },
        financialData: mockFinancialData,
        familyMembers: activeProfile.family_size || 1
      });

      if (result.success && result.analysis) {
        setAnalysis({
          data: result.analysis,
          loading: false,
          error: null,
          isCached: result.isCached || false,
          lastUpdated: new Date().toISOString()
        });
      } else {
        throw new Error(result.error || 'Analysis failed');
      }
    } catch (error: any) {
      console.error('POF Analysis error:', error);
      setAnalysis({
        data: null,
        loading: false,
        error: 'AI analysis in progress. Showing estimates.',
        isCached: false,
        lastUpdated: null
      });
    }
  };

  useEffect(() => {
    if (isProfileComplete) {
      loadAnalysis();
    }
  }, [activeProfile?.destination_country, activeProfile?.visa_type]);

  // Early return for incomplete profile
  if (!isProfileComplete) {
    return (
      <Card className="h-full border-dashed border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Proof of Funds Tracker
          </CardTitle>
          <CardDescription>Complete profile to enable POF analysis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-6">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Profile Incomplete</h3>
            <p className="text-muted-foreground mb-4">
              Set destination country and visa type
            </p>
            <Button asChild>
              <Link href="/kyc-profile">Complete Profile</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (analysis.loading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-5 h-5" />
            Proof of Funds Tracker
          </CardTitle>
          <CardDescription>Analyzing financial readiness...</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const hasValidData = analysis.data && analysis.data.summary && analysis.data.financialAnalysis;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-5 h-5" />
              Proof of Funds Tracker
              {analysis.isCached && (
                <Badge variant="outline" className="text-xs bg-green-50">Cached</Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {activeProfile.destination_country} {activeProfile.visa_type} Visa
              {hasValidData && (
                <Badge 
                  variant={analysis.data.summary.meetsRequirements ? "default" : "destructive"} 
                  className="text-xs"
                >
                  {analysis.data.summary.meetsRequirements ? 'Meets Requirements' : 'Needs Improvement'}
                </Badge>
              )}
            </CardDescription>
          </div>
          {!analysis.loading && (
            <Button onClick={() => loadAnalysis(true)} variant="ghost" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Error State */}
        {analysis.error && !hasValidData && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900">Analysis Pending</h4>
                <p className="text-sm text-amber-800 mt-1">
                  {analysis.error}
                </p>
                <Button 
                  onClick={() => loadAnalysis(true)} 
                  variant="outline" 
                  size="sm"
                  className="mt-3"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry Analysis
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Valid Data Display */}
        {hasValidData ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {analysis.data.summary.riskLevel === 'high' ? (
                  <ShieldAlert className="w-5 h-5 text-red-500" />
                ) : analysis.data.summary.riskLevel === 'medium' ? (
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
                <span className="font-medium">Risk Level: </span>
                <Badge 
                  variant="outline" 
                  className={`
                    ${analysis.data.summary.riskLevel === 'high' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                    ${analysis.data.summary.riskLevel === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                    ${analysis.data.summary.riskLevel === 'low' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                  `}
                >
                  {analysis.data.summary.riskLevel.toUpperCase()}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Confidence: {analysis.data.summary.confidence}%
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Account Seasoning</span>
                  <span>
                    {analysis.data.financialAnalysis.seasoningDays}/
                    {analysis.data.financialAnalysis.seasoningRequired} days
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (analysis.data.financialAnalysis.seasoningDays / analysis.data.financialAnalysis.seasoningRequired) * 100)} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.data.financialAnalysis.seasoningStatus === 'meets' ? '✓ Meets requirement' : 
                   analysis.data.financialAnalysis.seasoningStatus === 'risky' ? '⚠️ Needs more time' : 
                   '❌ Insufficient seasoning'}
                </p>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">Minimum Funds</span>
                  <span>
                    {analysis.data.financialAnalysis.currency} {analysis.data.financialAnalysis.liquidAssets.toLocaleString()}/
                    {analysis.data.embassySpecific.minimumFunds.toLocaleString()}
                  </span>
                </div>
                <Progress 
                  value={Math.min(100, (analysis.data.financialAnalysis.liquidAssets / analysis.data.embassySpecific.minimumFunds) * 100)} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.data.financialAnalysis.liquidAssets >= analysis.data.embassySpecific.minimumFunds 
                    ? '✓ Meets requirement' 
                    : `❌ ${(analysis.data.embassySpecific.minimumFunds - analysis.data.financialAnalysis.liquidAssets).toLocaleString()} ${analysis.data.financialAnalysis.currency} needed`}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold">
                  {analysis.data.financialAnalysis.totalAssets.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Total Assets</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {analysis.data.financialAnalysis.liquidAssets.toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Liquid Funds</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.data.financialAnalysis.stabilityScore}/10
                </div>
                <div className="text-xs text-muted-foreground">Stability Score</div>
              </div>
            </div>
          </>
        ) : (
          /* No Data State */
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Upload Documents for Analysis</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload bank statements to get personalized POF analysis
            </p>
          </div>
        )}

        <div className="pt-4">
          <Button asChild className="w-full">
            <Link href="/document-check">
              {hasValidData ? 'Update Financial Documents' : 'Upload Bank Statements'}
            </Link>
          </Button>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {analysis.lastUpdated 
                ? `Updated ${new Date(analysis.lastUpdated).toLocaleDateString()}` 
                : 'Awaiting analysis'}
            </div>
            <button onClick={() => loadAnalysis(true)} className="text-blue-600 hover:underline">
              Refresh
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
