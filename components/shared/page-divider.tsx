"use client";

import { cn } from "@/lib/utils";

interface PageDividerProps {
  className?: string;
}

export function PageDivider({ className }: PageDividerProps) {
  return (
    <div className={cn("relative w-full h-px overflow-visible", className)}>
      {/* The gradient line */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/20 to-transparent" />
      
      {/* The brand-colored tick at the left edge */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3 bg-primary rounded-full shadow-[0_0_10px_var(--primary)]" />
    </div>
  );
}
