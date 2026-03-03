import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware(routing);

// Routes that don't require authentication (without locale prefix)
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/auth-error'];

function isPublicRoute(pathname: string): boolean {
  // Strip locale prefix (e.g. /en/login → /login, /login → /login)
  const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  return publicRoutes.includes(withoutLocale);
}

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Skip intl middleware for technical routes
    if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
      const { response } = await updateSession(request);
      return response;
    }

    // Run intl middleware first
    const intlResponse = intlMiddleware(request);

    // If intlMiddleware issued a redirect (e.g. locale prefix normalization),
    // just update the session cookies on it and return — no auth logic needed
    const isRedirect = intlResponse.headers.get('location');
    if (isRedirect) {
      const { response } = await updateSession(request, intlResponse);
      return response;
    }

    // For normal (non-redirect) responses, apply route protection
    const { response: supabaseResponse, user } = await updateSession(request, intlResponse);

    const isPublic = isPublicRoute(pathname);

    // Not authenticated → trying to access protected route → redirect to login
    if (!user && !isPublic) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
      const loginUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Authenticated logic
    if (user) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';

      // 1. Block unverified users from protected routes (unless it's the verify-success page or public)
      if (!user.email_confirmed_at && !isPublic && !pathname.includes('/verify-success')) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        // We can't easily logout here, but we can redirect to login with an error or just block
        return NextResponse.redirect(loginUrl);
      }

      // 2. Auth Page Guard: Redirect authenticated users AWAY from login/register
      if (pathname.match(/^\/(en|ar)\/(login|register)$/)) {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }

      // 3. Status & Role Guard (Fetch profile)
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            },
          },
        }
      )

      const { data: learner } = await supabase
        .from('learners')
        .select('role, onboarding_completed, status')
        .eq('user_id', user.id)
        .single();

      // Blocked account check
      if (learner?.status === 'blocked' && !isPublic) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      // 4. Onboarding Guard: Redirect to /onboarding if not completed
      const isDashboard = pathname.includes('/dashboard');
      const isSettings = pathname.includes('/settings');
      const isOnboarding = pathname.includes('/onboarding');

      if (learner && !learner.onboarding_completed && (isDashboard || isSettings) && !isOnboarding) {
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        return NextResponse.redirect(onboardingUrl);
      }

      // 5. Admin Guard
      const isAdminArea = pathname.includes('/admin');
      if (isAdminArea && learner?.role !== 'admin') {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
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
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
