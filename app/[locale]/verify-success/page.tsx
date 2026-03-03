import { Logo } from '@/components/ui/logo'
import { Card } from '@/components/ui/card'
import { getTranslations, getLocale } from 'next-intl/server'
import { CheckCircle2 } from 'lucide-react'

export default async function VerifySuccessPage() {
    const t = await getTranslations('Auth.verifySuccess')
    const locale = await getLocale()

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
                </div>

                <Card className="glass border-primary/20 rounded-none p-8 relative overflow-hidden group glow-border flex flex-col items-center text-center">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                    <div className="mb-6 relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                        <CheckCircle2 className="h-16 w-16 text-primary relative" />
                    </div>

                    <h1 className={`text-2xl font-black text-white mb-4 uppercase ${locale !== 'ar' ? 'tracking-tighter' : ''}`}>
                        {t('title')}
                    </h1>

                    <p className="text-sm text-white/60 leading-relaxed mb-8">
                        {t('message')}
                    </p>

                    <div className={`pt-6 border-t border-white/5 w-full text-[8px] font-mono text-white/20 uppercase ${locale !== 'ar' ? 'tracking-widest' : ''}`}>
                        <span>STATUS: VERIFIED</span>
                    </div>
                </Card>
            </div>
        </div>
    )
}
