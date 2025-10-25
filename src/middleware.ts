import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Only protect /checkout route
  if (request.nextUrl.pathname.startsWith('/checkout') && !user) {
    // Redirect to pricing page with clear message
    const redirectUrl = new URL('/your-next-steps', request.url);
    redirectUrl.searchParams.set('login_required', 'true');
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/checkout/:path*'],
};
