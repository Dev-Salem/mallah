import { NextResponse, type NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/lib/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

const intlMiddleware = createIntlMiddleware(routing);

const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify-email',
  '/verify-success'
];

const ADMIN_PANEL_PATH = process.env.ADMIN_PANEL_PATH || 'admin';

function isPublicRoute(pathname: string) {
  const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
  return PUBLIC_ROUTES.some(route => withoutLocale === route || withoutLocale.startsWith(route + '/'));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;
  const isAction = request.headers.has('next-action');
  
  console.log(`[Proxy] ${method} ${pathname} | Action: ${isAction}`);
  
  try {
    // 1. Handle system paths (bypass intl & guards)
    // CRITICAL: We also bypass for Server Actions to prevent redirects/rewrites from breaking the action response.
    if (isAction || pathname.startsWith('/auth/') || pathname.startsWith('/api/') || pathname.startsWith('/_next')) {
      console.log(`[Middleware] System/Action path detected. Bypassing complex logic.`);
      const { response } = await updateSession(request);
      return response;
    }

    // 2. Initialize intl middleware
    const intlResponse = intlMiddleware(request);
    
    // 3. Update Supabase session (refreshes if needed)
    const { response: finalResponse, user } = await updateSession(request, intlResponse);
    console.log(`[Middleware] Request: ${pathname}, User: ${user?.id || 'none'}, UA: ${request.headers.get('user-agent')?.slice(0, 50)}...`);

    // 4. Extract locale and routing info
    const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
    const isPublic = isPublicRoute(pathname);
    const withoutLocale = pathname.replace(/^\/(en|ar)/, '') || '/';
    const isAdminPath = withoutLocale === `/${ADMIN_PANEL_PATH}` || withoutLocale.startsWith(`/${ADMIN_PANEL_PATH}/`);

    // 5. Auth Guards
    if (!user && !isPublic) {
      console.warn(`[Middleware] AUTH DENIED: Path=${pathname}`);
      const loginUrl = new URL(`/${locale}/login`, request.url);
      const redirectResponse = NextResponse.redirect(loginUrl);
      finalResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }

    if (user) {
      // Redirect logged in users away from auth pages
      if (withoutLocale === '/login' || withoutLocale === '/register') {
        const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
        const redirectResponse = NextResponse.redirect(dashboardUrl);
        finalResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
      }

      // Feature-specific guards (Learner vs Admin)
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              cookiesToSet.forEach(({ name, value, options }) =>
                finalResponse.cookies.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: learner } = await supabase
        .from('learners')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single();

      const isDashboardRequest = withoutLocale === '/dashboard' || withoutLocale.startsWith('/dashboard/');
      const isSettingsRequest = withoutLocale === '/settings' || withoutLocale.startsWith('/settings/');
      const isOnboardingRequest = withoutLocale === '/onboarding' || withoutLocale.startsWith('/onboarding/');

      if (!isAdminPath && learner && !learner.onboarding_completed && (isDashboardRequest || isSettingsRequest) && !isOnboardingRequest) {
        console.log(`[Middleware] Onboarding incomplete. Redirecting.`);
        const onboardingUrl = new URL(`/${locale}/onboarding`, request.url);
        const redirectResponse = NextResponse.redirect(onboardingUrl);
        finalResponse.cookies.getAll().forEach(cookie => {
          redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
        });
        return redirectResponse;
      }
    }

    return finalResponse;
  } catch (e) {
    console.error(`[Middleware FATAL]`, e);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
