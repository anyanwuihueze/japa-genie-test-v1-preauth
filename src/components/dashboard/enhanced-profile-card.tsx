'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, MapPin, Flag, FileText, CheckCircle, 
  AlertCircle, RefreshCw, Clock 
} from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface EnhancedProfileCardProps {
  className?: string;
  onProfileUpdate?: () => void;
}

export function EnhancedProfileCard({ className, onProfileUpdate }: EnhancedProfileCardProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData();
  const [localProfile, setLocalProfile] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // CRITICAL FIELDS ONLY
  const requiredFields = ['destination_country', 'visa_type'];
  
  // Check for session storage data first (for immediate updates after KYC)
  useEffect(() => {
    const kycData = sessionStorage.getItem('kycData');
    const kycJustCompleted = sessionStorage.getItem('kycJustCompleted');
    
    if (kycData) {
      const parsed = JSON.parse(kycData);
      setLocalProfile({
        country: parsed.country,
        destination_country: parsed.destination,
        visa_type: parsed.visaType,
        alternative_countries: parsed.alternativeCountries,
        kyc_completed: true
      });
      
      // Clear the flag after reading
      console.log('Using sessionStorage profile data:', parsed);
    }
  }, []);

  // Merge local data with dashboard data
  const profile = localProfile || dashboardData.userProfile;
  
  // Calculate completion based on merged data
  const filledFields = requiredFields.filter(field => profile?.[field]).length;
  const profileComplete = (filledFields / requiredFields.length) * 100;
  const isComplete = profileComplete === 100;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Force re-fetch
    window.location.reload();
  };

  if (dashboardData.loading && !localProfile) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (dashboardData.error && !localProfile) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2" />
          <p>Error loading profile data</p>
          <Button onClick={handleRefresh} variant="outline" className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} ${isComplete ? 'border-green-200 ring-2 ring-green-50' : 'border-yellow-200 ring-2 ring-yellow-50'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="flex justify-between items-start">
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <div className={`p-2 rounded-lg ${isComplete ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
              <User className="w-5 h-5" />
            </div>
            Your Profile
          </CardTitle>
          {isComplete ? (
            <Badge className="bg-green-100 text-green-700 border-green-200">
              <CheckCircle className="w-3 h-3 mr-1" />
              Complete
            </Badge>
          ) : (
            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
              <Clock className="w-3 h-3 mr-1" />
              {Math.round(profileComplete)}%
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          <div className="relative">
            <Progress 
              value={profileComplete} 
              className="w-full h-2" 
            />
            {isComplete && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="space-y-3">
            <ProfileItem
              icon={<MapPin className="w-4 h-4" />}
              label="From"
              value={profile?.country || 'Not set'}
              isComplete={!!profile?.country}
              isMobile={isMobile}
            />
            <ProfileItem
              icon={<Flag className="w-4 h-4" />}
              label="Destination"
              value={profile?.destination_country || 'Not set'}
              isComplete={!!profile?.destination_country}
              isMobile={isMobile}
              isRequired
            />
            <ProfileItem
              icon={<FileText className="w-4 h-4" />}
              label="Visa Type"
              value={profile?.visa_type ? formatVisaType(profile.visa_type) : 'Not set'}
              isComplete={!!profile?.visa_type}
              isMobile={isMobile}
              isRequired
            />
          </div>

          {isComplete ? (
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Profile Complete!</p>
                  <p className="text-green-700 text-sm mt-0.5">
                    All required information provided. POF tracker unlocked.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 rounded-full mt-0.5">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-yellow-900">
                    {requiredFields.length - filledFields} required field{requiredFields.length - filledFields === 1 ? '' : 's'} remaining
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Complete to unlock Proof of Funds tracker and personalized guidance
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button asChild className={`w-full ${isComplete ? 'bg-green-600 hover:bg-green-700' : ''}`}>
            <Link href="/kyc-profile" onClick={onProfileUpdate}>
              {isComplete ? 'Update Profile' : 'Complete Profile Now'}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileItem({ 
  icon, 
  label, 
  value, 
  isComplete,
  isMobile,
  isRequired = false
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  isComplete: boolean;
  isMobile: boolean;
  isRequired?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between p-3 rounded-lg ${isComplete ? 'bg-green-50/50' : 'bg-gray-50'} transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={isComplete ? 'text-green-600' : 'text-gray-400'}>
          {icon}
        </div>
        <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`${isMobile ? 'text-sm' : 'text-base'} ${!isComplete ? 'text-muted-foreground' : 'text-gray-900 font-medium'}`}>
          {value}
        </span>
        {isComplete ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-yellow-400" />
        )}
      </div>
    </div>
  );
}

function formatVisaType(type: string): string {
  const types: Record<string, string> = {
    'student': 'Student Visa',
    'work': 'Work Visa',
    'tourist': 'Tourist Visa',
    'business': 'Business Visa',
    'family': 'Family Visa'
  };
  return types[type] || type.charAt(0).toUpperCase() + type.slice(1);
}
