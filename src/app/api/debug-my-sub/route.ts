import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not signed in' });
    }
    
    console.log('🔍 Checking subscription for user:', user.id);
    
    // Check ALL subscriptions for this user
    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json({ error: 'Database error: ' + error.message });
    }
    
    return NextResponse.json({ 
      user_id: user.id,
      has_subscriptions: subscriptions?.length > 0,
      subscriptions: subscriptions,
      subscription_count: subscriptions?.length || 0
    });
    
  } catch (error: any) {
    return NextResponse.json({ error: 'Debug error: ' + error.message });
  }
}
