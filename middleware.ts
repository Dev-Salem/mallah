import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

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

    // Authenticated → trying to access login/register → redirect to dashboard
    if (user && (pathname.match(/^\/(en|ar)\/(login|register)$/))) {
      const locale = pathname.match(/^\/(en|ar)/)?.[1] || 'en';
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
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
