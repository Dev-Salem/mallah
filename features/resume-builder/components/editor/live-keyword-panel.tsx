"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveKeywordPanelProps {
  requiredSkills: string[];
  preferredSkills: string[];
  resumeText: string;
}

export function LiveKeywordPanel({ requiredSkills, preferredSkills, resumeText }: LiveKeywordPanelProps) {
  const text = resumeText.toLowerCase();
  
  const allSkills = [
    ...requiredSkills.map(s => ({ skill: s, type: 'required' })),
    ...preferredSkills.map(s => ({ skill: s, type: 'preferred' }))
  ];

  if (allSkills.length === 0) return null;

  return (
    <Card className="p-4 space-y-4 shadow-sm border-border/60">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-xs uppercase tracking-widest text-muted-foreground/70">
          Keyword Match
        </h4>
        <div className="px-1.5 py-0.5 rounded-md bg-accent text-[10px] font-bold opacity-70">
          {allSkills.filter(({ skill }) => text.includes(skill.toLowerCase())).length}/{allSkills.length}
        </div>
      </div>
      
      <div className="flex flex-col gap-2 text-xs font-bold">
        {allSkills.map(({ skill, type }) => {
          const matched = text.includes(skill.toLowerCase());
          return (
            <div 
              key={skill} 
              className={cn(
                "flex items-center gap-3 transition-all px-3 py-2.5 rounded-xl border group/item",
                matched 
                  ? "text-emerald-600 bg-emerald-500/5 border-emerald-500/10 shadow-sm shadow-emerald-500/5" 
                  : "text-muted-foreground/40 border-transparent hover:bg-muted/30"
              )}
            >
              <div className="shrink-0 flex items-center justify-center w-5">
                {matched ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" strokeWidth={2.5} />
                ) : (
                  <Circle className="w-4 h-4 opacity-30 group-hover/item:opacity-50 transition-opacity" strokeWidth={2.5} />
                )}
              </div>
              <span className="truncate flex-1 font-bold leading-none py-0.5" title={skill}>
                {skill}
                {type === 'preferred' && (
                  <span className="ml-1 text-[8px] opacity-40 italic font-medium uppercase tracking-tighter">
                    (Rec)
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
