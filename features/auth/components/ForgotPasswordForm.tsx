'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../types'
import { forgotPasswordAction } from '../actions/auth-actions'
import { Link } from '@/lib/i18n/routing'
import { Button } from '@/components/ui/button'

export default function ForgotPasswordForm() {
    const t = useTranslations('Auth')
    const [isPending, startTransition] = useTransition()
    const [submitted, setSubmitted] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    })

    const onSubmit = (data: ForgotPasswordFormData) => {
        startTransition(async () => {
            await forgotPasswordAction(data)
            setSubmitted(true)
        })
    }

    if (submitted) {
        return (
            <div className="flex flex-col gap-6 text-center">
                <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg">
                    <p className="text-sm text-foreground">{t('forgotPassword.successMessage')}</p>
                </div>
                <Link
                    href="/login"
                    className="text-primary/80 hover:text-primary transition-colors text-sm font-medium"
                >
                    {t('forgotPassword.backToLogin')}
                </Link>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    {t('forgotPassword.emailLabel')}
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

            {/* Submit */}
            <Button
                type="submit"
                disabled={isPending}
                className="w-full py-3 font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                {isPending ? '...' : t('forgotPassword.submit')}
            </Button>

            {/* Back to Login */}
            <Link
                href="/login"
                className="text-center text-sm text-primary/80 hover:text-primary transition-colors"
            >
                {t('forgotPassword.backToLogin')}
            </Link>
        </form>
    )
}
