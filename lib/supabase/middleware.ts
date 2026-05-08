import { createServerClient } from '@supabase/ssr'
import { type User, type SupabaseClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, existingResponse?: NextResponse): Promise<{ response: NextResponse; user: User | null; supabase: SupabaseClient | null }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('CRITICAL: Supabase environment variables are missing in middleware.');
    return { response: existingResponse || NextResponse.next({ request }), user: null, supabase: null };
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
          console.log(`[updateSession] Setting cookies: ${cookiesToSet.map(c => c.name).join(', ')}`);
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          
          // We don't overwrite supabaseResponse with NextResponse.next() here
          // because it would lose any existing redirect/rewrite headers from next-intl.
          // Instead, we just set the cookies on the existing response object.
          
          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              secure: process.env.NODE_ENV === 'production',
            };
            console.log(`[updateSession] Setting cookie: ${name}, Options:`, JSON.stringify(cookieOptions));
            supabaseResponse.cookies.set(name, value, cookieOptions)
          })
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and getUser(). A simple
  // mistake can make it very hard to debug issues with emails being sent multiple times.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  const cookieNames = request.cookies.getAll().map(c => c.name);
  console.log(`[updateSession] Cookies present: ${cookieNames.join(', ')}`);

  if (error) {
    console.warn(`[updateSession] Error getting user:`, error.message);
  } else {
    console.log(`[updateSession] User found: ${user?.id || 'none'}`);
  }

  return { response: supabaseResponse, user, supabase }
}
