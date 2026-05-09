'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { useRouter } from '@/lib/i18n/routing'
import { registerSchema, type RegisterFormData } from '../types'
import { registerAction } from '../actions/auth-actions'
import { Link } from '@/lib/i18n/routing'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterForm() {
    const t = useTranslations('Auth')
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [serverError, setServerError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = (data: RegisterFormData) => {
        setServerError(null)
        startTransition(async () => {
            try {
                const result = await registerAction(data)
                if (!result.success && result.error) {
                    setServerError(t(result.error))
                } else if (result.success && result.redirectTo) {
                    router.push(result.redirectTo)
                }
            } catch (error) {
                console.error("Server Action Error:", error)
                setServerError(t('errors.generic'))
            }
        })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="firstName" className="text-sm font-medium text-muted-foreground">
                        {t('register.firstNameLabel')}
                    </label>
                    <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        {...register('firstName')}
                        className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm"
                        placeholder="Salem"
                    />
                    {errors.firstName && (
                        <span className="text-xs text-red-400">{t(errors.firstName.message!)}</span>
                    )}
                </div>
                <div className="flex flex-col gap-1.5">
                    <label htmlFor="lastName" className="text-sm font-medium text-muted-foreground">
                        {t('register.lastNameLabel')}
                    </label>
                    <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        {...register('lastName')}
                        className="w-full px-4 py-3 glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all font-mono text-sm"
                        placeholder="Al-Otaibi"
                    />
                    {errors.lastName && (
                        <span className="text-xs text-red-400">{t(errors.lastName.message!)}</span>
                    )}
                </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                    {t('register.emailLabel')}
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
                    {t('register.passwordLabel')}
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
                    {t('register.confirmPasswordLabel')}
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
                {isPending ? '...' : t('register.submit')}
            </Button>

            {/* Links */}
            <p className="text-center text-sm text-muted-foreground/60">
                {t('register.hasAccount')}{' '}
                <Link
                    href="/login"
                    className="text-primary/80 hover:text-primary transition-colors font-medium"
                >
                    {t('register.loginLink')}
                </Link>
            </p>
        </form>
    )
}
