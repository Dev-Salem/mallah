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
          const allCookies = request.cookies.getAll();
          console.log(`[updateSession] getAll: Found ${allCookies.length} cookies`);
          return allCookies;
        },
        setAll(cookiesToSet) {
          console.log(`[updateSession] setAll: Setting ${cookiesToSet.length} cookies`);
          
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          cookiesToSet.forEach(({ name, value, options }) => {
            const cookieOptions = {
              ...options,
              path: '/', // Always root
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax' as const,
            };
            console.log(`[updateSession] Response set: ${name}, Options:`, JSON.stringify(cookieOptions));
            supabaseResponse.cookies.set(name, value, cookieOptions);
          });
        },
      },
    }
  )

  // This will trigger setAll if the session needs refreshing
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.warn(`[updateSession] getUser failed:`, error.message);
  } else if (user) {
    console.log(`[updateSession] getUser success: ${user.id}`);
  } else {
    console.log(`[updateSession] getUser: No session found`);
  }

  return { response: supabaseResponse, user, supabase }
}
