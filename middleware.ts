import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';
import { type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Skip intl middleware for technical routes
    if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
      return await updateSession(request)
    }

    const response = intlMiddleware(request);
    return await updateSession(request, response)
  } catch (error) {
    console.error('Middleware execution error:', error);
    // Return a default response instead of letting the middleware crash
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
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
