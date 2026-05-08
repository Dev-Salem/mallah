'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useRouter } from '@/lib/i18n/routing'
import { loginSchema, type LoginFormData } from '../types'
import { loginAction } from '../actions/auth-actions'
import { Link } from '@/lib/i18n/routing'
import { Button } from '@/components/ui/button'

export default function LoginForm() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (data: LoginFormData) => {
        setServerError(null)
        startTransition(async () => {
            const result = await loginAction(data)
            
            if (result && !result.success) {
                if (result.error) {
                    setServerError(t(result.error))
                }
            } else if (result && result.success && result.redirectTo) {
                // IMPORTANT: Client-side redirect ensures cookies are saved by the browser
                // before the next page load.
                router.push(result.redirectTo);
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    {t('login.emailLabel')}
                </label>
                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm"
                    placeholder="salem@mallah.io"
                />
                {errors.email && (
                    <span className="text-xs text-red-400">{t(errors.email.message!)}</span>
                )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    {t('login.passwordLabel')}
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    {...register('password')}
                    className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm"
                    placeholder="••••••••"
                />
                {errors.password && (
                    <span className="text-xs text-red-400">{t(errors.password.message!)}</span>
                )}
            </div>

            {/* Server Error */}
            {serverError && (
                <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-lg">
                    <p className="text-sm text-red-400">{serverError}</p>
                </div>
            )}

            {/* Submit */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-3 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {isPending ? '...' : t('login.submit')}
            </Button>

            {/* Links */}
            <div className="flex flex-col gap-3 text-center text-sm">
                <Link
                    href="/forgot-password"
                    className="text-primary/80 hover:text-primary transition-colors"
                >
                    {t('login.forgotPassword')}
                </Link>
                <p className="text-muted-foreground/60">
                    {t('login.noAccount')}{' '}
                    <Link
                        href="/register"
                        className="text-primary/80 hover:text-primary transition-colors font-medium"
                    >
                        {t('login.registerLink')}
                    </Link>
                </p>
            </div>
        </form>
    )
}
