'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, MapPin, Calendar, Briefcase, GraduationCap, Clock, DollarSign, Edit, Plane, Target } from 'lucide-react';
import Link from 'next/link';

interface EnhancedProfileCardProps {
  userProfile: any;
}

export function EnhancedProfileCard({ userProfile }: EnhancedProfileCardProps) {
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

  // Get inspirational message based on completion and destination
  const getInspirationalMessage = () => {
    if (completion < 50) {
      return "Your global journey starts with a single step!";
    }
    const country = userProfile?.destination_country;
    if (country) {
      return `Your ${country} dream is within reach!`;
    }
    return "Your immigration journey begins here!";
  };

  // If no KYC data, show inspiring empty state
  if (!userProfile?.kyc_completed_at || completion < 30) {
    return (
      <Card className="border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden">
        {/* Passport Stamp Background */}
        <div className="absolute inset-0 bg-[url('/passport-stamps-collage.jpg')] bg-cover bg-center opacity-10"></div>
        
        <CardHeader className="relative z-10 text-center pb-3">
          <CardTitle className="text-xl flex items-center justify-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" />
            Your Global Journey Awaits
          </CardTitle>
          <CardDescription className="text-lg">
            Complete your profile to unlock personalized visa guidance
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-10 text-center">
          <div className="mb-4">
            <div className="text-3xl mb-2">🌍</div>
            <p className="text-sm text-muted-foreground mb-4">
              Tell us about your dreams and we'll light the path forward
            </p>
          </div>
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href="/kyc">
              <Target className="w-4 h-4 mr-2" />
              Start Your Journey
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 border-blue-200 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
      {/* Passport Stamp Collage Background */}
      <div className="absolute inset-0 bg-[url('/passport-stamps-collage.jpg')] bg-cover bg-center opacity-15 group-hover:opacity-20 transition-opacity duration-300"></div>
      
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <Target className="w-5 h-5" />
              Your {userProfile?.destination_country || 'Global'} Dream
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1 text-sm">
                <Progress value={completion} className="w-20 h-2" />
                <span>{completion}% complete</span>
              </div>
            </CardDescription>
          </div>
          <Button asChild variant="outline" size="sm" className="relative z-20">
            <Link href="/kyc-profile">
              <Edit className="w-3 h-3 mr-1" />
              Update
            </Link>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-3">
        {/* Inspirational Message */}
        <div className="text-center mb-2">
          <p className="text-sm font-medium text-blue-700 bg-blue-100/50 py-1 px-3 rounded-full">
            {getInspirationalMessage()}
          </p>
        </div>

        {/* Name and Age */}
        <div className="flex justify-between items-center bg-white/50 rounded-lg p-2">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-semibold">{userProfile?.preferred_name || 'Traveler'}</span>
          </div>
          {userProfile?.age && (
            <Badge variant="outline" className="flex items-center gap-1 bg-white">
              <Calendar className="w-3 h-3" />
              {userProfile.age} years
            </Badge>
          )}
        </div>

        {/* Journey Path */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <div>
              <div className="text-xs text-muted-foreground">From</div>
              <div className="font-medium">{userProfile?.country || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <div>
              <div className="text-xs text-muted-foreground">Destination</div>
              <div className="font-medium">{userProfile?.destination_country || 'Not set'}</div>
            </div>
          </div>
        </div>

        {/* Visa and Profile Type */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
            <GraduationCap className="w-4 h-4 text-purple-600" />
            <div>
              <div className="text-xs text-muted-foreground">Visa Type</div>
              <div className="font-medium">{userProfile?.visa_type || 'Not set'}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
            <span className="text-base">{userTypeInfo.icon}</span>
            <div>
              <div className="text-xs text-muted-foreground">Profile</div>
              <div className="font-medium">{userTypeInfo.label}</div>
            </div>
          </div>
        </div>

        {/* Timeline and Profession */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <div className="text-xs text-muted-foreground">Timeline</div>
              <div className="font-medium">{timelineDisplay}</div>
            </div>
          </div>
          {userProfile?.profession && (
            <div className="flex items-center gap-2 bg-white/50 rounded-lg p-2">
              <Briefcase className="w-4 h-4 text-gray-600" />
              <div>
                <div className="text-xs text-muted-foreground">Profession</div>
                <div className="font-medium truncate">{userProfile.profession}</div>
              </div>
            </div>
          )}
        </div>

        {/* Success Indicator */}
        {completion > 70 && (
          <div className="text-center mt-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              🎯 Excellent profile completeness!
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}