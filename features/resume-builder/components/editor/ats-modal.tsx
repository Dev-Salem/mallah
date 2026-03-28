"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Target } from "lucide-react";
import type { SectionType } from "./section-nav";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface ATSBreakdown {
  keywordCoverage: number;
  sectionCompleteness: number;
  summaryQuality: number;
  projectDescriptions: number;
  formatting: number;
}

export interface ATSHint {
  issue: string;
  description: string;
  sectionTarget: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  score: number | null;
  breakdown: ATSBreakdown;
  hints: ATSHint[];
  isJobBased: boolean;
  jobTitle?: string;
  onFixNavigation: (section: SectionType) => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const FACTORS: {
  key: keyof ATSBreakdown;
  label: string;
  weight: string;
}[] = [
  { key: "keywordCoverage", label: "Keyword coverage", weight: "40%" },
  { key: "sectionCompleteness", label: "Section complete", weight: "25%" },
  { key: "summaryQuality", label: "Summary quality", weight: "15%" },
  { key: "projectDescriptions", label: "Project descs", weight: "10%" },
  { key: "formatting", label: "Formatting", weight: "10%" },
];

function scoreLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Looking Good";
  if (score >= 50) return "Getting There";
  return "Needs Work";
}

function sectionTargetToType(target: string): SectionType {
  const map: Record<string, SectionType> = {
    Summary: "SUMMARY",
    Skills: "SKILLS",
    Projects: "PROJECTS",
    Experience: "EXPERIENCE",
    Education: "EDUCATION",
    Certifications: "CERTIFICATIONS",
    "Personal Info": "PERSONAL_INFO",
  };
  return map[target] || "SUMMARY";
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ATSModal({
  open,
  onOpenChange,
  score,
  breakdown,
  hints,
  isJobBased,
  jobTitle,
  onFixNavigation,
}: Props) {
  const t = useTranslations("ResumeBuilder");
  const displayScore = score ?? 0;
  const isGood = displayScore >= 75;
  const hasScore = score !== null && score > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{t("ATSScore")}</DialogTitle>
        </DialogHeader>

        {/* Score ring */}
        <div className="flex flex-col items-center gap-2 py-4">
          <div
            className={cn(
              "w-24 h-24 rounded-full border-4 flex items-center justify-center",
              isGood ? "border-green-500" : "border-amber-500"
            )}
          >
            <span
              className={cn(
                "text-3xl font-bold",
                hasScore
                  ? isGood
                    ? "text-green-600"
                    : "text-amber-500"
                  : "text-muted-foreground"
              )}
            >
              {hasScore ? displayScore : "—"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            {hasScore ? scoreLabel(displayScore) : t("ATSPending")}
          </p>

          {isJobBased && jobTitle && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
              <Target className="w-3 h-3" />
              <span>Targeting: {jobTitle}</span>
            </div>
          )}
        </div>

        {/* Breakdown bars */}
        {hasScore && (
          <div className="space-y-3 border-t pt-4">
            {FACTORS.map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-[140px] shrink-0 truncate">
                  {f.label}
                </span>
                <Progress
                  value={breakdown[f.key]}
                  className="flex-1 h-2"
                />
                <span className="text-xs font-medium w-[36px] text-right">
                  {breakdown[f.key]}%
                </span>
                <span className="text-xs text-muted-foreground w-[50px] text-right">
                  ({f.weight})
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Hints */}
        {hints.length > 0 && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              What to fix:
            </h4>
            {hints.map((hint, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-amber-50 text-amber-900 border border-amber-200 p-3 rounded-md"
              >
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <div>
                    <p className="text-sm font-semibold">{hint.issue}</p>
                    <p className="text-xs text-amber-800/80 mt-0.5">
                      {hint.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 h-7 text-xs text-amber-700 hover:text-amber-900"
                  onClick={() => {
                    onFixNavigation(sectionTargetToType(hint.sectionTarget));
                    onOpenChange(false);
                  }}
                >
                  Fix →
                </Button>
              </div>
            ))}
          </div>
        )}

        {hints.length === 0 && hasScore && (
          <div className="flex flex-col items-center justify-center text-center p-4 space-y-2 text-muted-foreground border-t pt-4">
            <CheckCircle2 className="w-6 h-6 text-green-500/50" />
            <span className="text-sm">{t("NoIssuesFound")}</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
