'use client';

import { useState, useEffect } from 'react';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Wallet, Lock, ArrowRight, TrendingUp, 
  CheckCircle, AlertCircle, LockOpen, Info 
} from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

export function POFTrackerCard({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData();
  const [localProfile, setLocalProfile] = useState<any>(null);

  // Check session storage for immediate updates
  useEffect(() => {
    const kycData = sessionStorage.getItem('kycData');
    if (kycData) {
      setLocalProfile(JSON.parse(kycData));
    }
  }, []);

  // Use merged data
  const profile = localProfile || dashboardData.userProfile;

  // Check if profile has required fields
  const hasDestination = !!profile?.destination_country;
  const hasVisaType = !!profile?.visa_type;
  const isProfileComplete = hasDestination && hasVisaType;

  // Calculate POF progress (mock calculation - replace with real data)
  const pofProgress = 0; // Will be calculated from real POF data
  const currentSeason = 1;
  const totalSeasons = 3;

  if (!isProfileComplete) {
    return (
      <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} border-dashed border-2`}>
        <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2 text-gray-400`}>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            Proof of Funds Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Complete Your Profile to Unlock
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
              Set your destination country and visa type to activate the Proof of Funds tracking system
            </p>
            
            <div className="space-y-2 text-left max-w-xs mx-auto mb-6">
              <div className={`flex items-center gap-2 text-sm ${hasDestination ? 'text-green-600' : 'text-gray-400'}`}>
                {hasDestination ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Destination country {hasDestination ? 'set' : 'required'}
              </div>
              <div className={`flex items-center gap-2 text-sm ${hasVisaType ? 'text-green-600' : 'text-gray-400'}`}>
                {hasVisaType ? <CheckCircle className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Visa type {hasVisaType ? 'selected' : 'required'}
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/kyc-profile">
                Complete Profile
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Profile is complete - show actual POF tracker
  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} border-blue-200 ring-2 ring-blue-50`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Wallet className="w-5 h-5" />
            </div>
            Proof of Funds Tracker
          </CardTitle>
          <Badge className="bg-blue-100 text-blue-700">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Current Season</span>
              <Badge className="bg-blue-200 text-blue-800">
                Season {currentSeason} of {totalSeasons}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-blue-900">₦0</p>
            <p className="text-sm text-blue-700">Available funds tracked</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Season Progress</span>
              <span className="font-medium">{pofProgress}%</span>
            </div>
            <Progress value={pofProgress} className="w-full h-2" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Season 1</p>
              <p className="font-semibold text-sm">Locked</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Season 2</p>
              <p className="font-semibold text-sm text-gray-400">Locked</p>
            </div>
          </div>

          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-yellow-800">
              Upload your bank statements to track your Proof of Funds seasoning progress
            </p>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/pof-tracker">
              View Full Tracker
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
