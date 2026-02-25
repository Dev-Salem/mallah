'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@/lib/supabase/client'

export default function AuthForm() {
  const supabase = createClient()

  return (
    <div className="w-full">
      <Auth
        supabaseClient={supabase}
        view="magic_link"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: 'var(--primary)',
                brandAccent: 'var(--primary)',
                inputBackground: 'transparent',
                inputText: 'inherit',
                inputBorder: 'var(--border)',
                inputPlaceholder: 'var(--muted-foreground)',
              },
              radii: {
                borderRadiusButton: 'var(--radius)',
              },
            },
          },
          className: {
            container: 'flex flex-col gap-4',
            button: 'font-medium transition-all hover:scale-[1.02] active:scale-[0.98]',
            input: 'glass border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none',
            label: 'text-sm font-medium text-white/70 mb-1',
          }
        }}
        theme="dark"
        showLinks={false}
        providers={[]} // Add 'github' or 'google' here if configured in Supabase Dashboard
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
      />
    </div>
  )
}
