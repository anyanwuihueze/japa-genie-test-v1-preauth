'use client';

import { EnhancedProfileCard } from '@/components/dashboard/enhanced-profile-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, MapPin } from 'lucide-react';
import Link from 'next/link';

interface DashboardClientProps {
  user: any;
  userProfile?: any;
}

export default function DashboardClient({ user, userProfile }: DashboardClientProps) {
  console.log("✅ DASHBOARD CLIENT - Data received:", { user, userProfile });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.email?.split('@')[0] || 'Traveler'}! 👋
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Your visa journey dashboard
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Profile Card - MAIN COMPONENT */}
        <div className="lg:col-span-2">
          <EnhancedProfileCard 
            userProfile={userProfile} 
            userId={user.id} 
            onProfileUpdate={() => window.location.reload()} 
          />
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Alternative Countries */}
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

          {/* Quick Stats */}
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Insights Generated</div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
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
    </div>
  );
}