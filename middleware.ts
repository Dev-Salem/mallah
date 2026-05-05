import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

const intlMiddleware = createMiddleware(routing);

const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || '';

// Routes that don't require authentication (without locale prefix)
const publicRoutes = ['/', '/login', '/register', '/register/check-email', '/forgot-password', '/reset-password', '/auth-error'];

function isPublicRoute(pathname: string): boolean {
  // Strip locale prefix (e.g. /en/login → /login, /login → /login)
  const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';

  // Standard learner public routes
  if (publicRoutes.includes(withoutLocale)) return true;

  // Admin obfuscated login
  if (ADMIN_PANEL_PATH && withoutLocale === `/${ADMIN_PANEL_PATH}/login`) return true;

  return false;
}

export async function middleware(request: NextRequest) {
  try {
    // ─── BYPASS: Server Action requests must not be intercepted ───
    // Next.js Server Actions use internal POST requests with a 'next-action' header.
    // If the middleware applies intl rewrites or auth redirects to these requests,
    // the RSC payload is corrupted, causing "An unexpected response was received from the server".
    if (request.headers.has('next-action')) {
      const { response } = await updateSession(request);
      return response;
    }

    const pathname = request.nextUrl.pathname;

    // ─── SECURITY: Block common admin path scanners ───
    const withoutLocaleCheck = pathname.replace(/^\/(en|ar)/, '') || '/';
    if (withoutLocaleCheck === '/admin' || withoutLocaleCheck.startsWith('/admin/') ||
      withoutLocaleCheck === '/administrator' || withoutLocaleCheck.startsWith('/administrator/')) {
      if (process.env.NODE_ENV === 'development') {
        const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
        const adminLoginUrl = new URL(`/${locale}/${ADMIN_PANEL_PATH}/login`, request.url);
        return NextResponse.redirect(adminLoginUrl);
      }
      return new NextResponse('Not Found', { status: 404 });
    }

    // ─── STANDARD LEARNER ROUTING ───
    if (pathname.startsWith('/auth/') || pathname === '/auth' || pathname.startsWith('/api/') || pathname === '/api') {
      const { response } = await updateSession(request);
      return response;
    }

    const intlResponse = intlMiddleware(request);
    const isRedirect = intlResponse.headers.get('location');
    if (isRedirect) {
      const { response, user } = await updateSession(request, intlResponse);
      console.log(`[Middleware] Redirecting to ${isRedirect}. User: ${user?.id || 'none'}`);
      return response;
    }

    const { response: supabaseResponse, user } = await updateSession(request, intlResponse);
    const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
    const isPublic = isPublicRoute(pathname);
    const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
    const isAdminPath = ADMIN_PANEL_PATH && (withoutLocale === `/${ADMIN_PANEL_PATH}` || withoutLocale.startsWith(`/${ADMIN_PANEL_PATH}/`));

    if (!user) {
      if (!isPublic) {
        console.log(`[Middleware] No user for protected route ${pathname}. Redirecting to login.`);
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    } else {
      console.log(`[Middleware] User ${user.id} authenticated. Path: ${pathname}`);
      
      // Fixed regex to include non-prefixed paths
      if (pathname.match(/^\/((en|ar)\/)?(login|register)$/) || pathname === '/login' || pathname === '/register') {
        console.log(`[Middleware] User already logged in, redirecting from ${pathname} to dashboard.`);
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }

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
        .select('*')
        .eq('user_id', user.id)
        .single();

      const isLearnerDashboard = pathname.match(/^\/(en|ar)\/dashboard/) || pathname === '/dashboard';
      const isLearnerSettings = pathname.match(/^\/(en|ar)\/settings/) || pathname === '/settings';
      const isOnboarding = pathname.match(/^\/(en|ar)\/onboarding/) || pathname === '/onboarding';

      if (!isAdminPath && learner && !learner.onboarding_completed && (isLearnerDashboard || isLearnerSettings) && !isOnboarding) {
        console.log(`[Middleware] Incomplete onboarding, redirecting to onboarding.`);
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        return NextResponse.redirect(onboardingUrl);
      }
    }

    return supabaseResponse;
  } catch (e) {
    console.error(`[Middleware FATAL ERROR]`, e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
