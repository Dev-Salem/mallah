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
    <div className={cn("flex flex-col h-screen overflow-hidden", className)}>
      {header && <div className="flex-shrink-0 w-full z-10">{header}</div>}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav Zone (~200px width on desktop) */}
        <aside className="hidden md:flex w-[200px] flex-shrink-0 border-r overflow-y-auto">
          {leftNav}
        </aside>
        
        {/* Mobile Nav Zone */}
        <div className="md:hidden w-full overflow-x-auto border-b flex-shrink-0">
          {leftNav}
        </div>

        {/* Right Editor Zone */}
        <main className="flex-1 overflow-y-auto relative bg-muted/40">
          {rightEditor}
        </main>
      </div>
    </div>
  );
}
