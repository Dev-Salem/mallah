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

  // Use the existing response or create a new one
  let supabaseResponse = existingResponse || NextResponse.next({ request })

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Update request cookies for downstream reads
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))

          // If no existing response was passed, recreate it per the canonical pattern
          // so the new request cookies are carried forward
          if (!existingResponse) {
            supabaseResponse = NextResponse.next({ request })
          }

          // Set cookies on the response so the browser stores them
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error) {
    console.warn(`[updateSession] getUser failed:`, error.message);
  }

  return { response: supabaseResponse, user, supabase }
}
