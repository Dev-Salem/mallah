"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useCallback } from "react";
import { Sparkles, X, History, CheckCircle2, AlertTriangle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WhatChangedSummary } from "@/features/resume-builder/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WhatChangedPanelProps {
  resumeId: string;
}

export function WhatChangedPanel({ resumeId }: WhatChangedPanelProps) {
  const t = useTranslations("ResumeBuilder");
  const [whatChanged, setWhatChanged] = useState<WhatChangedSummary | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check sessionStorage for whatChanged data
    try {
      const stored = sessionStorage.getItem(`whatChanged_${resumeId}`);
      if (stored) {
        setWhatChanged(JSON.parse(stored));
        // Auto-open on first load
        const autoShowCount = sessionStorage.getItem(`whatChangedAutoShow_${resumeId}`) || "0";
        if (parseInt(autoShowCount) < 1) {
          setIsOpen(true);
          sessionStorage.setItem(`whatChangedAutoShow_${resumeId}`, "1");
        }
      }
    } catch {
      // sessionStorage not available
    }
  }, [resumeId]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  if (!whatChanged) return null;

  const changes: { icon: any; label: string }[] = [];
  if (whatChanged.summaryRewritten) {
    changes.push({ icon: Wand2, label: t("SummaryRewritten") });
  }
  if (whatChanged.bulletsUpdatedCount > 0) {
    changes.push({ icon: CheckCircle2, label: t("BulletsUpdated", { count: whatChanged.bulletsUpdatedCount }) });
  }
  if (whatChanged.skillsReordered) {
    changes.push({ icon: History, label: t("SkillsReordered") });
  }
  if (whatChanged.projectsReordered) {
    changes.push({ icon: History, label: t("ProjectsReordered") });
  }

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <motion.div 
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          className="fixed right-6 bottom-6 z-[60] flex items-center gap-2"
        >
          <Button
            onClick={handleToggle}
            className="h-12 px-6 rounded-full bg-primary shadow-2xl shadow-primary/40 hover:bg-primary/90 text-white font-bold transition-all active:scale-95 group border border-white/20"
          >
            <Sparkles className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
            {t("RefinementReport")}
            <div className="ml-3 px-1.5 py-0.5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">
               {changes.length}
            </div>
          </Button>
        </motion.div>
      )}

      {/* Main Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8 bg-background/80 backdrop-blur-[4px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg bg-dashboard-card-bg rounded-2xl shadow-2xl overflow-hidden border border-primary/20 relative"
            >


              {/* Header */}
              <div className="bg-primary p-6 text-white relative flex items-center gap-6 border-b border-primary/20">
                 <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
                    <Sparkles className="w-7 h-7 text-white" />
                 </div>
                 <div className="flex-1">
                    <h3 className="text-xl font-black uppercase tracking-tight leading-none mb-1">{t("RefinementAudit")}</h3>
                    <p className="text-white/70 text-[10px] font-mono font-bold uppercase tracking-widest leading-none">
                       {t("Targeting")} {whatChanged.jobTitle}
                    </p>
                 </div>
                 <Button 
                   variant="ghost" 
                   size="icon" 
                   onClick={handleClose}
                   className="text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                 >
                    <X className="w-5 h-5" />
                 </Button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                 <div className="space-y-4">
                    <p className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-primary/60">{t("OptimizationLog")}</p>
                    <div className="space-y-3">
                        {changes.map((change, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-xl bg-muted/5 border border-primary/10 group hover:border-primary/30 hover:bg-muted/10 transition-all"
                          >
                             <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm border border-primary/5 group-hover:scale-110 transition-transform">
                                <change.icon className="w-5 h-5 text-primary" />
                             </div>
                             <span className="text-sm font-bold text-foreground">{change.label}</span>
                          </motion.div>
                        ))}

                        {whatChanged.partialFailure && (
                          <div className="flex items-start gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                             <div className="w-10 h-10 rounded-xl bg-card flex items-center justify-center shadow-sm shrink-0 border border-amber-500/10">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-600 uppercase tracking-tighter">{t("PartialOptimization")}</p>
                                <p className="text-xs text-amber-600/70 font-medium leading-relaxed">{t("PartialFailNote")}</p>
                             </div>
                          </div>
                        )}
                    </div>
                 </div>

                  <div className="bg-muted/5 p-6 rounded-xl border border-primary/10 flex items-start gap-5">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                     </div>
                     <div>
                        <p className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.2em] mb-1.5">{t("NextSteps")}</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                           {t("ReviewSections")}
                        </p>
                     </div>
                  </div>

                  <Button 
                    onClick={handleClose}
                    className="w-full h-12 rounded-xl bg-foreground text-background font-bold transition-all border border-foreground/20"
                  >
                     {t("GotIt")}
                  </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
