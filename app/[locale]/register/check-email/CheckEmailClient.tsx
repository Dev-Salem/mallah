'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { resendVerificationEmailAction } from '@/features/auth/actions/auth-actions'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CheckEmailClient() {
    const t = useTranslations('Auth')
    const [timeLeft, setTimeLeft] = useState(0)
    const [isResending, setIsResending] = useState(false)
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
    const [email] = useState(() => {
        // Try to retrieve email from local storage or session where the register form might have saved it,
        // or prompt user if not available. For now, we depend on a simple input if not passed to prevent leaking state.
        if (typeof window !== 'undefined') {
            return localStorage.getItem('lastRegisteredEmail') || ''
        }
        return ''
    })

    const [inputEmail, setInputEmail] = useState(email)

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [timeLeft])

    const handleResend = async () => {
        if (!inputEmail) {
            setFeedback({ type: 'error', message: t('checkEmail.emailRequired') })
            return
        }

        setIsResending(true)
        setFeedback(null)

        try {
            const result = await resendVerificationEmailAction(inputEmail)

            if (result.success) {
                setFeedback({ type: 'success', message: t('checkEmail.resendSuccess') })
                setTimeLeft(60) // 60 seconds cooldown
            } else {
                setFeedback({ type: 'error', message: t(result.error || 'errors.generic') })
            }
        } catch (error) {
            setFeedback({ type: 'error', message: t('errors.generic') })
        } finally {
            setIsResending(false)
        }
    }

    return (
        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
            {!email && (
                <div className="flex flex-col gap-1.5 text-left mb-2">
                    <label htmlFor="resend-email" className="text-xs font-medium text-muted-foreground">
                        {t('checkEmail.enterEmailResend')}
                    </label>
                    <input
                        id="resend-email"
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className="w-full px-4 py-2 text-sm glass border-primary/10 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none text-foreground placeholder:text-muted-foreground/40 transition-all"
                        placeholder="you@example.com"
                    />
                </div>
            )}

            <Button
                onClick={handleResend}
                disabled={timeLeft > 0 || isResending || !inputEmail}
                variant="outline"
                className="w-full border-primary/20 hover:bg-primary/10 transition-colors"
            >
                {isResending
                    ? '...'
                    : timeLeft > 0
                        ? t('checkEmail.resendWait', { seconds: timeLeft })
                        : t('checkEmail.resendButton')}
            </Button>

            {feedback && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm border ${feedback.type === 'success'
                        ? 'border-success/30 bg-success/5 text-success'
                        : 'border-destructive/30 bg-destructive/5 text-destructive'
                    }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                    <span>{feedback.message}</span>
                </div>
            )}
        </div>
    )
}
