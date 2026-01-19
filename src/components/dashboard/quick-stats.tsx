'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageCircle, 
  FileText, 
  Clock, 
  TrendingUp,
  Users,
  Calendar
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { createClient } from '@/lib/supabase/client';

interface QuickStatsProps {
  userId: string;
  className?: string;
}

interface Stats {
  totalMessages: number;
  documentsUploaded: number;
  daysRemaining: number;
  progressPercentage: number;
  expertSessions: number;
  nextMilestone: string;
}

export function QuickStats({ userId, className }: QuickStatsProps) {
  const [stats, setStats] = useState<Stats>({
    totalMessages: 0,
    documentsUploaded: 0,
    daysRemaining: 0,
    progressPercentage: 0,
    expertSessions: 0,
    nextMilestone: 'Start Journey'
  });
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient();
        
        // Fetch message count
        const { count: messageCount } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Fetch document count
        const { count: docCount } = await supabase
          .from('user_documents')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        // Fetch user progress
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single();

        setStats({
          totalMessages: messageCount || 0,
          documentsUploaded: docCount || 0,
          daysRemaining: progress?.days_to_deadline || 90,
          progressPercentage: progress?.progress_percentage || 0,
          expertSessions: progress?.expert_sessions || 0,
          nextMilestone: progress?.next_milestone || 'Start Journey'
        });

      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const statItems = [
    {
      icon: MessageCircle,
      label: 'AI Chats',
      value: stats.totalMessages,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: FileText,
      label: 'Documents',
      value: stats.documentsUploaded,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Clock,
      label: 'Days Left',
      value: stats.daysRemaining,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: TrendingUp,
      label: 'Progress',
      value: `${stats.progressPercentage}%`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Users,
      label: 'Expert Help',
      value: stats.expertSessions,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      icon: Calendar,
      label: 'Next Goal',
      value: stats.nextMilestone,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      isText: true
    }
  ];

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-16 mb-1"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="text-center group hover:scale-105 transition-transform">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${item.bgColor} rounded-lg mb-2 group-hover:shadow-md transition-shadow`}>
                  <Icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground mb-1`}>
                  {item.label}
                </div>
                <div className={`font-bold ${isMobile ? 'text-lg' : 'text-xl'} ${item.color}`}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
