'use client';

import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface InsightsCardProps {
  className?: string;
}

export function InsightsCard({ className }: InsightsCardProps) {
  const isMobile = useIsMobile();
  const { recentMessages, messageCount, userProfile, loading, error } = useDashboardData('');

  if (loading) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 animate-pulse mb-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardContent>
          <div className="text-center text-red-500 py-4">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Unable to load AI insights</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!userProfile?.destination_country) {
    return (
      <Card className={`${className} ${isMobile ? 'p-4' : 'p-6'}`}>
        <CardHeader>
          <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
            <Brain className="w-5 h-5" />
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Complete Profile for Insights</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Add your destination and visa type to unlock personalized AI recommendations
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const insights = generateInsights(recentMessages, messageCount, userProfile);

  return (
    <Card className={`${className} ${isMobile ? 'shadow-sm' : 'shadow-lg'}`}>
      <CardHeader className={`${isMobile ? 'p-4' : 'p-6'}`}>
        <CardTitle className={`${isMobile ? 'text-lg' : 'text-xl'} flex items-center gap-2`}>
          <Brain className="w-5 h-5" />
          AI Insights
        </CardTitle>
        <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
          Personalized recommendations based on your real data
        </p>
      </CardHeader>
      <CardContent className={`${isMobile ? 'p-4' : 'p-6'} pt-0`}>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${insight.type === 'positive' ? 'bg-green-50 border-green-200' : 
                         insight.type === 'warning' ? 'bg-yellow-50 border-yellow-200' : 
                         'bg-blue-50 border-blue-200'}`}
            >
              <div className="flex items-start gap-3">
                {insight.type === 'positive' ? <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" /> :
                 insight.type === 'warning' ? <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" /> :
                 <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{insight.title}</p>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-base'}`}>
                    {insight.description}
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className={`${isMobile ? 'text-xs' : 'text-sm'}`}>
                      {insight.impact}
                    </Badge>
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

function generateInsights(messages: any[], messageCount: number, userProfile: any) {
  const insights = [];
  
  if (!userProfile?.visa_type) {
    insights.push({
      type: 'critical',
      title: 'Complete Your Profile',
      description: 'Add your visa type to unlock all personalized features',
      impact: '95% impact'
    });
  }
  
  if (messageCount < 5) {
    insights.push({
      type: 'positive',
      title: 'Chat with AI Assistant',
      description: `You've sent ${messageCount} messages. Ask more questions to get better guidance!`,
      impact: '80% impact'
    });
  }
  
  if (messageCount > 10) {
    insights.push({
      type: 'positive',
      title: 'Great Progress!',
      description: 'Your engagement shows strong commitment to your visa journey',
      impact: 'High engagement'
    });
  }
  
  // Add more insights based on actual data...
  return insights;
}