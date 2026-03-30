'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { adminLoginAction } from '../../../../../features/admin/actions/admin-auth-actions'

export default function AdminLoginPage() {
  const t = useTranslations('Admin.Login')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const adminBasePath = typeof window !== 'undefined'
    ? window.location.pathname.replace(/^\/(en|ar)\//, '/').split('/')[1]
    : ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await adminLoginAction(email, password)
      if (result.success) {
        // Navigate to admin dashboard with locale
        router.push(`/${locale}/${adminBasePath}/dashboard`)
        router.refresh()
      } else {
        setError(result.error || t('error'))
      }
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 selection:bg-blue-500/30">
      <div className="w-full max-w-sm">
        {/* Elite Minimal Box */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-zinc-700/30">
          <div className="mb-10 text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/20 mb-4 animate-pulse">
              <span className="text-blue-500 text-xl font-black italic font-serif">M</span>
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase italic italic">
              {t('title')}
            </h1>
            <div className="h-0.5 w-12 bg-blue-600/50 mx-auto rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="admin-email" className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                {t('email')}
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full px-4 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-300 font-medium"
                placeholder="root@mallah.io"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="admin-password" className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                {t('password')}
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all duration-300 font-medium"
                placeholder="••••••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg animate-in fade-in zoom-in duration-300">
                <p className="text-[11px] font-bold text-red-500/80 text-center uppercase tracking-wider leading-relaxed">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full py-4 bg-white text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-100 transition-all duration-300 shadow-2xl shadow-white/5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
            >
              <span className="relative z-10">
                {loading ? t('signingIn') : t('signIn')}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] font-mono italic">
              Mallah Command v4.0.0
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
