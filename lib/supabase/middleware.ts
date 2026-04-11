import { createServerClient } from '@supabase/ssr'
import { type User } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, existingResponse?: NextResponse): Promise<{ response: NextResponse; user: User | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing in middleware.');
    return { response: existingResponse || NextResponse.next({ request }), user: null };
  }

  let supabaseResponse = existingResponse || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
          // Preserve existing headers (like next-intl rewrites)
          existingResponse?.headers.forEach((value, key) => {
            supabaseResponse.headers.set(key, value);
          });
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and getUser(). A simple
  // mistake can make it very hard to debug issues with emails being sent multiple times.
  const { data: { user } } = await supabase.auth.getUser()

  return { response: supabaseResponse, user }
}
