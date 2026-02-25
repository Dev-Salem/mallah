import { ForgotPasswordForm } from '@/features/auth/components/ForgotPasswordForm'
import { Logo } from '@/components/ui/logo'
import { Card } from '@/components/ui/card'
import { Link } from '@/lib/i18n/routing'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server';

export default async function ForgotPasswordPage() {
    const t = await getTranslations('ForgotPassword');
    const locale = await getLocale();

    return (
        <div className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
            {/* Visual Infrastructure */}
            <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
            <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
            <div className="fixed inset-0 scanline z-[101] pointer-events-none" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12">
                    <div className="inline-block transform hover:rotate-12 transition-transform duration-500 mb-8 p-1 border border-primary/20 glass">
                        <Logo size={64} />
                    </div>
                    <h1 className={`text-3xl font-black text-white mb-2 uppercase ${locale !== 'ar' ? 'tracking-tighter' : ''}`}>
                        {t('title')}
                    </h1>
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-1 w-1 bg-primary animate-pulse" />
                        <p className={`text-[10px] uppercase ${locale !== 'ar' ? 'tracking-[0.4em]' : ''} text-primary font-bold`}>
                            {t('subtitle')}
                        </p>
                    </div>
                </div>

                <Card className="glass border-primary/20 rounded-none p-8 relative overflow-hidden group glow-border">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <ForgotPasswordForm />

                    <div className={`mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase ${locale !== 'ar' ? 'tracking-widest' : ''}`}>
                        <span>RECOVERY_MODULE</span>
                        <span>MALLAH_CORE_v4.0.2</span>
                    </div>
                </Card>

                <div className="mt-8 text-center">
                    <Link href="/login" className={`text-[10px] uppercase ${locale !== 'ar' ? 'tracking-[0.3em]' : ''} text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-3 group`}>
                        {locale === 'ar' ? (
                            <>
                                {t('backToLogin')}
                                <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                            </>
                        ) : (
                            <>
                                <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" />
                                {t('backToLogin')}
                            </>
                        )}
                    </Link>
                </div>
            </div>
        </div>
    )
}
