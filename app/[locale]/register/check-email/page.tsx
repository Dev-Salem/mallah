import { getTranslations } from 'next-intl/server'
import { Link } from '@/lib/i18n/routing'
import { Logo } from '@/components/ui/logo'
import { Card } from '@/components/ui/card'
import { ArrowRight, Mail } from 'lucide-react'
import { getLocale } from 'next-intl/server'
import CheckEmailClient from './CheckEmailClient'

export default async function CheckEmailPage() {
    const t = await getTranslations('Auth')
    const locale = await getLocale()

    return (
        <div className="relative min-h-screen bg-background flex items-center justify-center p-6 overflow-hidden">
            {/* Visual Infrastructure */}
            <div className="fixed inset-0 noise z-[100] mix-blend-overlay opacity-50 dark:opacity-100 pointer-events-none" />
            <div className="fixed inset-0 hud-grid opacity-[0.05] dark:opacity-[0.4] pointer-events-none" />
            <div className="fixed inset-0 scanline z-[101] pointer-events-none opacity-20 dark:opacity-100" />

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12">
                    <div className="inline-block transform mb-8 p-1 border border-primary/20 glass">
                        <Mail size={48} className="text-primary m-4" />
                    </div>
                    <h1 className={`text-3xl font-black text-foreground mb-2 uppercase ${locale !== 'ar' ? 'tracking-tighter' : ''}`}>
                        {t('checkEmail.title')}
                    </h1>
                </div>

                <Card className="glass border-primary/20 rounded-none p-8 relative overflow-hidden group glow-border">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <div className="flex flex-col gap-6 text-center py-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {t('checkEmail.message')}
                        </p>

                        <div className="pt-4">
                            <CheckEmailClient />
                        </div>
                    </div>

                    <div className={`mt-8 pt-8 border-t border-border flex justify-between items-center text-[8px] font-mono text-muted-foreground/30 uppercase ${locale !== 'ar' ? 'tracking-widest' : ''}`}>
                        <span>ENC: AES-256</span>
                        <span>MALLAH_CORE_v4.0.2</span>
                    </div>
                </Card>

                <div className="mt-8 text-center">
                    <Link href="/login" className={`text-[10px] uppercase ${locale !== 'ar' ? 'tracking-[0.3em]' : ''} text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-3 group`}>
                        <ArrowRight className={`h-3 w-3 group-hover:-translate-x-1 transition-transform rotate-180 ${locale === 'ar' ? 'rotate-0' : ''}`} />
                        {t('login.title')}
                    </Link>
                </div>
            </div>
        </div>
    )
}
