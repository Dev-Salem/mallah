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

export async function proxy(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // ─── SECURITY: Block common admin path scanners ───
    if (pathname === '/admin' || pathname.startsWith('/admin/') ||
      pathname === '/administrator' || pathname.startsWith('/administrator/')) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // ─── STANDARD LEARNER ROUTING (unchanged) ───
    const isLocalized = pathname.startsWith('/en') || pathname.startsWith('/ar');
    const isImplicitAdmin = pathname.startsWith(`/${ADMIN_PANEL_PATH}`);

    if (process.env.NODE_ENV === 'development' && isImplicitAdmin) {
      console.log(`[Middleware] Admin Path Detected: "${pathname}", Localized: ${isLocalized}, key: "${ADMIN_PANEL_PATH}"`);
    }

    // FORCE locale for admin paths if missing immediately at the top
    if (isImplicitAdmin && !isLocalized && ADMIN_PANEL_PATH) {
      const locale = 'en'; // Default
      const localizedUrl = new URL(`/${locale}${pathname}`, request.url);
      return NextResponse.redirect(localizedUrl);
    }
    if (pathname.startsWith('/auth/') || pathname === '/auth' || pathname.startsWith('/api/') || pathname === '/api') {
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

    const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
    const isPublic = isPublicRoute(pathname);
    const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
    const isAdminPath = ADMIN_PANEL_PATH && (withoutLocale === `/${ADMIN_PANEL_PATH}` || withoutLocale.startsWith(`/${ADMIN_PANEL_PATH}/`));

    // Not authenticated or restricted
    if (!user) {
      if (!isPublic) {
        // If at admin path, redirect to Admin Login
        if (isAdminPath) {
          const adminLoginUrl = new URL(`/${locale}/${ADMIN_PANEL_PATH}/login`, request.url);
          return NextResponse.redirect(adminLoginUrl);
        }
        // Otherwise, standard learner login redirect
        const loginUrl = new URL(`/${locale}/login`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    // Authenticated logic
    if (user) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';

      // 1. Block unverified users from protected routes (unless it's the verify-success page or public)
      if (!user.email_confirmed_at && !isPublic && !pathname.includes('/verify-success')) {
        const loginUrl = new URL(`/${locale}/login`, request.url);
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
