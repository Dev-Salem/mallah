import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Default locale handling
  const referer = request.headers.get('referer')
  const locale = referer?.includes('/ar') ? 'ar' : 'en'
  const localePath = locale === 'en' ? '' : `/${locale}`

  try {
    if (code) {
      const supabase = await createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (!error) {
        const type = searchParams.get('type')
        const next = searchParams.get('next')

        // Handle password recovery → redirect to reset-password page
        if (type === 'recovery' || next === '/reset-password') {
          return NextResponse.redirect(`${origin}${localePath}/reset-password`)
        }

        // For signup / other flows → redirect to verify-success page
        return NextResponse.redirect(`${origin}${localePath}/verify-success`)
      }
      
      console.error('Auth callback error:', error)
    }
  } catch (err) {
    console.error('Auth callback unexpected error:', err)
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}${localePath}/auth-error`)
}

