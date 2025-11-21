// src/app/api/analytics/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { event, page, metadata = {} } = await request.json();
    
    if (!event || !page) {
      return NextResponse.json(
        { error: 'Event and page are required' },
        { status: 400 }
      );
    }

    // Get user if available
    const { data: { user } } = await supabase.auth.getUser();

    // Generate session ID for anonymous users
    const sessionId = user?.id 
      ? `user_${user.id}`
      : `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('📊 ANALYTICS TRACKING:', { event, page, metadata, user: user?.id });

    // Save to Supabase
    const { error } = await supabase
      .from('analytics_events')
      .insert({
        event,
        page,
        metadata,
        session_id: sessionId,
        user_id: user?.id || null,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Analytics save error:', error);
      // Still return success to not break user experience
    }

    return NextResponse.json({ 
      success: true,
      event,
      session_id: sessionId
    });
    
  } catch (error) {
    console.log('📊 Analytics error (silent):', error);
    // Always return success to not break user experience
    return NextResponse.json({ success: false });
  }
}