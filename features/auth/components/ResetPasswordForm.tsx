'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, type ResetPasswordFormData } from '../types'
import { resetPasswordAction } from '../actions/auth-actions'
import { Button } from '@/components/ui/button'

export default function ResetPasswordForm() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    })

    const onSubmit = (data: ResetPasswordFormData) => {
        setServerError(null)
        startTransition(async () => {
            const result = await resetPasswordAction(data)
            if (!result.success && result.error) {
                setServerError(t(result.error))
            } else {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/login')
                }, 2000)
            }
        })
    }

    if (success) {
        return (
            <div className="flex flex-col gap-6 text-center">
                <div className="p-4 border border-primary/30 bg-primary/5 rounded-lg">
                    <p className="text-sm text-white/80">{t('resetPassword.successMessage')}</p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-white/70">
                    {t('resetPassword.passwordLabel')}
                </label>
                <input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    {...register('password')}
                    className="w-full px-4 py-3 glass border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-white placeholder:text-white/30 transition-all"
                    placeholder="••••••••"
                />
                {errors.password && (
                    <span className="text-xs text-red-400">{t(errors.password.message!)}</span>
                )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white/70">
                    {t('resetPassword.confirmLabel')}
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className="w-full px-4 py-3 glass border-white/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-white placeholder:text-white/30 transition-all"
                    placeholder="••••••••"
                />
                {errors.confirmPassword && (
                    <span className="text-xs text-red-400">{t(errors.confirmPassword.message!)}</span>
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
                {isPending ? '...' : t('resetPassword.submit')}
            </Button>
        </form>
    )
}
