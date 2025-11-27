// src/app/api/chat/route.ts - FIXED VERSION
import { NextRequest, NextResponse } from 'next/server';
import { visaChatAssistant } from '@/ai/flows/visa-chat-assistant';
import { createClient } from '@/lib/supabase/server';
import { extractVisaIntent, configureUserFromIntent } from '@/lib/visa-intent';
import { detectMilestoneFromMessage, getTimelineGuidance, MilestoneUpdate } from '@/lib/progress-updater';


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, wishCount = 1, conversationHistory = [] } = body;

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Question is required and must be a string' },
        { status: 400 }
      );
    }

    let userContext: any = {};
    let userProgress: any = null;
    let isSignedIn = false;
    let currentUser: any = null;

    try {
      const supabase = await createClient();
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (user && !authError) {
        isSignedIn = true;
        currentUser = user;
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          userContext = {
            name: profile.preferred_name || user.user_metadata?.name || user.email?.split('@')[0],
            country: profile.country,
            destination: profile.destination_country,
            profession: profile.profession,
            visaType: profile.visa_type,
            age: profile.age,
            dateOfBirth: profile.date_of_birth,
            userType: profile.user_type,
            timelineUrgency: profile.timeline_urgency,
          };

          const { data: progress } = await supabase
            .from('user_progress')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (progress) {
            userProgress = {
              progressPercentage: progress.progress_percentage || 0,
              currentStage: progress.current_stage || 'Getting Started',
              nextMilestone: progress.next_milestone || 'Complete your profile',
              completedMilestones: {
                profile: progress.profile_completed || false,
                documentsUploaded: progress.documents_uploaded || false,
                documentsVerified: progress.documents_verified || false,
                financialReady: progress.financial_proof_ready || false,
                interviewPrepared: progress.interview_prepared || false,
                applicationSubmitted: progress.application_submitted || false,
                decisionReceived: progress.decision_received || false,
              },
              daysUntilDeadline: progress.days_until_deadline,
              daysUntilTravel: progress.days_until_travel,
              urgent: progress.urgent || false,
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user context:', error);
    }

    const assistantInput = {
      question,
      wishCount,
      conversationHistory,
      userContext,
      progressContext: userProgress,
      isSignedIn,
    };

    const result = await visaChatAssistant(assistantInput);

    if (isSignedIn && currentUser) {
      try {
        const supabase = await createClient();
        
        await supabase.from('messages').insert({
          user_id: currentUser.id,
          content: question,
          sender: 'user',
          session_id: body.sessionId || null,
        });

        await supabase.from('messages').insert({
          user_id: currentUser.id,
          content: result.answer,
          sender: 'assistant',
          session_id: body.sessionId || null,
        });

        let milestone: MilestoneUpdate | null = null;
        try {
          milestone = await detectMilestoneFromMessage(question, currentUser.id);
        } catch (err) {
          console.error("Milestone detection failed:", err);
        }

        const updateData: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };

        if (milestone) {
          updateData[milestone.field] = milestone.value;
        }

        await supabase
          .from("user_progress")
          .update(updateData)
          .eq("user_id", currentUser.id);

      } catch (error) {
        console.error('Error saving messages or updating progress:', error);
      }
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process question', details: error.message },
      { status: 500 }
    );
  }
}