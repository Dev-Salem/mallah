'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface LogoProps {
  className?: string;
  size?: number;
}

export function Logo({ className, size = 32 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Rear Sail - Glassy / Translucent */}
        <path
          d="M12 3L4 19H12V3Z"
          fill="currentColor"
          fillOpacity="0.15"
          stroke="currentColor"
          strokeOpacity="0.3"
          strokeWidth="0.5"
          className="text-foreground/30 dark:text-white"
        />
        
        {/* Front Main Sail - Brand Gradient */}
        <path
          d="M13 5L21 21H13V5Z"
          fill="url(#sail-gradient)"
          className="drop-shadow-[0_0_8px_var(--primary)] shadow-primary/30"
        />
        
        {/* The Gap - Negative space separator represented by the space between paths */}
        
        <defs>
          <linearGradient id="sail-gradient" x1="13" y1="5" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0.8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Dynamic Glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/10 blur-xl -z-10 rounded-full" />
    </div>
  );
}

export function LogoText() {
  const t = useTranslations('Common');
  return (
    <div className="flex items-center gap-3">
      <Logo size={40} />
      <span className="text-2xl font-black tracking-tighter text-foreground uppercase">
        {t('logo')}
      </span>
    </div>
  );
}
