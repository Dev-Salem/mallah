import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Handle password recovery → redirect to reset-password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/en/reset-password`)
      }

      // Handle email signup verification → redirect to dashboard
      if (type === 'signup') {
        return NextResponse.redirect(`${origin}/en/dashboard`)
      }

      // Default: follow the `next` parameter
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`)
}
