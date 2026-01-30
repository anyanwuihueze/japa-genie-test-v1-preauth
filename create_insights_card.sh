#!/bin/bash

# Create insights card component
cat > src/components/dashboard/insights-card.tsx << 'EOT'
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertTriangle, Lightbulb, Target, ArrowUp, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';

interface InsightsCardProps {
  userId: string;
  userProfile?: any;
  className?: string;
}

export function InsightsCard({ userId, userProfile, className }: InsightsCardProps) {
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    const generateInsights = async () => {
      try {
        const supabase = createClient();
        
        // Fetch current data for insights
        const [
          { data: messages },
          { data: documents },
          { data: progress },
          { data: lastWeek }
        ] = await Promise.all([
          supabase.from('messages').select('count').eq('user_id', userId).single(),
          supabase.from('user_documents').select('status, created_at, confidence_score').eq('user_id', userId),
          supabase.from('user_progress').select('progress_percentage').eq('user_id', userId).single(),
          supabase.from('user_documents').select('status').eq('user_id', userId).gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        const approvedDocs = documents?.filter(d => d.status === 'approved').length || 0;
        const totalDocs = 8;
        const lastWeekProgress = lastWeek?.length || 0;
        const avgConfidence = documents?.reduce((acc, doc) => acc + (doc.confidence_score || 0), 0) / (documents?.length || 1) || 0;

        const insights = [];

        // 1. Approval prediction based on trends
        const currentApproval = Math.min(65 + (approvedDocs * 5) + (messages?.count || 0), 95);
        const lastWeekApproval = Math.min(65 + ((approvedDocs - lastWeekProgress) * 5), 95);
        const approvalChange = currentApproval - lastWeekApproval;

        if (approvalChange > 0) {
          insights.push({
            type: 'success',
            icon: <TrendingUp className="w-4 h-4" />,
            title: 'Approval Improving',
            description: `↑ Approval +${Math.round(approvalChange)}% this week`,
            action: 'Keep going!',
            priority: 'high'
          });
        }

        // 2. Document issues from AI analysis
        const lowConfidenceDocs = documents?.filter(d => d.confidence_score < 70) || [];
        if (lowConfidenceDocs.length > 0) {
          insights.push({
            type: 'warning',
            icon: <AlertTriangle className="w-4 h-4" />,
            title: 'Document Issues Found',
            description: `${lowConfidenceDocs.length} documents need attention`,
            action: 'Review documents',
            priority: 'high'
          });
        }

        // 3. POF recommendations
        if (userProfile?.visa_type?.includes('Student') && approvedDocs < 3) {
          const currentAvg = approvedDocs > 0 ? Math.round((approvedDocs * 1500000) / approvedDocs) : 0;
          const targetAmount = 1500000; // ₦1.5M target
          const needed = Math.max(0, targetAmount - currentAvg);
          
          if (needed > 0) {
            insights.push({
              type: 'recommendation',
              icon: <Lightbulb className="w-4 h-4" />,
              title: 'POF Optimization',
              description: `Deposit ₦${Math.round(needed/1000)}K more to reach target`,
              action: 'Update balance',
              priority: 'medium'
            });
          }
        }

        // 4. Engagement recommendations
        if ((messages?.count || 0) < 3) {
          insights.push({
            type: 'recommendation',
            icon: <Target className="w-4 h-4" />,
            title: 'Boost Your Progress',
            description: 'Chat with AI for personalized guidance',
            action: 'Start conversation',
            priority: 'low'
          });
        }

        // 5. Timeline optimization
        if (approvedDocs >= 4 && (messages?.count || 0) < 5) {
          insights.push({
            type: 'success',
            icon: <ArrowUp className="w-4 h-4" />,
            title: 'Ready for Next Step',
            description: 'Documents looking good - time for expert review',
            action: 'Book consultation',
            priority: 'medium'
          });
        }

        setInsights(insights);
      } catch (error) {
        console.error('Error generating insights:', error);
      } finally {
        setLoading(false);
      }
    };

    generateInsights();
  }, [userId, userProfile]);

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return null; // Don't show if no insights
  }

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'} border-blue-200 bg-blue-50/50`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'} pb-4`}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <Target className="w-5 h-5 text-blue-600" />
          AI Insights
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Personalized recommendations based on your data
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'success' ? 'bg-green-50 border-green-400' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 ${
                  insight.type === 'success' ? 'text-green-600' :
                  insight.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={`font-semibold ${isMobile ? 'text-sm' : 'text-base'}`}>
                      {insight.title}
                    </h4>
                    <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-xs'}`}>
                      {insight.priority}
                    </Badge>
                  </div>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'} mb-2`}>
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-medium ${
                      insight.type === 'success' ? 'text-green-600' :
                      insight.type === 'warning' ? 'text-yellow-600' :
                      'text-blue-600'
                    }`}>
                      {insight.action}
                    </span>
                    <div className="text-xs text-gray-500">
                      {insight.type === 'success' && '↑ Trending'}
                      {insight.type === 'warning' && '⚠️ Action needed'}
                      {insight.type === 'recommendation' && '💡 Suggestion'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
EOT

echo "✅ Insights card created!"

# Add to dashboard
echo "Now add this to your dashboard:"
echo "<InsightsCard userId={user.id} userProfile={userProfile} className='w-full' />"
