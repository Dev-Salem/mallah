import AuthForm from '@/components/auth/auth-form'
import { Logo } from '@/components/ui/logo'
import { Card } from '@/components/ui/card'
import { Link } from '@/lib/i18n/routing'
import { ArrowRight } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'

export default async function LoginPage() {
  const t = await getTranslations('Login');
  const locale = await getLocale();

  return (
    <div className={`relative min-h-screen bg-background ${locale === 'ar' ? 'font-arabic' : 'font-sans'} flex items-center justify-center p-6 overflow-hidden`}>
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 carto-grid opacity-[0.4] pointer-events-none" />
      
      {/* Decorative Cartography Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/5" />
      <div className="absolute top-1/2 left-0 w-full h-px bg-white/5" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-block transform hover:rotate-12 transition-transform duration-500 mb-8">
            <Logo size={64} />
          </div>
          <h1 className="text-4xl font-serif text-white mb-3">{t('title')}</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-bold">{t('terminal')}</p>
        </div>

        <Card className="glass border-white/5 rounded-none p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          <AuthForm />
          
          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
            <span>ENC: AES-256</span>
            <span>Mallah-Core v4.0.2</span>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2">
            <ArrowRight className={`h-3 w-3 ${locale === 'ar' ? '' : 'rotate-180'}`} /> {t('back')}
          </Link>
        </div>
      </div>
    </div>
  )
}
