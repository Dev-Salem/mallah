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
    <nav className={cn("py-6 px-3 space-y-1 w-full", className)}>
      <h3 className="text-[10px] font-bold text-muted-foreground mb-4 uppercase tracking-[0.2em] hidden md:block px-3">
        Sections
      </h3>
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
              item.isActive
                ? "bg-primary/10 text-primary shadow-sm"
                : "text-muted-foreground/80 hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {item.isComplete ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <Circle className="w-4 h-4 shrink-0 opacity-50" />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
