'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, ArrowRight, Upload, MessageSquare, FileCheck, Calendar } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import Link from 'next/link';

interface SmartNextActionProps {
  userId: string;
  userProfile?: any;
  currentProgress?: number;
  className?: string;
}

interface NextAction {
  icon: string;
  title: string;
  description: string;
  action: string;
  link: string;
  urgent: boolean;
  color: string;
}

export function SmartNextAction({ userId, userProfile, currentProgress, className }: SmartNextActionProps) {
  const [nextAction, setNextAction] = useState<NextAction | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    determineNextAction();
  }, [userId, userProfile, currentProgress]);

  const determineNextAction = async () => {
    try {
      const supabase = createClient();

      // Fetch REAL data to determine priority
      const [
        { count: docCount },
        { data: pofSeasons },
        { count: messageCount },
        { data: documents }
      ] = await Promise.all([
        supabase.from('user_documents').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('user_pof_seasons').select('status').eq('user_id', userId),
        supabase.from('messages').select('*', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('user_documents').select('status, analysis_status').eq('user_id', userId)
      ]);

      const approvedDocs = documents?.filter(d => d.status === 'approved' || d.analysis_status === 'completed').length || 0;
      const pendingDocs = documents?.filter(d => d.status === 'pending_review').length || 0;
      const completedPOFSeasons = pofSeasons?.filter(s => s.status === 'completed').length || 0;

      // PRIORITY LOGIC (highest to lowest urgency)

      // Priority 1: No documents uploaded (HIGHEST)
      if (!docCount || docCount === 0) {
        setNextAction({
          icon: 'ðŸ“„',
          title: 'Upload Your First Document',
          description: 'Start with your passport or bank statement. AI will verify it instantly.',
          action: 'Upload Document',
          link: '/document-check',
          urgent: true,
          color: 'from-red-500 to-orange-500'
        });
        setLoading(false);
        return;
      }

      // Priority 2: Documents uploaded but not verified
      if (pendingDocs > 0) {
        setNextAction({
          icon: 'â³',
          title: `${pendingDocs} Document${pendingDocs > 1 ? 's' : ''} Awaiting Review`,
          description: 'Your documents are being analyzed. Check back in a few minutes for results.',
          action: 'View Document Status',
          link: '/document-check',
          urgent: false,
          color: 'from-yellow-500 to-orange-500'
        });
        setLoading(false);
        return;
      }

      // Priority 3: Not enough documents
      if (approvedDocs < 5) {
        setNextAction({
          icon: 'ðŸ“‹',
          title: 'Upload More Documents',
          description: `You have ${approvedDocs}/5 key documents. Most successful applications have 5+ verified documents.`,
          action: 'Upload Next Document',
          link: '/document-check',
          urgent: true,
          color: 'from-orange-500 to-yellow-500'
        });
        setLoading(false);
        return;
      }

      // Priority 4: POF not started or incomplete
      if (!pofSeasons || pofSeasons.length === 0 || completedPOFSeasons < 3) {
        setNextAction({
          icon: 'ðŸ’°',
          title: 'Start POF Seasoning Tracker',
          description: `Build your financial history. ${3 - completedPOFSeasons} more months needed for strong proof of funds.`,
          action: 'Upload Bank Statement',
          link: '/dashboard/proof-of-funds',
          urgent: true,
          color: 'from-green-500 to-teal-500'
        });
        setLoading(false);
        return;
      }

      // Priority 5: Low engagement (haven't asked AI enough questions)
      if (!messageCount || messageCount < 5) {
        setNextAction({
          icon: 'ðŸ’¬',
          title: 'Get Personalized Guidance',
          description: 'Well-prepared applicants ask 15+ questions. Chat with AI to identify potential issues.',
          action: 'Ask AI a Question',
          link: '/chat',
          urgent: false,
          color: 'from-blue-500 to-purple-500'
        });
        setLoading(false);
        return;
      }

      // Priority 6: Everything looks good - suggest expert review
      if (currentProgress && currentProgress > 60) {
        setNextAction({
          icon: 'ðŸŽ¯',
          title: 'Ready for Expert Review',
          description: 'Your application is looking strong. Get final review from a verified expert.',
          action: 'Book Expert Session',
          link: '/experts',
          urgent: false,
          color: 'from-purple-500 to-pink-500'
        });
        setLoading(false);
        return;
      }

      // Fallback: Continue building
      setNextAction({
        icon: 'ðŸš€',
        title: 'Continue Building Your Application',
        description: 'Keep adding documents and chatting with AI to strengthen your application.',
        action: 'Go to Chat',
        link: '/chat',
        urgent: false,
        color: 'from-blue-500 to-indigo-500'
      });

    } catch (error) {
      console.error('Error determining next action:', error);
      // Fallback action
      setNextAction({
        icon: 'ðŸ’¬',
        title: 'Chat with AI',
        description: 'Get personalized guidance for your visa journey',
        action: 'Start Chat',
        link: '/chat',
        urgent: false,
        color: 'from-blue-500 to-purple-500'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !nextAction) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} overflow-hidden border-0 shadow-xl`}>
      <div className={`bg-gradient-to-r ${nextAction.color} p-1`}>
        <div className="bg-white rounded-lg">
          <CardContent className={`${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center text-3xl ${isMobile ? 'w-12 h-12 text-2xl' : ''}`}>
                  {nextAction.icon}
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>
                    {nextAction.title}
                  </h3>
                  {nextAction.urgent && (
                    <Badge variant="destructive" className="text-xs flex-shrink-0">
                      URGENT
                    </Badge>
                  )}
                </div>
                
                <p className={`text-gray-600 leading-relaxed ${isMobile ? 'text-sm mb-3' : 'text-base mb-4'}`}>
                  {nextAction.description}
                </p>
                
                <Button 
                  asChild
                  size={isMobile ? 'default' : 'lg'}
                  className={`w-full sm:w-auto bg-gradient-to-r ${nextAction.color} hover:opacity-90 transition-opacity`}
                >
                  <Link href={nextAction.link} className="flex items-center justify-center gap-2">
                    {nextAction.action}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
