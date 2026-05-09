import { type NextRequest } from 'next/server'

import { updateSession } from '@/lib/supabase/middleware'

import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './lib/i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function proxy(request: NextRequest) {
  // 1. Update session (Supabase)
  let response = await updateSession(request)
  
  // If session update triggered a redirect, return it immediately
  if (response.status === 307 || response.status === 308) {
    return response
  }

  // Skip intl for auth and api routes
  const pathname = request.nextUrl.pathname
  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    return response
  }

  // 2. Handle internationalization (next-intl)
  const intlResponse = intlMiddleware(request)

  // 3. Merge cookies from Supabase response into Intl response
  // This preserves session updates while allowing localized routing
  response.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie)
  })

  return intlResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
