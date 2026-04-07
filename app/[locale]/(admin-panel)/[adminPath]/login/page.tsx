'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { adminLoginAction } from '../../../../../features/admin/actions/admin-auth-actions'
import { Logo } from '@/components/ui/logo'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

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
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="items-center text-center space-y-4 pb-2">
            <Logo size={48} />
            <div className="space-y-1">
              <h1 className="text-xl font-semibold text-card-foreground tracking-tight">
                {t('title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                Admin Console
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">{t('email')}</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@mallah.io"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">{t('password')}</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-xs font-medium text-destructive text-center">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? t('signingIn') : t('signIn')}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-xs text-muted-foreground">
              Mallah Admin v4.0
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
