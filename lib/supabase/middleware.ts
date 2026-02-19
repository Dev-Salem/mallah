import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, existingResponse?: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing in middleware.');
    return existingResponse || NextResponse.next({ request });
  }

  let supabaseResponse = existingResponse || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))

          // Use the existing response if it exists, otherwise create a new one
          if (!supabaseResponse) {
            supabaseResponse = NextResponse.next({
              request,
            })
          }

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and getUser(). A simple
  // mistake can make it very hard to debug issues with emails being sent multiple times.
  const { data: { user } } = await supabase.auth.getUser()

  // Onboarding redirect logic
  const pathname = request.nextUrl.pathname;
  const isOnboardingPage = pathname.includes('/onboarding');
  const isAuthRoute = pathname.startsWith('/auth');
  const isPublicAuthPage = pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forgot-password') ||
    pathname.includes('/reset-password');

  if (user && !isAuthRoute && !isPublicAuthPage) {
    const { data: profile } = await supabase
      .from('learners')
      .select('onboarding_completed')
      .eq('user_id', user.id)
      .single();

    const onboardingCompleted = profile?.onboarding_completed ?? false;

    if (!onboardingCompleted && !isOnboardingPage) {
      // Extract locale from pathname (e.g., /en/dashboard -> en)
      const pathParts = pathname.split('/').filter(Boolean);
      const locale = ['en', 'ar'].includes(pathParts[0]) ? pathParts[0] : 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/onboarding`;
      return NextResponse.redirect(url);
    }

    if (onboardingCompleted && isOnboardingPage) {
      const pathParts = pathname.split('/').filter(Boolean);
      const locale = ['en', 'ar'].includes(pathParts[0]) ? pathParts[0] : 'en';
      const url = request.nextUrl.clone();
      url.pathname = `/${locale}/dashboard`;
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse
}

