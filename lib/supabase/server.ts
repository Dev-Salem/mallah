import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            console.log(`[ServerClient] setAll called with ${cookiesToSet.length} cookies`);
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookieOptions = {
                ...options,
                path: '/', // Ensure path is always root
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const, // explicitly set for dev compatibility
              };
              console.log(`[ServerClient] Setting cookie: ${name}, Value prefix: ${value.slice(0, 10)}... Options:`, JSON.stringify(cookieOptions));
              cookieStore.set(name, value, cookieOptions)
            })
          } catch (error) {
            console.error(`[ServerClient] Failed to set cookies:`, error);
          }
        },
      },
    }
  )
}
