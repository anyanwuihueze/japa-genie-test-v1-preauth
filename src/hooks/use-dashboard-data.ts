'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { calculateProgress } from '@/lib/utils/progress-calculator';
import { useAuth } from '@/lib/AuthContext';

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
  refresh: () => Promise<void>;
}

// Helper: Get required document count based on visa type
function getRequiredDocCount(userProfile: any): number {
  if (userProfile?.visa_type === "student") return 6;
  if (userProfile?.visa_type === "work") return 9;
  if (userProfile?.visa_type === "tourist") return 4;
  return 8;
}

export function useDashboardData(userProfile?: any): DashboardData {
  const { user } = useAuth();
  const userId = user?.id;
  
  const [data, setData] = useState<DashboardData>({
    userId: userId || '',
    userProfile: userProfile || null,
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
    error: null,
    refresh: async () => {}
  });

  const supabase = createClient();

  const fetchAllData = async () => {
    try {
      if (!userId) throw new Error('User ID required');

      // Parallel queries (not waterfall)
      const [
        messagesData,
        documentsData,
        progressData,
        seasonsData
      ] = await Promise.all([
        supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId),

        supabase
          .from('user_documents')
          .select('*', { count: 'exact' })
          .eq('user_id', userId),

        supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', userId)
          .single(),

        userProfile?.destination_country 
          ? supabase
              .from('user_pof_seasons')
              .select('*')
              .eq('user_id', userId)
              .order('season_number')
          : Promise.resolve({ data: null, error: null })
      ]);

      const messageCount = messagesData.count || 0;
      const documents = documentsData.data || [];
      const documentCount = documents.length;
      const approvedDocuments = documents.filter((doc: any) => doc.status === 'approved').length;
      
      const userProgress = progressData.data || {
        progress_percentage: 0,
        current_stage: 'onboarding',
        journey_started: null
      };

      const progressResult = calculateProgress(userProfile, messageCount, documentCount);
      
      const documentPercentage = documentCount > 0 ? (documentCount / getRequiredDocCount(userProfile)) * 100 : 0;
      const messagePercentage = messageCount > 0 ? (messageCount / 20) * 100 : 0;
      const overallProgress = (progressResult.progressPercentage + documentPercentage + messagePercentage) / 3;

      const pofSeasons = seasonsData.data || [];
      const activeSeason = pofSeasons.find((s: any) => s.status === 'in_progress')?.season_number || 1;

      const { data: recentMessages } = await supabase
        .from('messages')
        .select('id, content, role, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      setData({
        userId,
        userProfile,
        messageCount,
        recentMessages: recentMessages || [],
        documentCount,
        documents,
        approvedDocuments,
        progressPercentage: progressResult.progressPercentage,
        userProgress,
        pofSeasons,
        activeSeason,
        quickStats: {
          progressPercentage: Math.round(progressResult.progressPercentage),
          documentPercentage: Math.round(documentPercentage),
          messagePercentage: Math.round(messagePercentage),
          overallProgress: Math.round(overallProgress)
        },
        loading: false,
        error: null,
        refresh: fetchAllData
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId, userProfile]);

  return data;
}