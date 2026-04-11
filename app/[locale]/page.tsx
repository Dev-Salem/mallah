import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/lib/i18n/routing";
import {
  ArrowRight,
} from "lucide-react";
import { Logo, LogoText } from "@/components/ui/logo";
import { getTranslations, getLocale } from 'next-intl/server';
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations();
  const locale = await getLocale();

  const isArabic = locale.startsWith('ar');

  const navItems = [
    { key: 'gap', id: 'the-gap' },
    { key: 'process', id: 'process' },
    { key: 'features', id: 'features' },
    { key: 'outcomes', id: 'outcomes' }
  ];

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Visual Infrastructure */}
      <div className="fixed inset-0 noise z-[100] mix-blend-overlay pointer-events-none" />
      <div className="fixed inset-0 hud-grid opacity-[0.4] pointer-events-none" />
      <div className="fixed inset-0 scanline z-[101] pointer-events-none" />

      {/* Navigation */}
      <header className="fixed top-0 z-50 w-full border-b border-primary/10 glass">
        <div className="container mx-auto flex h-16 items-center justify-between px-6 lg:px-12">
          <LogoText />
          <div className="flex items-center gap-8">
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.key}
                  href={`#${item.id}`}
                  className={`text-[10px] uppercase ${!isArabic ? 'tracking-[0.2em]' : ''} font-mono font-medium text-muted-foreground hover:text-primary transition-all duration-300`}
                >
                  <span className="text-primary/40 mr-1 text-[8px]">0{navItems.indexOf(item) + 1}</span>
                  {t(`Navigation.${item.key}`)}
                </a>
              ))}
            </nav>
            <div className="h-4 w-px bg-white/10 hidden lg:block" />
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <LanguageSwitcher />
              {user ? (
                <Link href="/dashboard">
                  <Button className={`h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase ${!isArabic ? 'tracking-widest' : ''} text-[9px] font-mono font-bold glow-border`}>
                    {t('Navigation.dashboard')}
                  </Button>
                </Link>
              ) : (
                <Link href="/login">
                  <Button className={`h-8 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-none uppercase ${!isArabic ? 'tracking-widest' : ''} text-[9px] font-mono font-bold glow-border`}>
                    {t('Navigation.join')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section - Tactical HUD */}
        <section className="relative pt-32 pb-24 lg:pt-56 lg:pb-40 px-6 lg:px-12">
          <div className="container mx-auto grid lg:grid-cols-[1fr_auto] gap-20 items-center">
            <div className="relative z-10">

              <h1 className={`text-5xl md:text-7xl lg:text-[100px] leading-[0.85] font-mono font-black mb-10 text-foreground ${!isArabic ? 'tracking-tighter' : ''} uppercase`}>
                {t('Hero.title1')} <br />
                <span className="text-primary">{t('Hero.title2')}</span> <br />
                {t('Hero.title3')}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground/80 max-w-lg mb-12 leading-relaxed font-mono">
                <span className="text-primary/40 mr-2">{">"}</span>
                {t('Hero.subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-10">
                <Link href="/login">
                  <Button size="lg" className={`h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase ${!isArabic ? 'tracking-[0.2em]' : ''} font-mono font-bold rounded-none group transition-all glow-border`}>
                    {t('Hero.initiate')} <ArrowRight className={`ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform ${locale === 'ar' ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
                <div className="flex flex-col border-l border-primary/10 pl-6">
                  <span className={`text-[9px] font-mono uppercase ${!isArabic ? 'tracking-[0.3em]' : ''} text-muted-foreground mb-1`}>{t('Hero.status')}</span>
                  <span className={`text-[11px] font-mono text-primary/80 uppercase ${!isArabic ? 'tracking-widest' : ''}`}>{t('Hero.statusDetail')}</span>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              {/* Tactical Navigational HUD */}
              <div className="relative w-[400px] aspect-square border border-primary/20 glass p-1 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 hud-grid opacity-30" />
                <div className="relative scale-125 opacity-20 filter grayscale contrast-150">
                  <Logo size={320} />
                </div>



                <div className="absolute inset-x-0 top-1/2 h-px bg-primary/20" />
                <div className="absolute inset-y-0 left-1/2 w-px bg-primary/20" />

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-primary/40 rounded-full animate-ping opacity-20" />
              </div>
            </div>
          </div>
        </section>

        {/* The Gap - Modular HUD Diagnostics */}
        <section id="the-gap" className="py-24 lg:py-32 border-y border-primary/5 relative overflow-hidden bg-muted/30">
          <div className="absolute inset-0 hud-grid opacity-[0.1] -z-10" />
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-4xl mb-24">
              <span className="text-[9px] uppercase tracking-[0.5em] text-primary font-mono font-bold mb-6 block px-3 py-1 border-l-2 border-primary bg-primary/5 w-fit">{t('Problem.label')}</span>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-mono font-bold text-foreground mb-8 ${!isArabic ? 'tracking-tighter' : ''} uppercase`}>{t('Problem.title')}</h2>
              <p className="text-muted-foreground text-lg leading-relaxed font-mono italic border-l border-primary/10 pl-8">
                {t('Problem.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-1px bg-primary/5 border border-primary/5">
              {[
                { key: "item1" },
                { key: "item2" },
                { key: "item3" }
              ].map((item, idx) => (
                <div key={item.key} className="bg-background p-10 hover:bg-primary/5 transition-all duration-500 group relative">

                  <h4 className="text-lg font-mono font-bold text-foreground mb-4 tracking-tight uppercase group-hover:text-primary transition-colors">{t(`Problem.${item.key}Title`)}</h4>
                  <p className="text-sm font-mono text-muted-foreground/70 leading-relaxed font-mono">{t(`Problem.${item.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process - Pipeline Navigation */}
        <section id="process" className="py-24 bg-background px-6 lg:px-12 relative overflow-hidden">
          <div className="container mx-auto">
            <div className="flex flex-col lg:flex-row justify-between items-baseline mb-20 gap-8">
              <div className="max-w-2xl">
                <span className="text-[9px] uppercase tracking-[0.5em] text-primary font-mono font-bold mb-6 block">{t('Process.label')}</span>
                <h2 className={`text-4xl md:text-5xl font-mono font-bold text-foreground ${!isArabic ? 'tracking-tighter' : ''} uppercase`}>{t('Process.title')}</h2>
              </div>
              <div className="px-6 py-4 border border-primary/5 glass flex items-center gap-6">
                <div className="h-10 w-10 flex items-center justify-center rounded-full border border-primary/20 font-mono text-primary text-xs italic">
                  "
                </div>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed italic max-w-xs">{t('Process.quote')}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-primary/5 border border-primary/5">
              {[
                { key: "step1" },
                { key: "step2" },
                { key: "step3" },
                { key: "step4" }
              ].map((step, idx) => (
                <div key={idx} className="bg-background p-10 hover:bg-zinc-900/50 transition-all duration-500 group relative">
                  <div className="flex justify-between items-start mb-12">
                    <span className="text-[9px] font-mono text-primary bg-primary/10 px-2 py-1 tracking-widest font-bold">STAGE_0{idx + 1}</span>
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                  </div>
                  <h4 className={`text-sm font-mono font-bold text-foreground mb-4 ${!isArabic ? 'tracking-widest' : ''} uppercase`}>{t(`Process.${step.key}Title`)}</h4>
                  <div className="h-px w-8 bg-primary/40 mb-4 group-hover:w-full transition-all duration-700" />
                  <p className="text-[11px] font-mono text-muted-foreground leading-relaxed uppercase tracking-tighter">{t(`Process.${step.key}Desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA - System Override */}
        <section className="py-40 px-6 lg:px-12 relative text-center bg-muted/50 overflow-hidden">
          <div className="absolute inset-0 hud-grid opacity-[0.2] -z-10" />
          <div className="container mx-auto max-w-4xl relative">

            <span className="text-[9px] uppercase tracking-[0.5em] text-primary font-mono font-bold mb-10 block">{t('CTA.label')}</span>
            <h2 className={`text-5xl md:text-7xl lg:text-8xl font-mono font-black text-foreground mb-16 leading-[0.85] ${!isArabic ? 'tracking-tighter' : ''} uppercase px-4`}>
              {t('CTA.title')}
            </h2>
            <Link href="/login">
              <Button size="lg" className={`h-20 px-16 bg-primary hover:bg-primary/90 text-primary-foreground text-xs uppercase ${!isArabic ? 'tracking-[0.4em]' : ''} font-mono font-black rounded-none shadow-[0_45px_100px_-25px_var(--primary)] shadow-primary/30 relative overflow-hidden group border-2 border-primary`}>
                <span className="relative z-10">{t('CTA.button')}</span>
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 bg-white/10 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-16 border-t border-primary/5 px-6 lg:px-12 bg-background font-mono">
        <div className="container mx-auto grid md:grid-cols-4 gap-16">
          <div className="col-span-2">
            <LogoText />
            <p className="mt-8 text-muted-foreground/60 text-[10px] max-w-xs leading-relaxed uppercase tracking-tight">
              {t('Footer.desc')}
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold mb-4 flex items-center gap-2">
              <div className="h-1 w-1 bg-primary" /> {t('Footer.coords')}
            </span>
            <a href="#" className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">{t('Navigation.gap')}</a>
            <a href="#" className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">{t('Navigation.process')}</a>
            <a href="#" className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">{t('Navigation.features')}</a>
          </div>
          <div className="flex flex-col gap-5">
            <span className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground/60 font-bold mb-4 flex items-center gap-2">
              <div className="h-1 w-1 bg-primary" /> {t('Footer.trans')}
            </span>
            <a href="#" className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">{t('Footer.contact')}</a>
            <a href="#" className="text-[10px] uppercase text-muted-foreground hover:text-primary transition-colors tracking-widest">{t('Footer.privacy')}</a>
            <p className="text-[8px] text-muted-foreground/30 mt-auto tracking-widest pt-10">{t('Footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
