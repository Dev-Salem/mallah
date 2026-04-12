'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface LogoProps {
  className?: string;
  size?: number;
  showOutlineOnly?: boolean;
  isTactical?: boolean;
  isGlass?: boolean;
}

export function Logo({ className, size = 32, showOutlineOnly = false, isTactical = false, isGlass = false }: LogoProps) {
  const rearSailPath = "polygon(50% 12.5%, 16.6% 79.1%, 50% 79.1%)";
  const frontSailPath = "polygon(54.1% 20.8%, 87.5% 87.5%, 54.1% 87.5%)";

  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      
      {/* Glass Layer - Only active if isGlass is true */}
      {isGlass && (
        <>
          {/* Rear Glass Sail */}
          <div 
            className="absolute inset-0 backdrop-blur-md bg-foreground/5 border-[0.5px] border-foreground/10"
            style={{ clipPath: rearSailPath, zIndex: 1 }}
          />
          {/* Front Glass Sail - Higher Refraction */}
          <div 
            className="absolute inset-0 backdrop-blur-xl bg-white/5 border-[0.5px] border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.1)]"
            style={{ clipPath: frontSailPath, zIndex: 3 }}
          />
          {/* Prismatic Edge Shine */}
          <div 
            className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none"
            style={{ 
              clipPath: frontSailPath, 
              zIndex: 4,
              background: 'linear-gradient(135deg, transparent 40%, white 50%, transparent 60%)',
              backgroundSize: '200% 200%',
              animation: 'shine 8s linear infinite'
            }}
          />
        </>
      )}

      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative"
        style={{ zIndex: isGlass ? 5 : 1 }}
      >
        <defs>
          <linearGradient id="sail-gradient" x1="13" y1="5" x2="21" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity={isGlass ? "0.2" : "0.8"} />
          </linearGradient>

          {/* Tactical Grid Pattern */}
          <pattern id="tactical-grid" width="2" height="2" patternUnits="userSpaceOnUse">
            <path d="M 2 0 L 0 0 0 2" fill="none" stroke="var(--primary)" strokeWidth="0.1" strokeOpacity="0.2" />
          </pattern>
        </defs>

        {/* Tactical Corner Brackets */}
        {isTactical && (
          <g className="text-primary/40">
            <path d="M2 5V2H5" stroke="currentColor" strokeWidth="0.5" />
            <path d="M19 2H22V5" stroke="currentColor" strokeWidth="0.5" />
            <path d="M2 19V22H5" stroke="currentColor" strokeWidth="0.5" />
            <path d="M19 22H22V19" stroke="currentColor" strokeWidth="0.5" />
          </g>
        )}

        {/* Rear Sail */}
        <path
          d="M12 3L4 19H12V3Z"
          fill="currentColor"
          fillOpacity={isGlass ? "0.02" : showOutlineOnly ? "0.05" : "0.15"}
          stroke="currentColor"
          strokeOpacity={isGlass ? "0.1" : showOutlineOnly ? "0.1" : "0.3"}
          strokeWidth="0.5"
          className="text-foreground/30 dark:text-white"
        />
        
        {/* Front Main Sail */}
        <path
          d="M13 5L21 21H13V5Z"
          fill={showOutlineOnly ? "none" : isGlass ? "rgba(249,115,22,0.1)" : "url(#sail-gradient)"}
          stroke={showOutlineOnly || isGlass ? "var(--primary)" : "none"}
          strokeWidth={showOutlineOnly ? "1.2" : isGlass ? "0.8" : "0"}
          strokeOpacity={isGlass ? "0.4" : "1"}
          className={showOutlineOnly ? "drop-shadow-[0_0_3px_var(--primary)]" : ""}
        />

        {/* Tactical Grid Overlay */}
        {isTactical && !showOutlineOnly && (
          <path
            d="M13 5L21 21H13V5Z"
            fill="url(#tactical-grid)"
            className="pointer-events-none"
          />
        )}

        {/* Tactical Vertex Nodes */}
        {isTactical && (
          <g fill="var(--primary)" className="animate-pulse">
            <circle cx="13" cy="5" r="0.4" />
            <circle cx="21" cy="21" r="0.4" />
            <circle cx="13" cy="21" r="0.4" />
          </g>
        )}
      </svg>
      {/* Dynamic Glow - Only for Glass/Outline or specifically requested */}
      {(showOutlineOnly || isGlass) && (
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-primary/10 blur-xl -z-10 rounded-full opacity-20" />
      )}
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
