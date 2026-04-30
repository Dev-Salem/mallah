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
    // Bypass intl for specific system paths
    if (pathname.startsWith('/auth/') || pathname === '/auth' || pathname.startsWith('/api/') || pathname === '/api') {
      const { response } = await updateSession(request);
      return response;
    }

    // Run intl middleware first to handle routing/locales
    const intlResponse = intlMiddleware(request);

    // If intlMiddleware issued a redirect (e.g. locale prefix normalization),
    // update session cookies and return
    const isRedirect = intlResponse.headers.get('location');
    if (isRedirect) {
      const { response } = await updateSession(request, intlResponse);
      return response;
    }

    // For normal responses, apply route protection
    const { response: supabaseResponse, user } = await updateSession(request, intlResponse);

    const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
    const isPublic = isPublicRoute(pathname);
    const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
    const isAdminPath = ADMIN_PANEL_PATH && (withoutLocale === `/${ADMIN_PANEL_PATH}` || withoutLocale.startsWith(`/${ADMIN_PANEL_PATH}/`));

    // Authentication Guard
    if (!user) {
      if (!isPublic) {
        if (isAdminPath) {
          const adminLoginUrl = new URL(`/${locale}/${ADMIN_PANEL_PATH}/login`, request.url);
          return NextResponse.redirect(adminLoginUrl);
        }
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Role & Status Guards
    if (user) {
      if (!user.email_confirmed_at && !isPublic && !pathname.includes('/verify-success')) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      if (pathname.match(/^\/(en|ar)\/(login|register)$/)) {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        return NextResponse.redirect(dashboardUrl);
      }

      // Profile-based onboarding checks
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

      if (learner?.status === 'blocked' && !isPublic) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }

      const isLearnerDashboard = /^\/(en|ar)\/dashboard/.test(pathname);
      const isLearnerSettings = /^\/(en|ar)\/settings/.test(pathname);
      const isOnboarding = /^\/(en|ar)\/onboarding/.test(pathname);

      if (!isAdminPath && learner && !learner.onboarding_completed && (isLearnerDashboard || isLearnerSettings) && !isOnboarding) {
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        return NextResponse.redirect(onboardingUrl);
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
