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
      <DialogContent className="sm:max-w-[520px] rounded-2xl border-primary/20 bg-card p-0 overflow-hidden shadow-2xl">
        <div className="p-8 space-y-8">
           <DialogHeader>
             <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">{t("ATSScore")}</DialogTitle>
           </DialogHeader>

           {/* Score ring */}
           <div className="flex flex-col items-center gap-2 py-4 relative">
             <div className="absolute inset-0 bg-[radial-gradient(var(--primary)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none"></div>
             
             <div
               className={cn(
                 "w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center relative",
                 isGood ? "border-green-500/50 bg-green-500/5" : "border-amber-500/50 bg-amber-500/5"
               )}
             >
               {/* Tactical bits for the ring */}
               <div className={cn("absolute -top-1 -left-1 w-2 h-2", isGood ? "bg-green-500" : "bg-amber-500")} />
               <div className={cn("absolute -bottom-1 -right-1 w-2 h-2", isGood ? "bg-green-500" : "bg-amber-500")} />
               
               <span
                 className={cn(
                   "text-5xl font-bold tracking-tighter",
                   hasScore
                     ? isGood
                       ? "text-green-500"
                       : "text-amber-500"
                     : "text-muted-foreground/30"
                 )}
               >
                 {hasScore ? displayScore : "—"}
               </span>
               <span className="text-xs font-bold text-muted-foreground opacity-50 mt-1 uppercase tracking-widest">Score</span>
             </div>
             
             <p className="text-sm font-bold mt-4">
               {hasScore ? scoreLabel(displayScore) : t("ATSPending")}
             </p>

             {isJobBased && jobTitle && (
               <div className="flex items-center gap-2 text-xs font-bold text-primary mt-2 bg-primary/5 px-3 py-1 border border-primary/10 rounded-full">
                 <Target className="w-3 h-3" />
                 <span>FOR: {jobTitle}</span>
               </div>
             )}
           </div>

           {/* Breakdown HUD bars */}
           {hasScore && (
             <div className="space-y-4 border-t border-primary/10 pt-6">
               <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Improvement Opportunities</h4>
               {FACTORS.map((f) => (
                 <div key={f.key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] font-black text-foreground uppercase tracking-wider">
                         {f.label}
                       </span>
                       <span className="text-[10px] font-mono font-bold text-muted-foreground">
                         {breakdown[f.key]}% / {f.weight}
                       </span>
                    </div>
                   <div className="h-1.5 bg-muted rounded-none overflow-hidden flex">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${breakdown[f.key]}%` }}
                        className={cn(
                          "h-full",
                          breakdown[f.key] > 70 ? "bg-primary" : "bg-amber-500"
                        )}
                      />
                   </div>
                 </div>
               ))}
             </div>
           )}

           {/* Fix Recommendations (Hints) */}
           {hints.length > 0 && (
             <div className="space-y-3 border-t border-primary/10 pt-6">
               <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">Critical Adjustments Required</h4>
               <div className="grid gap-3">
                  {hints.map((hint, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 bg-muted/30 border border-border p-3 rounded-none group hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-amber-500 group-hover:text-primary transition-colors" />
                        <div>
                          <p className="text-[11px] font-black uppercase tracking-tight text-foreground">{hint.issue}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5 font-medium leading-relaxed">
                            {hint.description}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="link"
                        size="sm"
                        className="h-8 text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline px-0"
                        onClick={() => {
                          onFixNavigation(sectionTargetToType(hint.sectionTarget));
                          onOpenChange(false);
                        }}
                      >
                        FIX →
                      </Button>
                    </div>
                  ))}
               </div>
             </div>
           )}

           {hints.length === 0 && hasScore && (
             <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 border-t border-primary/10">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
               </div>
               <div className="space-y-1">
                  <p className="text-sm font-black uppercase tracking-tight text-foreground">Operational Efficiency Verified</p>
                  <p className="text-xs text-muted-foreground font-medium">{t("NoIssuesFound")}</p>
               </div>
             </div>
           )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
