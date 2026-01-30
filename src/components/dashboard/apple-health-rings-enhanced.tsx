'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface AppleHealthRingsEnhancedProps {
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
  glowIntensity: number;
  brightness: number;
}

export function AppleHealthRingsEnhanced({ userId, className }: AppleHealthRingsEnhancedProps) {
  const [rings, setRings] = useState<RingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setAnimateIn(true), 100);
    
    const fetchRingData = async () => {
      try {
        const supabase = createClient();
        
        // Fetch comprehensive user data
        const [
          { count: messageCount },
          { data: documents },
          { data: progress }
        ] = await Promise.all([
          supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', userId),
          supabase.from('user_documents').select('status').eq('user_id', userId),
          supabase.from('user_progress').select('*').eq('user_id', userId).single()
        ]);

        const approvedDocs = documents?.filter(d => d.status === 'approved').length || 0;
        const totalDocs = 8; // Target document count
        
        // Apple Health-style ring data with enhanced properties
        const ringData: RingData[] = [
          {
            label: 'Progress',
            value: progress?.progress_percentage || 0,
            max: 100,
            color: getProgressColor(progress?.progress_percentage || 0),
            bgColor: `${getProgressColor(progress?.progress_percentage || 0)}20`,
            icon: '🎯',
            glowIntensity: Math.min((progress?.progress_percentage || 0) / 100, 1),
            brightness: 1 + (Math.min((progress?.progress_percentage || 0) / 100, 1) * 0.3)
          },
          {
            label: 'Documents',
            value: approvedDocs,
            max: totalDocs,
            color: '#10B981', // Green
            bgColor: '#10B98120',
            icon: '��',
            glowIntensity: approvedDocs / totalDocs,
            brightness: 1 + ((approvedDocs / totalDocs) * 0.3)
          },
          {
            label: 'AI Chats',
            value: messageCount || 0,
            max: Math.max(10, (messageCount || 0) + 2), // Dynamic target
            color: '#3B82F6', // Blue
            bgColor: '#3B82F620',
            icon: '💬',
            glowIntensity: Math.min((messageCount || 0) / Math.max(10, (messageCount || 0) + 2), 1),
            brightness: 1 + (Math.min((messageCount || 0) / Math.max(10, (messageCount || 0) + 2), 1) * 0.3)
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

  const EnhancedRing = ({ data, size = 120, strokeWidth = 8, index }: { data: RingData; size?: number; strokeWidth?: number; index: number }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(data.value / data.max, 1);
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * (1 - progress);

    // Calculate glow effect based on progress
    const glowOpacity = data.glowIntensity * 0.6;
    const glowSize = 20 + (data.glowIntensity * 10);
    const animationDelay = index * 200; // Staggered animation

    return (
      <div className="relative inline-flex flex-col items-center">
        {/* Glow effect container */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${data.color}${Math.round(glowOpacity * 255).toString(16)} 0%, transparent 70%)`,
            filter: `blur(${glowSize}px)`,
            opacity: glowOpacity,
            transform: `scale(${1 + data.glowIntensity * 0.2})`,
            animation: `pulse-glow ${2 + data.glowIntensity}s ease-in-out infinite`,
            animationDelay: `${animationDelay}ms`
          }}
        />
        
        <svg width={size} height={size} className="transform -rotate-90 relative z-10">
          {/* Background ring with enhanced styling */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={data.bgColor}
            strokeWidth={strokeWidth}
            fill="none"
            opacity={0.2}
            className="transition-opacity duration-500"
          />
          
          {/* Progress ring with enhanced animation */}
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
            className="transition-all duration-1500 ease-out"
            style={{
              filter: `brightness(${data.brightness}) drop-shadow(0 0 ${data.glowIntensity * 8}px ${data.color})`,
              animation: `ring-fill 1.5s ease-out ${animationDelay}ms both`
            }}
          />
        </svg>
        
        {/* Center content with enhanced styling */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div 
            className="text-2xl mb-1 transition-all duration-500"
            style={{ filter: `brightness(${data.brightness})` }}
          >
            {data.icon}
          </div>
          <div 
            className="text-2xl font-bold transition-all duration-500"
            style={{ 
              color: data.color,
              filter: `brightness(${data.brightness}) drop-shadow(0 2px 4px rgba(0,0,0,0.1))`
            }}
          >
            {Math.round((data.value / data.max) * 100)}%
          </div>
          <div className="text-xs text-gray-500 mt-1 font-medium">
            {data.value}/{data.max}
          </div>
        </div>
      </div>
    );
  };

  // Add custom CSS for animations
  const customStyles = `
    @keyframes ring-fill {
      from {
        stroke-dashoffset: 314; /* Full circumference */
      }
      to {
        stroke-dashoffset: var(--target-offset);
      }
    }
    
    @keyframes pulse-glow {
      0%, 100% {
        opacity: var(--glow-opacity);
        transform: scale(calc(1 + var(--glow-intensity) * 0.1));
      }
      50% {
        opacity: calc(var(--glow-opacity) * 1.3);
        transform: scale(calc(1 + var(--glow-intensity) * 0.2));
      }
    }
  `;

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
    <>
      <style>{customStyles}</style>
      <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} ${animateIn ? 'animate-in' : ''}`}>
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
              <div 
                key={index} 
                className="text-center transition-all duration-500"
                style={{ 
                  '--glow-opacity': ring.glowIntensity * 0.6,
                  '--glow-intensity': ring.glowIntensity,
                  '--target-offset': `${2 * Math.PI * 50 * (1 - Math.min(ring.value / ring.max, 1))}px`
                } as React.CSSProperties}
              >
                <EnhancedRing data={ring} size={isMobile ? 100 : 120} index={index} />
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
          
          {/* Enhanced quick stats below rings */}
          <div className={`grid ${isMobile ? 'grid-cols-2 gap-4 mt-6' : 'grid-cols-4 gap-4 mt-8'}`}>
            {rings.map((ring, index) => (
              <div 
                key={index} 
                className="text-center p-3 bg-gray-50 rounded-lg transition-all duration-300 hover:bg-gray-100"
                style={{ borderLeft: `3px solid ${ring.color}` }}
              >
                <div 
                  className="text-lg font-bold transition-all duration-300"
                  style={{ color: ring.color, filter: `brightness(${ring.brightness})` }}
                >
                  {ring.label === 'Progress' ? `${ring.value}%` : 
                   ring.label === 'Documents' ? `${ring.value}/${ring.max}` :
                   ring.value}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {ring.label === 'Progress' ? 'Overall Progress' :
                   ring.label === 'Documents' ? 'Docs Approved' :
                   ring.label === 'AI Chats' ? 'AI Sessions' :
                   'Metric'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
