"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ApplicationStage } from "../types";
import { cn } from "@/lib/utils";

interface StageFiltersProps {
  selectedStage: ApplicationStage | "all";
  onStageChange: (stage: ApplicationStage | "all") => void;
  counts: Record<string, number>;
}

const STAGES: (ApplicationStage | "all")[] = [
  "all",
  "saved",
  "applied",
  "in_review",
  "interviewing",
  "offer",
  "accepted",
  "rejected",
  "withdrawn",
];

export function StageFilters({ selectedStage, onStageChange, counts }: StageFiltersProps) {
  const t = useTranslations("Dashboard.Tracker.stages");

  return (
    <ScrollArea className="w-full whitespace-nowrap pb-4">
      <div className="flex w-max space-x-2 rtl:space-x-reverse">
        {STAGES.map((stage) => (
          <button
            key={stage}
            onClick={() => onStageChange(stage)}
            className={cn(
              "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
              selectedStage === stage
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20 scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {t(stage)}
            <Badge
              variant={selectedStage === stage ? "secondary" : "outline"}
              className={cn(
                "ml-2 rtl:mr-2 h-5 min-w-[20px] px-1 justify-center rounded-full border-none",
                selectedStage === stage ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
              )}
            >
              {counts[stage] || 0}
            </Badge>
          </button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
