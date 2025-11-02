// src/app/dashboard/client.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';
import { TrendingUp, Upload, Users, Target, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardClient({ user }: { user: any }) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [progress, setProgress] = useState(45);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const supabase = createClient();
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    setUserProfile(profile);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <header className="text-center">
        <h1 className="text-4xl font-bold">
          {userProfile?.destination_country 
            ? `Your Journey to ${userProfile.destination_country}`
            : 'Your Visa Dashboard'
          }
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Welcome back! Your personalized visa command center.
        </p>
      </header>

      {/* Progress Hero */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Overall Progress</CardTitle>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="w-3 h-3 mr-1" />
              Ahead of 73%
            </Badge>
          </div>
          <CardDescription>
            You're making great progress! Document verification is your next milestone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full h-3" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Started</span>
            <span>Visa Approved</span>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">5/12</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">7d</div>
            <div className="text-sm text-muted-foreground">Next Deadline</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-purple-600">₦2.4M</div>
            <div className="text-sm text-muted-foreground">Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">87%</div>
            <div className="text-sm text-muted-foreground">Success Chance</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Document Center
            </CardTitle>
            <CardDescription>
              Upload and verify your visa documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/document-check">
                Upload Documents
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Expert Help
            </CardTitle>
            <CardDescription>
              Get 1-on-1 guidance when you're stuck
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-orange-500 hover:bg-orange-600">
              <Link href="/experts">
                Find Experts
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}