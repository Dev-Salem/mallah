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
                brand: 'oklch(0.6171 0.1375 39.0427)',
                brandAccent: 'oklch(0.6171 0.1375 39.0427 / 0.8)',
                inputBackground: 'transparent',
                inputText: 'inherit',
                inputBorder: 'oklch(0.8847 0.0069 97.3627 / 0.2)',
                inputPlaceholder: 'oklch(0.6059 0.0075 97.4233)',
              },
              radii: {
                borderRadiusButton: '0.5rem',
                buttonPadding: '0.75rem',
                inputPadding: '0.75rem',
              },
            },
          },
          className: {
            container: 'flex flex-col gap-4',
            button: 'font-medium transition-all hover:scale-[1.02] active:scale-[0.98]',
            input: 'glass border-white/10 rounded-lg focus:ring-2 focus:ring-emerald-500/50 outline-none',
            label: 'text-sm font-medium text-white/70 mb-1',
          }
        }}
        theme="dark"
        showLinks={true}
        providers={[]} // Add 'github' or 'google' here if configured in Supabase Dashboard
        redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
      />
    </div>
  )
}
