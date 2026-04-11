"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertCircle, Sparkles, Wand2, Zap, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tailorForJobAction } from "@/features/resume-builder/actions/resume-actions";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PersonalizationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseResumeId: string;
  baseResumeTitle: string;
}

export default function PersonalizationModal({
  open,
  onOpenChange,
  baseResumeId,
  baseResumeTitle,
}: PersonalizationModalProps) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [resumeTitle, setResumeTitle] = useState("");
  const [isTailoring, setIsTailoring] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isValid = jdText.trim().length >= 100;

  useEffect(() => {
    if (!open) {
      setJdText("");
      setResumeTitle("");
      setError(null);
      setIsTailoring(false);
      setShowTransition(false);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsTailoring(true);
    setError(null);

    try {
      const result = await tailorForJobAction(
        baseResumeId,
        resumeTitle || `${baseResumeTitle} — Tailored`,
        jdText
      );

      // Store whatChanged in sessionStorage for the editor to pick up
      sessionStorage.setItem(
        `whatChanged_${result.newResumeId}`,
        JSON.stringify(result.whatChanged)
      );

      // Trigger the transition overlay
      setShowTransition(true);
      
      // Give the transition some time to breathe
      setTimeout(() => {
        onOpenChange(false);
        // Show toast
        if (result.whatChanged.partialFailure) {
          toast.warning(t("TailoringPartialSuccess"));
        } else {
          toast.success(
            t("TailoredSuccess", { jobTitle: result.whatChanged.jobTitle })
          );
        }
        // Navigate
        router.push(`/dashboard/resume-builder/${result.newResumeId}`);
      }, 2000);

    } catch (err: any) {
      setError(err.message || t("TailoringFailed"));
      setIsTailoring(false);
    }
  };

  const handleClose = () => {
    if (isTailoring || showTransition) return;
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn(
        "sm:max-w-xl border border-primary/20 shadow-2xl rounded-2xl overflow-hidden transition-all duration-500 p-0",
        showTransition ? "bg-primary" : "bg-card"
      )}>
        {/* Modal content */}

        <AnimatePresence mode="wait">
          {!showTransition ? (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6 p-8"
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-4 text-2xl font-bold text-foreground">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  {t("PersonalizeTitle")}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-muted-foreground pt-4 border-t border-border mt-4 block">
                   {t("PersonalizeDesc") || "Target a specific job by pasting the description below. We'll optimize your resume to match the requirements."}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-2">
                {error && (
                  <Alert variant="destructive" className="rounded-2xl border-red-500/20 bg-red-500/10 text-red-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="font-semibold">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-3">
                  <Label htmlFor="jd-textarea" className="text-sm font-bold text-primary ml-1">{t("PasteJDLabel")}</Label>
                  <div className="relative group">
                    <Textarea
                      id="jd-textarea"
                      value={jdText}
                      onChange={(e) => setJdText(e.target.value)}
                      placeholder={t("JDPlaceholder")}
                      className="resize-none min-h-[220px] rounded-xl border-primary/20 focus:border-primary/50 focus:ring-primary/10 transition-all bg-muted/20 p-4 font-normal"
                      disabled={isTailoring}
                    />
                    <div className="absolute bottom-4 end-4 bg-background/80 backdrop-blur px-2 py-1 border border-primary/10 shadow-sm">
                      <span className={cn(
                        "text-[10px] font-mono font-bold",
                        jdText.length < 100 ? "text-amber-500" : "text-green-500"
                      )}>
                        {jdText.length} / 100
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="resume-title" className="text-sm font-bold text-primary ml-1">{t("ResumeTitleAutoLabel")}</Label>
                  <Input
                    id="resume-title"
                    value={resumeTitle}
                    onChange={(e) => setResumeTitle(e.target.value)}
                    placeholder={t("ResumeTitlePlaceholder")}
                    className="h-12 rounded-xl border-primary/20 focus:border-primary/50 focus:ring-primary/10 bg-muted/20"
                    disabled={isTailoring}
                  />
                </div>
              </div>

              <DialogFooter className="gap-3 sm:gap-2 pt-6 border-t border-primary/10">
                <Button
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isTailoring}
                  className="rounded-xl h-12 px-6 text-muted-foreground hover:text-foreground font-bold"
                >
                  {t("Cancel")}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isTailoring}
                  className="rounded-xl h-12 px-8 font-bold shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white min-w-[160px]"
                >
                  {isTailoring ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      {t("Analyzing")}
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-3" />
                      {t("PersonalizeButton")}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          ) : (
            <motion.div
              key="transition-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center text-white"
            >
              <div className="relative">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                   className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-8 border border-white/30"
                >
                   <Zap className="w-12 h-12 text-white fill-white" />
                </motion.div>
                <motion.div 
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: 0.5 }}
                   className="absolute -top-2 -right-2 bg-green-400 w-8 h-8 rounded-full flex items-center justify-center border-4 border-primary shadow-lg"
                >
                   <CheckCircle2 className="w-5 h-5 text-green-900" />
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold mb-3 tracking-tight">{t("RefiningDocument")}</h2>
              <p className="text-white/70 font-medium max-w-[320px] mb-8 leading-relaxed">
                {t("CloningAndTailoring")}
              </p>
              
              <div className="flex gap-3">
                 {[0, 1, 2].map((i) => (
                   <motion.div 
                      key={i}
                      animate={{ 
                        scale: [1, 1.5, 1], 
                        opacity: [0.3, 1, 0.3],
                        backgroundColor: ["rgba(255,255,255,0.3)", "rgba(255,255,255,1)", "rgba(255,255,255,0.3)"]
                      }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                   />
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
