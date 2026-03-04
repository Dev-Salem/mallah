'use client';

import { usePathname, Link } from '@/lib/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
  Home,
  Map,
  Layers,
  FileText,
  Briefcase,
  Settings,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/logo';
import { useSidebarData } from '@/features/dashboard/components/SidebarContext';
import { useState } from 'react';
import { ThemeToggle } from '@/components/shared/theme-toggle';

// ─── Progress Ring SVG ───
function ProgressRing({ percent, size = 32 }: { percent: number; size?: number }) {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="text-primary transition-all duration-700"
      />
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-foreground text-[8px] font-mono font-bold transform rotate-90"
        style={{ transformOrigin: `${size / 2}px ${size / 2}px` }}
      >
        {percent}%
      </text>
    </svg>
  );
}

export function Sidebar() {
  const t = useTranslations('Dashboard');
  const pathname = usePathname();
  const locale = useLocale();
  const isArabic = locale === 'ar';
  const sidebarData = useSidebarData();
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const menuItems = [
    { key: 'dashboard', href: '/dashboard', icon: Home, label: t('title') },
    { key: 'roadmap', href: '/dashboard/roadmap', icon: Map, label: t('roadmap') },
    { key: 'skillsHub', href: '/dashboard/skills', icon: Layers, label: t('skillsHub') },
    {
      key: 'resumeBuilder', href: '/dashboard/resume', icon: FileText, label: t('resumeBuilder'),
      showDot: sidebarData
        ? sidebarData.resumeStatus === 'not_created' && sidebarData.unlockedSkillsCount >= 5
        : false
    },
    { key: 'opportunityAnalyzer', href: '/dashboard/opportunities', icon: Briefcase, label: t('opportunityAnalyzer') },
  ];

  const mobileTabItems = [
    { key: 'dashboard', href: '/dashboard', icon: Home, label: 'Dashboard' },
    { key: 'roadmap', href: '/dashboard/roadmap', icon: Map, label: 'Roadmap' },
    { key: 'skillsHub', href: '/dashboard/skills', icon: Layers, label: 'Portfolio' },
    { key: 'resumeBuilder', href: '/dashboard/resume', icon: FileText, label: 'Resume' },
    { key: 'more', href: '#', icon: Menu, label: 'More' },
  ];

  return (
    <>
      {/* ─── Desktop Sidebar ─── */}
      <aside className="fixed top-0 bottom-0 start-0 z-50 w-60 bg-background/80 lg:bg-background border-e border-primary/10 backdrop-blur-xl hidden lg:flex flex-col">
        {/* Header / Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-primary/10 bg-primary/5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo size={24} className="text-primary" />
            <span className={cn(
              "text-base font-black text-foreground uppercase leading-none",
              !isArabic && "tracking-tighter"
            )}>
              Mallah
            </span>
          </Link>
          <div className="shrink-0 scale-90">
            <ThemeToggle />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 transition-all duration-200 border-s-2",
                  isActive
                    ? "bg-primary/10 border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                <item.icon className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )} />

                <span className={cn(
                  "text-[11px] font-mono uppercase font-bold flex-1",
                  !isArabic && "tracking-[0.1em]"
                )}>
                  {item.label}
                </span>

                {/* Amber dot indicator */}
                {'showDot' in item && item.showDot && (
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                )}

                {isActive && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_var(--primary)]" />
                )}
                {!isActive && (
                  <ChevronRight className={cn(
                    "w-3 h-3 opacity-0 transition-all duration-200 rtl:rotate-180",
                    "group-hover:opacity-40"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Path Mini-Status */}
        {sidebarData && (
          <div className="px-4 py-4 border-t border-primary/10">
            <div className="flex items-center gap-3">
              <ProgressRing percent={sidebarData.pathCompletionPercent} size={36} />
              <div className="flex flex-col min-w-0">
                <span className={cn(
                  "text-[10px] font-mono font-bold text-foreground uppercase truncate",
                  !isArabic && "tracking-wide"
                )}>
                  {sidebarData.pathDisplayName.split(' ')[0]} Dev
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/50">
                  Stage {sidebarData.currentStageNumber} of {sidebarData.totalStages}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Settings + Avatar */}
        <div className="px-3 pb-3 space-y-1">
          <Link
            href="/settings"
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 transition-all duration-200 border-s-2",
              pathname === '/settings'
                ? "bg-primary/10 border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5"
            )}
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span className={cn(
              "text-[11px] font-mono uppercase font-bold",
              !isArabic && "tracking-[0.1em]"
            )}>
              {t('settings')}
            </span>
          </Link>

          {sidebarData && (
            <div className="px-3 py-2">
              <span className="text-[10px] font-mono text-muted-foreground/40 truncate block">
                {sidebarData.firstName}
              </span>
            </div>
          )}
        </div>
      </aside>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 border-t border-primary/10 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileTabItems.map((item) => {
            const isActive = item.key !== 'more' && pathname === item.href;
            const isMore = item.key === 'more';

            if (isMore) {
              return (
                <button
                  key={item.key}
                  onClick={() => setMobileSheetOpen(!mobileSheetOpen)}
                  className="flex flex-col items-center justify-center gap-1 text-muted-foreground"
                >
                  {mobileSheetOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                  <span className="text-[9px] font-mono uppercase">{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[9px] font-mono uppercase">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ─── Mobile "More" Bottom Sheet ─── */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileSheetOpen(false)}>
          <div className="absolute inset-0 bg-background/60" />
          <div
            className="absolute bottom-16 left-0 right-0 bg-background border-t border-primary/10 p-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            <Link
              href="/dashboard/opportunities"
              className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileSheetOpen(false)}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">{t('opportunityAnalyzer')}</span>
            </Link>
            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setMobileSheetOpen(false)}
            >
              <Settings className="w-4 h-4" />
              <span className="text-xs font-mono uppercase">{t('settings')}</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
