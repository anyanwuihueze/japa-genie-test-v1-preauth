// Your existing EnhancedProfileCard file - REPLACE ENTIRE CONTENT WITH THIS
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  User,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Clock,
  DollarSign,
  Edit,
  Plane,
  Target,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

interface EnhancedProfileCardProps {
  userProfile: any;
}

export function EnhancedProfileCard({ userProfile }: EnhancedProfileCardProps) {
  // 🚨 FORCE REFRESH WHEN MOUNTED
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Don't render until mounted

  // Calculate EXACTLY what's missing
  const requiredFields = [
    { key: 'country', label: 'Country', icon: MapPin },
    { key: 'destination_country', label: 'Destination', icon: Target },
    { key: 'age', label: 'Age', icon: Calendar },
    { key: 'visa_type', label: 'Visa Type', icon: GraduationCap },
    { key: 'user_type', label: 'Profile Type', icon: User },
    { key: 'timeline_urgency', label: 'Timeline', icon: Clock },
  ];

  const filledFields = requiredFields.filter(field => 
    userProfile?.[field.key] && userProfile[field.key].toString().trim() !== ''
  ).length;

  const totalFields = requiredFields.length;
  const completion = Math.round((filledFields / totalFields) * 100);
  const missingFields = requiredFields.filter(field => 
    !userProfile?.[field.key] || userProfile[field.key].toString().trim() === ''
  );

  // Helper functions (keep your existing ones)
  const getUserTypeDisplay = (type: string) => {
    const types: Record<string, { icon: string; label: string }> = {
      student: { icon: '🎓', label: 'Student' },
      professional: { icon: '💼', label: 'Working Professional' },
      business_owner: { icon: '🏢', label: 'Business Owner' },
      tourist: { icon: '✈️', label: 'Tourist/Visitor' },
      career_changer: { icon: '🔄', label: 'Career Changer' },
      family_migrant: { icon: '🏠', label: 'Family Migrant' },
    };
    return types[type] || { icon: '👤', label: type };
  };

  const getTimelineDisplay = (timeline: string) => {
    const timelines: Record<string, string> = {
      asap: '🚀 ASAP (0-3 months)',
      '3-6_months': '📅 3-6 months',
      '6-12_months': '🗓️ 6-12 months',
      exploring: '🔍 Exploring options',
    };
    return timelines[timeline] || timeline;
  };

  // Empty state - Profile very incomplete
  if (completion < 50) {
    return (
      <Card className="border-2 border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
        <CardHeader className="relative z-10 text-center pb-3">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <AlertCircle className="w-6 h-6 text-orange-600" />
            Complete Your Profile
          </CardTitle>
          <CardDescription className="text-lg">
            {filledFields === 0 ? 'Get started with your visa journey' : `${filledFields}/${totalFields} fields completed`}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 text-center">
          <div className="mb-4">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-sm text-muted-foreground mb-2">
              Complete your profile for personalized visa guidance
            </p>
            {missingFields.length > 0 && (
              <div className="text-xs text-orange-600 mb-3">
                Missing: {missingFields.map(f => f.label).join(', ')}
              </div>
            )}
            <Progress value={completion} className="w-full h-2 mb-3" />
          </div>
          <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
            <Link href="/kyc">
              <Target className="w-4 h-4 mr-2" />
              {filledFields === 0 ? 'Start Profile' : 'Complete Profile'}
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Partially complete state
  if (completion < 100) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Your Profile Progress
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Progress value={completion} className="w-20 h-2" />
                <span>{completion}% complete</span>
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-orange-100 text-orange-800">
              {filledFields}/{totalFields}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Missing fields alert */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-orange-700 mb-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Complete your profile</span>
            </div>
            <p className="text-xs text-orange-600">
              Missing: {missingFields.map(f => f.label).join(', ')}
            </p>
          </div>

          {/* Current profile data */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            {userProfile?.country && (
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <div>
                  <div className="text-xs text-muted-foreground">From</div>
                  <div className="font-medium">{userProfile.country}</div>
                </div>
              </div>
            )}
            {userProfile?.destination_country && (
              <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <div>
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="font-medium">{userProfile.destination_country}</div>
                </div>
              </div>
            )}
          </div>

          <Button asChild className="w-full" variant="outline">
            <Link href="/kyc">
              <Edit className="w-4 h-4 mr-2" />
              Complete Missing Fields
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Complete profile state
  const userTypeInfo = getUserTypeDisplay(userProfile?.user_type);
  const timelineDisplay = getTimelineDisplay(userProfile?.timeline_urgency);

  return (
    <Card className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-green-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Profile Complete
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✅ All fields complete
              </Badge>
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/kyc-profile">
              <Edit className="w-3 h-3 mr-1" />
              Quick Update
            </Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Current data display */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs text-muted-foreground">From</div>
              <div className="font-medium">{userProfile?.country}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-muted-foreground">Destination</div>
              <div className="font-medium">{userProfile?.destination_country}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {userProfile?.age && (
            <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs text-muted-foreground">Age</div>
                <div className="font-medium">{userProfile.age} years</div>
              </div>
            </div>
          )}
          {userProfile?.visa_type && (
            <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <div>
                <div className="text-xs text-muted-foreground">Visa Type</div>
                <div className="font-medium">{userProfile.visa_type}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          {userProfile?.user_type && (
            <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
              <span className="text-base">{userTypeInfo.icon}</span>
              <div>
                <div className="text-xs text-muted-foreground">Profile</div>
                <div className="font-medium">{userTypeInfo.label}</div>
              </div>
            </div>
          )}
          {userProfile?.timeline_urgency && (
            <div className="flex items-center gap-2 bg-white/80 rounded-lg p-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <div className="text-xs text-muted-foreground">Timeline</div>
                <div className="font-medium">{timelineDisplay}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}