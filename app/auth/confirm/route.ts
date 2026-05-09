import { type EmailOtpType } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const _next = searchParams.get('next')
  const next = _next?.startsWith('/') ? _next : '/'

  const referer = request.headers.get('referer')
  const locale = referer?.includes('/ar') ? 'ar' : 'en'
  const localePath = locale === 'en' ? '' : `/${locale}`

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      // ensure next is localized if needed
      const localizedNext = next.startsWith('/') ? `${localePath}${next}` : next
      return NextResponse.redirect(`${origin}${localizedNext === '/' && localePath ? localePath : localizedNext}`)
    } else {
      // redirect the user to an error page with some instructions
      return NextResponse.redirect(`${origin}${localePath}/auth-error?error=${encodeURIComponent(error?.message)}`)
    }
  }

  // redirect the user to an error page with some instructions
  return NextResponse.redirect(`${origin}${localePath}/auth-error?error=Missing token hash or type`)
}
