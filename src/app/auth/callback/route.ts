import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  
  // If no code, redirect to home
  if (!code) {
    console.error('❌ No authorization code received')
    return NextResponse.redirect(requestUrl.origin)
  }

  try {
    const cookieStore = await cookies()
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) => {
                cookieStore.set(name, value, options ?? {})
              })
            } catch (error) {
              // Cookie setting can fail in middleware, ignore
              console.warn('Cookie set warning:', error)
            }
          },
        },
      }
    )

    // Exchange the code for a session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Session exchange failed:', error.message)
      // Redirect to home with error
      return NextResponse.redirect(
        `${requestUrl.origin}?error=auth_failed`
      )
    }

    console.log('✅ Authentication successful:', data.user?.email)
    
    // Successful auth - redirect to intended destination
    return NextResponse.redirect(`${requestUrl.origin}${next}`)
    
  } catch (error) {
    console.error('💥 Unexpected error in callback:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}?error=server_error`
    )
  }
}