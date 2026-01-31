'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, MapPin, Calendar, Flag, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedProfileCardProps {
  className?: string;
  onProfileUpdate?: () => void;
}

export function EnhancedProfileCard({ className, onProfileUpdate }: EnhancedProfileCardProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData('');
  
  // Profile completeness calculation - DYNAMIC
  const requiredFields = ['country', 'destination_country', 'visa_type', 'age'];
  const filledFields = requiredFields.filter(field => dashboardData.userProfile?.[field]).length;
  const profileComplete = (filledFields / requiredFields.length) * 100;

  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
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

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="text-center py-8 text-red-500">
          Error loading profile data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <User className="w-5 h-5" />
          Your Profile Progress
        </CardTitle>
        <div className={`flex justify-between items-center ${isMobile ? 'text-sm' : 'text-base'}`}>
          <span className="text-muted-foreground">Overall Progress</span>
          <Badge variant="outline" className="bg-blue-50">
            {Math.round(profileComplete)}%
          </Badge>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          {/* Progress Bar - DYNAMIC VALUE */}
          <Progress value={profileComplete} className="w-full h-2" />

          {/* Profile Fields - DYNAMIC VALUES */}
          <div className="space-y-3">
            <ProfileItem
              icon={<MapPin className="w-4 h-4" />}
              label="Current Country"
              value={dashboardData.userProfile?.country || 'Not set'}
              isComplete={!!dashboardData.userProfile?.country}
              isMobile={isMobile}
            />
            <ProfileItem
              icon={<Flag className="w-4 h-4" />}
              label="Destination"
              value={dashboardData.userProfile?.destination_country || 'Not set'}
              isComplete={!!dashboardData.userProfile?.destination_country}
              isMobile={isMobile}
            />
            <ProfileItem
              icon={<FileText className="w-4 h-4" />}
              label="Visa Type"
              value={dashboardData.userProfile?.visa_type || 'Not set'}
              isComplete={!!dashboardData.userProfile?.visa_type}
              isMobile={isMobile}
            />
            <ProfileItem
              icon={<Calendar className="w-4 h-4" />}
              label="Age"
              value={dashboardData.userProfile?.age ? `${dashboardData.userProfile.age} years` : 'Not set'}
              isComplete={!!dashboardData.userProfile?.age}
              isMobile={isMobile}
            />
          </div>

          {/* Completion Status - DYNAMIC */}
          {profileComplete === 100 ? (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Profile Complete!</p>
                  <p className="text-green-700 text-sm">
                    All required information has been provided
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">
                    {requiredFields.length - filledFields} fields remaining
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Complete your profile to unlock personalized features
                  </p>
                </div>
              </div>
            </div>
          )}

          <Button asChild className="w-full" onClick={onProfileUpdate}>
            <Link href="/profile">
              {profileComplete === 100 ? 'View Profile' : 'Edit Profile'}
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
  isMobile 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string;
  isComplete: boolean;
  isMobile: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className={`font-medium ${isMobile ? 'text-sm' : 'text-base'}`}>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`${isMobile ? 'text-sm' : 'text-base'} ${value === 'Not set' ? 'text-muted-foreground' : 'text-gray-900'}`}>
          {value}
        </span>
        {isComplete ? (
          <CheckCircle className="w-4 h-4 text-green-500" />
        ) : (
          <AlertCircle className="w-4 h-4 text-yellow-500" />
        )}
      </div>
    </div>
  );
}
