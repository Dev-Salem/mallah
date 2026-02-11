import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/routing";
import { 
  ArrowRight, 
} from "lucide-react";
import { Logo, LogoText } from "@/components/ui/logo";
import { getTranslations, getLocale } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations();
  const locale = await getLocale();

  const navItems = [
    { key: 'gap', id: 'the-gap' },
    { key: 'process', id: 'process' },
    { key: 'features', id: 'features' },
    { key: 'outcomes', id: 'outcomes' }
  ];

  return (
    <div className={`relative min-h-screen bg-background ${locale === 'ar' ? 'font-arabic' : 'font-sans'} selection:bg-primary selection:text-primary-foreground overflow-x-hidden`}>
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 carto-grid opacity-[0.4] pointer-events-none" />
      
      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 glass">
        <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
          <LogoText />
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-10">
              {navItems.map((item) => (
                <a 
                  key={item.key} 
                  href={`#${item.id}`} 
                  className="text-[11px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-primary transition-all duration-300"
                >
                  {t(`Navigation.${item.key}`)}
                </a>
              ))}
            </nav>
            <div className="h-6 w-px bg-white/10 hidden lg:block" />
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {user ? (
                <Link href="/dashboard">
                  <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-[10px] font-bold">
                    {t('Navigation.dashboard')}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase tracking-widest text-[10px] font-bold">
                    {t('Navigation.join')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Asymmetric & High Contrast */}
        <section className="relative pt-40 pb-32 lg:pt-64 lg:pb-48 px-6 lg:px-12">
          <div className="container mx-auto grid lg:grid-cols-[1.2fr_0.8fr] gap-20 items-end">
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-px w-12 bg-primary" />
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">{t('Hero.navLog')}</span>
              </div>
              <h1 className="text-6xl md:text-8xl lg:text-[120px] leading-[0.9] font-serif mb-12 text-white">
                {t('Hero.title1')} <br />
                <span className="italic opacity-60">{t('Hero.title2')}</span> <br />
                {t('Hero.title3')}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground/80 max-w-xl mb-12 leading-relaxed">
                {t('Hero.subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-6">
                <Link href="/login">
                  <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-sm uppercase tracking-widest font-bold rounded-none group transition-all">
                    {t('Hero.initiate')} <ArrowRight className={`ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{t('Hero.status')}</span>
                  <span className="text-xs text-white/60 font-mono italic">{t('Hero.statusDetail')}</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Abstract Navigational Element */}
              <div className="relative aspect-square w-full max-w-md border border-white/5 glass p-12 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 carto-grid opacity-20" />
                <div className="relative scale-150 opacity-40 blur-[2px]">
                  <Logo size={240} />
                </div>
                <div className="absolute top-8 left-8 text-[8px] font-mono text-primary animate-pulse">{t('Hero.latLong')}</div>
                <div className="absolute bottom-12 right-0 left-0 h-px bg-white/20" />
                <div className="absolute right-12 top-0 bottom-0 w-px bg-white/20" />
                <div className="absolute top-0 left-0 w-full h-[2px] bg-primary/20 animate-[scan_4s_ease-in-out_infinite]" />
              </div>
            </div>
          </div>
        </section>

        {/* The Problem - High Contrast Editorial */}
        <section id="the-gap" className="py-24 lg:py-48 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full carto-grid opacity-[0.2] -z-10" />
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-24 items-start">
              <div className="sticky top-32">
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-6 block">{t('Problem.label')}</span>
                <h2 className="text-5xl md:text-6xl font-serif text-white mb-8">{t('Problem.title')}</h2>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  {t('Problem.subtitle')}
                </p>
              </div>
              <div className="space-y-32">
                {[
                  { label: "01", key: "item1" },
                  { label: "02", key: "item2" },
                  { label: "03", key: "item3" }
                ].map((item) => (
                  <div key={item.label} className="group cursor-default">
                    <div className="flex items-center gap-6 mb-4">
                      <span className="text-4xl font-serif italic text-primary/40 group-hover:text-primary transition-colors">{item.label}</span>
                      <div className="h-px flex-1 bg-white/10 group-hover:bg-primary/40 transition-all" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4 tracking-tight">{t(`Problem.${item.key}Title`)}</h4>
                    <p className="text-muted-foreground/70 leading-relaxed">{t(`Problem.${item.key}Desc`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Process - Horizontal Scroll Aesthetic */}
        <section id="process" className="py-24 bg-zinc-950 px-6 lg:px-12 relative">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-6 block">{t('Process.label')}</span>
                <h2 className="text-5xl md:text-6xl font-serif text-white">{t('Process.title')}</h2>
              </div>
              <p className="text-muted-foreground max-w-xs text-right italic font-serif leading-relaxed">"{t('Process.quote')}"</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
              {[
                { key: "step1" },
                { key: "step2" },
                { key: "step3" },
                { key: "step4" }
              ].map((step, idx) => (
                <div key={idx} className="bg-background p-12 hover:bg-zinc-900 transition-all duration-500 group">
                  <span className="text-[10px] font-mono text-primary/40 group-hover:text-primary mb-12 block tracking-widest">[STAGE_0{idx + 1}]</span>
                  <h4 className="text-xl font-bold text-white mb-4">{t(`Process.${step.key}Title`)}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(`Process.${step.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="py-48 px-6 lg:px-12 relative text-center">
          <div className="absolute inset-0 carto-grid opacity-[0.1] -z-10" />
          <div className="container mx-auto">
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold mb-12 block">{t('CTA.label')}</span>
            <h2 className="text-6xl md:text-8xl lg:text-[100px] font-serif text-white mb-16 leading-tight">
              {t('CTA.title')}
            </h2>
            <Link href="/login">
              <Button size="lg" className="h-20 px-16 bg-primary hover:bg-primary/90 text-primary-foreground text-sm uppercase tracking-widest font-bold rounded-none shadow-[0_40px_80px_-20px_var(--primary)] shadow-primary/20">
                {t('CTA.button')}
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 px-6 lg:px-12 bg-zinc-950">
        <div className="container mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <LogoText />
            <p className="mt-8 text-muted-foreground/60 text-sm max-w-xs leading-relaxed">
              {t('Footer.desc')}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">{t('Footer.coords')}</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('Navigation.gap')}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('Navigation.process')}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('Navigation.features')}</a>
          </div>
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-4">{t('Footer.trans')}</span>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('Footer.contact')}</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{t('Footer.privacy')}</a>
            <p className="text-xs text-muted-foreground/30 mt-auto">{t('Footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
