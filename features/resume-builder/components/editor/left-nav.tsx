"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  isComplete: boolean;
  isActive: boolean;
}

interface LeftNavProps {
  items: NavItem[];
  onSelect: (id: string) => void;
  className?: string;
}

export function LeftNav({ items, onSelect, className }: LeftNavProps) {
  return (
    <nav className={cn("py-6 px-3 space-y-1 w-full flex flex-col", className)}>
      <h3 className="text-xs font-bold text-muted-foreground mb-4 px-3 hidden md:block">
        SECTIONS
      </h3>
      <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto md:overflow-x-hidden pb-2 md:pb-0 scrollbar-none">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border border-transparent",
              item.isActive
                ? "bg-primary/10 text-primary border-primary/20"
                : "text-muted-foreground/60 hover:bg-muted/30 hover:text-foreground"
            )}
          >
            {item.isComplete ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 transition-transform group-hover:scale-110" />
            ) : (
              <Circle className="w-3.5 h-3.5 shrink-0 opacity-40 group-hover:opacity-70" />
            )}
            <span className="truncate text-left flex-1 font-medium">{item.label}</span>
            {item.isActive && (
              <div className="absolute right-2 w-1 h-1 bg-primary rounded-full animate-pulse md:block hidden" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
