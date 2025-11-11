import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;
  
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`);
    }
    
    // Check if user was trying to access a specific page
    const next = requestUrl.searchParams.get('next');
    if (next) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }
  
  // Check for returnTo parameter or default to dashboard
  const returnTo = requestUrl.searchParams.get('returnTo') || '/dashboard';
  return NextResponse.redirect(`${origin}${returnTo}`);
}
