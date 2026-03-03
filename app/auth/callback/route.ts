import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Determine locale from referer or default to en
      const referer = request.headers.get('referer')
      const locale = referer?.includes('/ar/') ? 'ar' : 'en'

      const type = searchParams.get('type')
      const next = searchParams.get('next')

      // Handle password recovery → redirect to reset-password page
      if (type === 'recovery' || next === '/reset-password') {
        return NextResponse.redirect(`${origin}/${locale}/reset-password`)
      }

      // For signup / other flows → redirect to verify-success page
      return NextResponse.redirect(`${origin}/${locale}/verify-success`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`)
}

