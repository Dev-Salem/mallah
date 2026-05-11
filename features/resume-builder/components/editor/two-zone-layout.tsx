"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface TwoZoneLayoutProps {
  leftNav: React.ReactNode;
  rightEditor: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

export function TwoZoneLayout({ leftNav, rightEditor, header, className }: TwoZoneLayoutProps) {
  return (
    <div className={cn("flex flex-col h-screen overflow-hidden bg-background", className)}>
      {header && <div className="flex-shrink-0 w-full z-10 border-b bg-card">{header}</div>}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav Zone (~280px width on desktop) */}
        <aside className="hidden md:flex w-[280px] flex-shrink-0 border-r bg-card/50 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/30 hover:scrollbar-thumb-muted-foreground/50 transition-colors">
          <div className="w-full flex flex-col min-h-full pb-20">
            {leftNav}
          </div>
        </aside>
        
        {/* Mobile Nav Zone */}
        <div className="md:hidden w-full overflow-x-auto border-b flex-shrink-0 bg-card">
          {leftNav}
        </div>

        {/* Right Editor Zone */}
        <main className="flex-1 overflow-y-auto relative bg-dashboard-bg/30">
          {rightEditor}
        </main>
      </div>
    </div>
  );
}
