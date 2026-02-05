'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppleHealthRingsProps {
  userId: string;
  className?: string;
}

interface RingData {
  label: string;
  value: number;
  max: number;
  color: string;
  bgColor: string;
  icon?: string;
}

export function AppleHealthRings({ userId, className }: AppleHealthRingsProps) {
  const [rings, setRings] = useState<RingData[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchRingData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch comprehensive user data
        const [
          { count: messageCount },
          { count: docCount },
          { data: progress },
          { data: userDocs }
        ] = await Promise.all([
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', userId),
          supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('user_id', userId),
          supabase.from('user_progress').select('*').eq('user_id', userId).single(),
          supabase.from('user_documents').select('status').eq('user_id', userId)
        ]);

        const approvedDocs = userDocs?.filter(d => d.status === 'approved').length || 0;
        const totalDocs = 8; // Target document count
        
        // Apple Health-style ring data
        const ringData: RingData[] = [
          {
            label: 'Progress',
            value: progress?.progress_percentage || 0,
            max: 100,
            color: getProgressColor(progress?.progress_percentage || 0),
            bgColor: `${getProgressColor(progress?.progress_percentage || 0)}20`,
            icon: '🎯'
          },
          {
            label: 'Documents',
            value: approvedDocs,
            max: totalDocs,
            color: '#10B981', // Green
            bgColor: '#10B98120',
            icon: '📄'
          },
          {
            label: 'AI Chats',
            value: messageCount || 0,
            max: Math.max(10, (messageCount || 0) + 2), // Dynamic target
            color: '#3B82F6', // Blue
            bgColor: '#3B82F620',
            icon: '💬'
          }
        ];

        setRings(ringData);
      } catch (error) {
        console.error('Error fetching ring data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRingData();
    }
  }, [userId]);

  const getProgressColor = (percentage: number): string => {
    if (percentage <= 30) return '#F59E0B'; // Orange (Getting Started)
    if (percentage <= 70) return '#3B82F6'; // Blue (In Progress)
    return '#10B981'; // Green (Almost There)
  };

  const Ring = ({ data, size = 120, strokeWidth = 8 }: { data: RingData; size?: number; strokeWidth?: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(data.value / data.max, 1);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <div className="relative inline-flex flex-col items-center">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={data.bgColor}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.3}
          />
          {/* Progress ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={data.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl mb-1">{data.icon}</div>
          <div className="text-2xl font-bold" style={{ color: data.color }}>
            {Math.round((data.value / data.max) * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {data.value}/{data.max}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-lg' : 'text-xl'}>Your Journey Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse flex space-x-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-24 h-24 bg-gray-200 rounded-full"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'}`}>
          Your Journey Progress
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Track your visa journey across three key areas
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className={`flex ${isMobile ? 'flex-col items-center space-y-6' : 'items-center justify-around'}`}>
          {rings.map((ring, index) => (
            <div key={index} className="text-center">
              <Ring data={ring} size={isMobile ? 100 : 120} />
              <div className="mt-3">
                <div className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                  {ring.label}
                </div>
                <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {ring.value} of {ring.max}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Quick stats below rings */}
        <div className={`grid ${isMobile ? 'grid-cols-2 gap-4 mt-6' : 'grid-cols-4 gap-4 mt-8'}`}>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{rings[0]?.value || 0}%</div>
            <div className="text-xs text-gray-600">Overall Progress</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{rings[1]?.value || 0}</div>
            <div className="text-xs text-gray-600">Docs Approved</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">{rings[2]?.value || 0}</div>
            <div className="text-xs text-gray-600">AI Sessions</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-orange-600">
              ₦{(rings[0]?.value || 0) * 24000 / 1000}K
            </div>
            <div className="text-xs text-gray-600">Money Saved</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
