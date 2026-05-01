"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { OpportunityAnalysisResult } from "@/features/opportunity-analyzer/types";
import { getSavedAnalysesAction } from "@/features/opportunity-analyzer/actions/analyzer.action";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building2, Search, CheckCircle2, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ImportPanelProps {
  onSelect: (analysis: OpportunityAnalysisResult) => void;
  selectedId?: string;
}

export function ImportPanel({ onSelect, selectedId }: ImportPanelProps) {
  const t = useTranslations("Dashboard.Tracker.import");
  const [analyses, setAnalyses] = useState<OpportunityAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getSavedAnalysesAction();
        setAnalyses(data as OpportunityAnalysisResult[]);
      } catch (error) {
        console.error("Failed to load analyses", error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = analyses.filter(a => 
    a.company_name?.toLowerCase().includes(search.toLowerCase()) ||
    a.job_title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 p-1">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl border-muted">
        <Search className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{t("noAnalyses")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("select")}
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {filtered.map((analysis) => (
            <button
              key={analysis.analysis_id}
              onClick={() => onSelect(analysis)}
              className={cn(
                "group w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all duration-200",
                selectedId === analysis.analysis_id
                  ? "bg-primary/5 border-primary ring-1 ring-primary"
                  : "bg-background hover:bg-muted/50 border-muted"
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground truncate">
                    {analysis.job_title || "Untitled Role"}
                  </span>
                  {selectedId === analysis.analysis_id && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building2 className="h-3 w-3" />
                  <span className="truncate">{analysis.company_name || "Unknown Company"}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground ml-2 rtl:mr-2" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
