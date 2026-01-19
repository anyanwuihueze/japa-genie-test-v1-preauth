import Link from 'next/link';
// components/dashboard/visa-assistant-card.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, ArrowRight, Clock, FileText } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

interface VisaAssistantCardProps {
  userId: string;
  userProfile?: any;
  userProgress?: any;
}

export function VisaAssistantCard({ userId, userProfile, userProgress }: VisaAssistantCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChatContext();
  }, [userId]);

  const loadChatContext = async () => {
    try {
      // Get recent messages for context
      const { data: messages } = await supabase
        .from('messages')
        .select('content, created_at, role')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setRecentMessages(messages || []);
    } catch (error) {
      console.error('Error loading chat context:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueChat = () => {
    // Build context from dashboard data
    const context = {
      entryPoint: 'dashboard',
      journeyStage: userProgress?.current_stage || 'initial',
      documentsProgress: {
        completed: userProgress?.total_document_checks || 0,
        total: 8
      },
      recentMessages: recentMessages,
      userProfile: userProfile,
      nextBestAction: userProgress?.next_recommended_action,
      kycCompleted: userProfile?.kyc_completed
    };

    // Navigate to chat with context in URL
    const queryParams = new URLSearchParams({
      context: encodeURIComponent(JSON.stringify(context)),
      source: 'dashboard'
    });

    router.push(`/chat?${queryParams.toString()}`);
  };

  const hasRecentChat = userProgress?.last_chat_date && 
    new Date().getTime() - new Date(userProgress.last_chat_date).getTime() < 24 * 60 * 60 * 1000;

  const getStatusText = () => {
    if (loading) return "Loading your chat status...";
    if (hasRecentChat) return "Continue your personalized visa guidance";
    if (userProfile?.kyc_completed) return "Get personalized visa guidance based on your profile";
    return "Start your visa consultation with our AI assistant";
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-blue-600" />
          Visa Assistant
        </CardTitle>
        <CardDescription>{getStatusText()}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Context Status */}
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex items-center gap-2">
              <FileText className="h-3 w-3" />
              <span>Documents: {userProgress?.total_document_checks || 0} checks completed</span>
            </div>
            {userProgress?.current_stage && (
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                <span>Stage: {userProgress.current_stage}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            onClick={handleContinueChat}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {hasRecentChat ? "Continue Chat" : "Start Chat"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}