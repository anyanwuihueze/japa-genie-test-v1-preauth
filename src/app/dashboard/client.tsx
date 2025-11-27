'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, Circle, MapPin 
} from 'lucide-react';
import Link from 'next/link';
import { EnhancedProfileCard } from '@/components/dashboard/enhanced-profile-card';
import VisaPulseTicker from '@/components/visa-pulse-ticker';

interface DashboardClientProps {
  user: any;
  userProfile?: any;
}

export default function DashboardClient({ user, userProfile }: DashboardClientProps) {
  console.log("🚀 DASHBOARD CLIENT - User:", user?.id);
  console.log("🚀 DASHBOARD CLIENT - UserProfile received:", userProfile);
  console.log("🚀 DASHBOARD CLIENT - Profile exists:", !!userProfile);

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          Welcome back, {userProfile?.preferred_name || user.email?.split('@')[0] || 'Traveler'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          {userProfile?.destination_country && userProfile?.visa_type 
            ? `Your ${userProfile.visa_type} visa journey to ${userProfile.destination_country}`
            : 'Your visa journey dashboard'
          }
        </p>
      </header>

      <VisaPulseTicker />

      {/* 🎯 ENHANCED PROFILE CARD - NOW RECEIVES ACTUAL DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <EnhancedProfileCard 
            userProfile={userProfile} 
            userId={user.id} 
            onProfileUpdate={() => window.location.reload()} 
          />
        </div>
        
        <div className="space-y-4">
          {/* ALTERNATIVE COUNTRIES SECTION */}
          {userProfile?.alternative_countries && userProfile.alternative_countries.length > 0 && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Alternative Destinations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {userProfile.alternative_countries.map((country: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg">
                      <span className="text-sm font-medium">{country}</span>
                      <Badge variant="outline" className="text-xs">
                        Option {index + 1}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* QUICK STATS */}
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Insights Generated</div>
            </CardContent>
          </Card>

          {/* QUICK ACTIONS */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/chat">Continue Chat</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/kyc-profile">Update Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 🚀 COMPLETE USER STATUS SECTION */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle>Your Complete Journey Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{userProfile?.age || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Age</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{userProfile?.profession || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Profession</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{userProfile?.timeline_urgency || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Timeline</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{userProfile?.user_type || 'N/A'}</div>
              <div className="text-sm text-muted-foreground">Profile Type</div>
            </div>
          </div>

          {userProfile?.alternative_countries && userProfile.alternative_countries.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3">Alternative Destinations</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile.alternative_countries.map((country: string) => (
                  <Badge key={country} variant="secondary" className="text-sm">
                    {country}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MILESTONES SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Journey Milestones</CardTitle>
          <CardDescription>Track your progress step by step</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['Complete Profile', 'Upload Documents', 'Documents Verified', 'Financial Ready', 'Interview Prep', 'Submit Application', 'Decision Received'].map((label, index) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50">
                <div className="text-gray-400">
                  <Circle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {index === 0 && userProfile ? 'Completed' : 'Pending'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}