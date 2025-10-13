// src/app/auth/callback/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(new URL('/?error=no_code', req.url))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  // ❗️ surface the real error
  if (error) {
    return NextResponse.redirect(
      new URL(`/?error=exchange_fail&desc=${encodeURIComponent(error.message)}`, req.url)
    )
  }
  if (!data.session) {
    return NextResponse.redirect(new URL('/?error=no_session', req.url))
  }

  return NextResponse.redirect(new URL('/', req.url), 307)
}