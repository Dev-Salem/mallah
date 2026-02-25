import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Technical routes bypass intl
    if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {

      const { supabaseResponse } = await updateSession(request);
      return supabaseResponse;
    }

    const segments = pathname.split('/');
    const firstSegment = segments[1];
    const locale = routing.locales.includes(firstSegment as any)
      ? firstSegment
      : routing.defaultLocale;



    // 1. Get intl response
    let response = intlMiddleware(request);


    // 2. Update session and get user in one go
    const { supabaseResponse, user } = await updateSession(request, response);

    // 3. Routing Protection Logic
    const isProtectedRoute = pathname.includes('/dashboard') ||
      pathname.includes('/onboarding') ||
      pathname.includes('/admin');

    const isAuthRoute = pathname.includes('/login') ||
      pathname.includes('/register') ||
      pathname.includes('/forgot-password');

    const isOnboardingRoute = pathname.includes('/onboarding');
    const isAdminRoute = pathname.includes('/admin');
    const isDashboardRoute = pathname.includes('/dashboard');
    const isLandingPage = pathname === `/${locale}` || pathname === `/${locale}/`;

    // Reset password needs session from callback link, don't redirect away
    const isResetPasswordRoute = pathname.includes('/reset-password');

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (user) {
      // Create a dedicated supabase client for middleware DB queries
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet: any) {
            cookiesToSet.forEach(({ name, value }: any) => request.cookies.set(name, value))
          },
        },
      });

      // Fetch profile with onboarding status
      const { data: profile } = await supabase
        .from('users')
        .select('role, learners(onboarding_completed)')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        const learnersData = Array.isArray(profile.learners) ? profile.learners[0] : profile.learners;
        const onboardingCompleted = learnersData?.onboarding_completed ?? false;

        // Admin redirection
        if (profile.role === 'admin') {
          if (!isAdminRoute) {
            const redirectUrl = new URL(`/${locale}/admin/dashboard`, request.url);
            return NextResponse.redirect(redirectUrl);
          }
        }
        // Learner redirection
        else {
          if (!onboardingCompleted && !isOnboardingRoute && !isAuthRoute && !isResetPasswordRoute) {
            const redirectUrl = new URL(`/${locale}/onboarding`, request.url);
            return NextResponse.redirect(redirectUrl);
          }

          if (onboardingCompleted && isOnboardingRoute) {
            const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(redirectUrl);
          }

          if (isAuthRoute && !isResetPasswordRoute) {
            const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
            return NextResponse.redirect(redirectUrl);
          }
        }
      }
    }

    return supabaseResponse;
  } catch (error) {
    console.error('Middleware execution error:', error);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
