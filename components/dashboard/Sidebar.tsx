'use client';

import { usePathname } from '@/lib/i18n/routing';
import { Link } from '@/lib/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  LayoutDashboard,
  Map,
  Cpu,
  FileText,
  Radar,
  LogOut,
  ChevronRight,
  Hexagon,
  Settings,
  Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';

export function Sidebar() {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const menuItems = [
    {
      key: 'dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      label: t('title') // Or just "Dashboard" if we add aspecific key
    },
    {
      key: 'roadmap',
      href: '/dashboard/roadmap',
      icon: Map,
      label: t('roadmap')
    },
    {
      key: 'skillsHub',
      href: '/dashboard/skills',
      icon: Cpu,
      label: t('skillsHub')
    },
    {
      key: 'resumeBuilder',
      href: '/dashboard/resume',
      icon: FileText,
      label: t('resumeBuilder')
    },
    {
      key: 'opportunityAnalyzer',
      href: '/dashboard/opportunities',
      icon: Radar,
      label: t('opportunityAnalyzer')
    },
    {
      key: 'careerAdvisor',
      href: '/dashboard/advisor',
      icon: Bot,
      label: t('careerAdvisor')
    },
    {
      key: 'settings',
      href: '/dashboard/settings',
      icon: Settings,
      label: t('settings')
    }
  ];

  return (
    <aside className="fixed top-0 bottom-0 start-0 z-50 w-72 bg-black/90 border-e border-white/5 backdrop-blur-xl hidden lg:flex flex-col">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 hud-grid opacity-[0.15] pointer-events-none" />

      {/* Header / Logo Area */}
      <div className="h-24 flex items-center px-8 border-b border-white/5 bg-white/5 relative">
        <div className="absolute top-0 right-0 p-2 opacity-20 rtl:left-0 rtl:right-auto">
          <Hexagon className="w-12 h-12 text-primary stroke-[1]" />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Logo size={32} className="text-primary" />
          <div className="flex flex-col">
            <span className={cn(
              "text-lg font-black tracking-tighter text-white uppercase leading-none",
              !isArabic && "tracking-tighter"
            )}>
              Mallah
            </span>
            <span className={cn(
              "text-[9px] text-primary/60 font-mono uppercase tracking-widest",
              !isArabic && "tracking-[0.2em]"
            )}>
              Terminal_v1.0
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
        <div className="px-4 mb-6">
          <span className={cn(
            "text-[9px] text-muted-foreground/40 font-mono uppercase font-bold flex items-center gap-2",
            !isArabic && "tracking-[0.3em]"
          )}>
            <div className="w-1 h-1 bg-primary rounded-full" />
            {t('navigation')}
          </span>
        </div>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-4 px-4 py-3 rounded-none transition-all duration-300 border-s-2",
                isActive
                  ? "bg-primary/10 border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-white hover:bg-white/5 hover:border-white/10"
              )}
            >
              <item.icon className={cn(
                "w-4 h-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground group-hover:text-white"
              )} />

              <span className={cn(
                "text-[11px] font-mono uppercase font-bold tracking-wide flex-1",
                !isArabic && "tracking-[0.15em]"
              )}>
                {item.label}
              </span>

              {isActive && (
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
              )}

              {!isActive && (
                <ChevronRight className={cn(
                  "w-3 h-3 opacity-0 -translate-x-2 transition-all duration-300 rtl:rotate-180",
                  "group-hover:opacity-50 group-hover:translate-x-0"
                )} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Status */}
      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="border border-white/10 bg-white/5 p-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex flex-col">
              <span className={cn(
                "text-[9px] text-muted-foreground uppercase font-mono mb-1",
                !isArabic && "tracking-widest"
              )}>
                {t('systemStatus')}
              </span>
              <span className="text-[10px] text-green-500 font-mono font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {t('systemOnline')}
              </span>
            </div>
            <Cpu className="w-4 h-4 text-white/20" />
          </div>
        </div>
      </div>
    </aside>
  );
}
