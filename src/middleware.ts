import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

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

    // Reset password needs session from callback link, don't redirect away
    const isResetPasswordRoute = pathname.includes('/reset-password');

    // Redirect to login if accessing protected route without session
    if (isProtectedRoute && !user) {
      const redirectUrl = new URL(`/${locale}/login`, request.url);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect to dashboard if logged in and accessing auth routes
    if (isAuthRoute && !isResetPasswordRoute && user) {
      const redirectUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(redirectUrl);
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
