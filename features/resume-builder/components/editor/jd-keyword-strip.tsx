"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";

interface JDKeywordStripProps {
  requiredSkills: string[];
  resumeText: string; // The full flat string of the resume to check against
}

export function JDKeywordStrip({ requiredSkills, resumeText }: JDKeywordStripProps) {
  const matchStatus = useMemo(() => {
    const text = resumeText.toLowerCase();
    return requiredSkills.map((skill) => ({
      skill,
      matched: text.includes(skill.toLowerCase()),
    }));
  }, [requiredSkills, resumeText]);

  if (!requiredSkills || requiredSkills.length === 0) return null;

  return (
    <div className="bg-primary/5 border-b px-4 py-2 flex items-center gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <span className="text-xs font-bold text-primary shrink-0">
        Job Keywords:
      </span>
      {matchStatus.map(({ skill, matched }) => (
        <Badge
          key={skill}
          variant={matched ? "default" : "secondary"}
          className={`shrink-0 transition-colors ${
            matched ? "bg-green-600 hover:bg-green-700 text-white" : "text-muted-foreground"
          }`}
        >
          {skill}
        </Badge>
      ))}
    </div>
  );
}
