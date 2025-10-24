import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Only protect /checkout route
  if (request.nextUrl.pathname.startsWith('/checkout') && !user) {
    // Save the plan data from URL if exists
    const planParam = request.nextUrl.searchParams.get('plan');
    
    // Redirect to home with a message to log in
    const redirectUrl = new URL('/', request.url);
    redirectUrl.searchParams.set('auth', 'required');
    if (planParam) {
      redirectUrl.searchParams.set('plan', planParam);
    }
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*'],
};
