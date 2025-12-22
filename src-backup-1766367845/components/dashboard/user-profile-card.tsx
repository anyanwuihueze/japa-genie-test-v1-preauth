// src/components/dashboard/user-profile-card.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, Calendar, Briefcase, GraduationCap, Clock, DollarSign, Edit } from 'lucide-react';
import Link from 'next/link';

interface UserProfileCardProps {
  userProfile: any;
}

export function UserProfileCard({ userProfile }: UserProfileCardProps) {
  // Helper function to get user type display
  const getUserTypeDisplay = (type: string) => {
    const types: { [key: string]: { icon: string; label: string } } = {
      student: { icon: '🎓', label: 'Student' },
      professional: { icon: '💼', label: 'Working Professional' },
      business_owner: { icon: '🏢', label: 'Business Owner' },
      tourist: { icon: '✈️', label: 'Tourist/Visitor' },
      career_changer: { icon: '🔄', label: 'Career Changer' },
      family_migrant: { icon: '🏠', label: 'Family Migrant' }
    };
    return types[type] || { icon: '👤', label: type };
  };

  // Helper function to get timeline display
  const getTimelineDisplay = (timeline: string) => {
    const timelines: { [key: string]: string } = {
      asap: '🚀 ASAP (0-3 months)',
      '3-6_months': '📅 3-6 months',
      '6-12_months': '🗓️ 6-12 months',
      exploring: '🔍 Exploring options'
    };
    return timelines[timeline] || timeline;
  };

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      userProfile?.country,
      userProfile?.destination_country,
      userProfile?.age,
      userProfile?.visa_type,
      userProfile?.user_type,
      userProfile?.timeline_urgency
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const completion = calculateCompletion();
  const userTypeInfo = getUserTypeDisplay(userProfile?.user_type);
  const timelineDisplay = getTimelineDisplay(userProfile?.timeline_urgency);

  // If no KYC data, show prompt to complete profile
  if (!userProfile?.kyc_completed_at) {
    return (
      <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Get personalized visa advice by completing your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/kyc">
              <Edit className="w-4 h-4 mr-2" />
              Complete Profile
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Your Profile
            </CardTitle>
            <CardDescription>
              {completion}% complete • Last updated {new Date(userProfile.kyc_last_updated).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/kyc">
              <Edit className="w-3 h-3 mr-1" />
              Update
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Name and Age */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-600" />
            <span className="font-medium">{userProfile?.preferred_name || 'Not set'}</span>
          </div>
          {userProfile?.age && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {userProfile.age} years
            </Badge>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs text-muted-foreground">From</div>
              <div>{userProfile?.country || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-muted-foreground">Target</div>
              <div>{userProfile?.destination_country || 'Not set'}</div>
            </div>
          </div>
        </div>

        {/* Visa and User Type */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-xs text-muted-foreground">Visa Type</div>
              <div>{userProfile?.visa_type || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base">{userTypeInfo.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground">Profile</div>
              <div>{userTypeInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Timeline and Profession */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-xs text-muted-foreground">Timeline</div>
              <div>{timelineDisplay}</div>
            </div>
          </div>
          {userProfile?.profession && (
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-xs text-muted-foreground">Profession</div>
                <div className="truncate">{userProfile.profession}</div>
              </div>
            </div>
          )}
        </div>

        {/* Budget Range (if set) */}
        {userProfile?.budget_range && (
          <div className="flex items-center gap-2 text-sm pt-2 border-t">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-muted-foreground">Budget Range</div>
              <div>{userProfile.budget_range}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}