'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuickStatsProps {
  className?: string;
}

export function QuickStats({ className }: QuickStatsProps) {
  const isMobile = useIsMobile();
  const dashboardData = useDashboardData();
  
  // During loading, show skeleton
  if (dashboardData.loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent className="flex justify-between items-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (dashboardData.error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent>
          <div className="text-center text-red-500">
            Error loading stats
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: 'Journey Progress',
      value: dashboardData.quickStats.progressPercentage,
      color: getProgressColor(dashboardData.quickStats.progressPercentage)
    },
    {
      label: 'Documents',
      value: dashboardData.quickStats.documentPercentage,
      color: getProgressColor(dashboardData.quickStats.documentPercentage)
    },
    {
      label: 'AI Chats',
      value: dashboardData.quickStats.messagePercentage,
      color: getProgressColor(dashboardData.quickStats.messagePercentage)
    }
  ];

  return (
    <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-3'} gap-6`}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="relative inline-flex items-center justify-center mb-2">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stat.value / 100)}`}
                    className={`${stat.color} transition-all duration-500`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xl font-bold">{stat.value}%</span>
              </div>
              <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getProgressColor(percentage: number): string {
  if (percentage >= 71) return 'text-green-500';
  if (percentage >= 31) return 'text-blue-500';
  return 'text-orange-500';
}
