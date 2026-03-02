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
      // Handle password recovery → redirect to reset-password page
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/en/reset-password`)
      }

      // For signup / other flows → check onboarding status
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: learner } = await supabase
          .from('learners')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .single()

        if (learner && !learner.onboarding_completed) {
          return NextResponse.redirect(`${origin}/en/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}/en/dashboard`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`)
}

