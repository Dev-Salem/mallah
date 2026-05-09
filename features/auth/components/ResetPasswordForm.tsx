'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { resetPasswordSchema, type ResetPasswordFormData } from '../types'
import { resetPasswordAction } from '../actions/auth-actions'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function ResetPasswordForm() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [serverError, setServerError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
                    <p className="text-sm text-foreground">{t('resetPassword.successMessage')}</p>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* New Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                    {t('resetPassword.passwordLabel')}
                </label>
                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('password')}
                        className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm pr-12"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                </div>
                {errors.password && (
                    <span className="text-xs text-red-400">{t(errors.password.message!)}</span>
                )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-muted-foreground">
                    {t('resetPassword.confirmLabel')}
                </label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        {...register('confirmPassword')}
                        className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm pr-12"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1"
                        tabIndex={-1}
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </button>
                </div>
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
