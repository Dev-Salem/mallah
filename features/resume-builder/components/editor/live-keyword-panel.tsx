"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

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
    <Card className="p-4 space-y-3">
      <h4 className="font-semibold text-sm">Keyword Match Status</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        {allSkills.map(({ skill, type }) => {
          const matched = text.includes(skill.toLowerCase());
          return (
            <div key={skill} className={`flex items-center gap-2 ${matched ? "text-green-600" : "text-muted-foreground"}`}>
              {matched ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
              <span className="truncate" title={skill}>{skill} {type === 'preferred' && <span className="text-xs opacity-50">(Pref)</span>}</span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
