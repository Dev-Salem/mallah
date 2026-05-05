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
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookieOptions = {
                ...options,
                secure: process.env.NODE_ENV === 'production',
              };
              console.log(`[ServerClient] Setting cookie: ${name}, Options:`, JSON.stringify(cookieOptions));
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
