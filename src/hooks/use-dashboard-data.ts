import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { createClient } from '@/lib/supabase/client';

export interface DashboardData {
  userId: string;
  userProfile: any;
  messageCount: number;
  recentMessages: any[];
  documentCount: number;
  documents: any[];
  approvedDocuments: number;
  progressPercentage: number;
  userProgress: any;
  pofSeasons: any[];
  activeSeason: number;
  quickStats: {
    progressPercentage: number;
    documentPercentage: number;
    messagePercentage: number;
    overallProgress: number;
  };
  loading: boolean;
  error: string | null;
}

export function useDashboardData(userProfileParam?: any): DashboardData {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [data, setData] = useState<DashboardData>({
    userId: userId || '',
    userProfile: userProfileParam || null,
    messageCount: 0,
    recentMessages: [],
    documentCount: 0,
    documents: [],
    approvedDocuments: 0,
    progressPercentage: 0,
    userProgress: null,
    pofSeasons: [],
    activeSeason: 1,
    quickStats: {
      progressPercentage: 0,
      documentPercentage: 0,
      messagePercentage: 0,
      overallProgress: 0
    },
    loading: true,
    error: null
  });

  const fetchAllData = async () => {
    if (!userId) {
      setData(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const supabase = createClient();
      
      // FETCH USER PROFILE if not provided
      let userProfile = userProfileParam;
      if (!userProfile) {
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        userProfile = profileData;
      }

      // Fetch other data in parallel
      const [messagesRes, docsRes, progressRes] = await Promise.all([
        supabase.from('chat_messages').select('*').eq('user_id', userId),
        supabase.from('user_documents').select('*').eq('user_id', userId),
        supabase.from('user_progress_summary').select('*').eq('user_id', userId).single()
      ]);

      const documentCount = docsRes.data?.length || 0;
      const approvedDocuments = docsRes.data?.filter((d: any) => d.status === 'approved').length || 0;
      const messageCount = messagesRes.data?.length || 0;

      // Calculate progress
      const progressPercentage = calculateProgress(userProfile, documentCount, messageCount);

      setData({
        userId,
        userProfile: userProfile || null,
        messageCount,
        recentMessages: messagesRes.data?.slice(-5) || [],
        documentCount,
        documents: docsRes.data || [],
        approvedDocuments,
        progressPercentage,
        userProgress: progressRes.data || null,
        pofSeasons: [],
        activeSeason: 1,
        quickStats: {
          progressPercentage,
          documentPercentage: Math.min(100, (documentCount / 10) * 100),
          messagePercentage: Math.min(100, (messageCount / 20) * 100),
          overallProgress: progressPercentage
        },
        loading: false,
        error: null
      });

    } catch (error: any) {
      console.error('Dashboard data fetch error:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to load dashboard data'
      }));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllData();
    } else {
      setData(prev => ({ ...prev, loading: false }));
    }
  }, [userId, userProfileParam]);

  return data;
}

function calculateProgress(userProfile: any, documentCount: number, messageCount: number): number {
  let progress = 0;
  
  // Profile completion (40%)
  if (userProfile?.destination_country) progress += 20;
  if (userProfile?.visa_type) progress += 10;
  if (userProfile?.profession) progress += 10;
  
  // Documents (30%)
  progress += Math.min(documentCount * 5, 30);
  
  // Engagement (30%)
  progress += Math.min(messageCount * 2, 30);
  
  return Math.min(progress, 100);
}
