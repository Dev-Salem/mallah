"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Plus,
  Loader2,
  FileText,
  Trash2,
  Download,
  LayoutTemplate,
  Copy,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  createGeneralResumeAction,
  deleteResumeAction,
  cloneResumeAction,
} from "@/features/resume-builder/actions/resume-actions";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PersonalizationModal from "./personalization-modal";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ResumeCardsGrid({ initialData = [] }: { initialData: any[] }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [isCreatingGeneral, setIsCreatingGeneral] = useState(false);
  const [isNamingGeneral, setIsNamingGeneral] = useState(false);
  const [generalResumeTitle, setGeneralResumeTitle] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [cloningId, setCloningId] = useState<string | null>(null);

  // Personalization modal state
  const [tailorBaseResume, setTailorBaseResume] = useState<{
    id: string;
    title: string;
  } | null>(null);

  // Resume deletion handlers
  const openDeleteDialog = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmationText("");
  };

  const closeDeleteDialog = () => {
    setDeletingId(null);
    setDeleteConfirmationText("");
    setIsDeleting(false);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    try {
      await deleteResumeAction(deletingId);
      toast.success(t("ResumeDeletedSuccess") || "Resume deleted successfully");
      closeDeleteDialog();
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete resume");
      setIsDeleting(false);
    }
  };

  const handleCreateGeneral = async () => {
    if (!generalResumeTitle.trim()) {
      setIsNamingGeneral(true);
      return;
    }
    setIsCreatingGeneral(true);
    try {
      const resume = await createGeneralResumeAction(generalResumeTitle);
      router.push(`/dashboard/resume-builder/${resume.resume_id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to create resume");
    } finally {
      setIsCreatingGeneral(false);
      setIsNamingGeneral(false);
      setGeneralResumeTitle("");
    }
  };

  const handleClone = async (resumeId: string, resumeTitle: string) => {
    setCloningId(resumeId);
    try {
      await cloneResumeAction(resumeId, `Copy of ${resumeTitle || "Resume"}`);
      toast.success(t("CloneSuccess"));
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to clone resume");
    } finally {
      setCloningId(null);
    }
  };

  const resumes = initialData;
  const isAtLimit = resumes.length >= 3;
  const bestAts = resumes.length > 0 ? Math.max(...resumes.map(r => r.ats_score || 0)) : 0;

  return (
    <TooltipProvider>
      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Enhanced Glassmorphism Header */}
        <div className="relative group">
          {/* Background Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000" />
          
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-8 rounded-3xl bg-card/30 backdrop-blur-xl border border-primary/10 shadow-2xl overflow-hidden">
            {/* Inner HUD Grid Decoration */}
            <div className="absolute inset-0 hud-grid opacity-[0.02] pointer-events-none" />
            
            {/* Soft Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 relative z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground uppercase italic">
                    {t("MyResumes")}
                  </h1>
                  <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 text-primary font-bold px-3 py-0.5 text-[10px] uppercase tracking-widest animate-pulse">
                    {t("SystemActive")}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-[0.2em] opacity-70 max-w-md leading-relaxed">
                  {t("ManageResumesDesc")}
                </p>
                
                {/* Stats Hub */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/40 border border-primary/5 relative overflow-hidden group/stat">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                    <FileText className="w-3.5 h-3.5 text-primary/60" />
                    <span className="text-[10px] font-black text-foreground uppercase tracking-tight relative z-10">
                      {resumes.length} <span className="text-muted-foreground ml-1">Documents</span>
                    </span>
                  </div>
                  {bestAts > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-background/40 border border-primary/5 relative overflow-hidden group/stat">
                      <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover/stat:opacity-100 transition-opacity" />
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500/60" />
                      <span className="text-[10px] font-black text-foreground uppercase tracking-tight relative z-10">
                        {bestAts}% <span className="text-muted-foreground ml-1">Best Score</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 relative z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="w-full sm:w-auto">
                    <Button
                      disabled={isAtLimit || isCreatingGeneral}
                      onClick={isAtLimit ? undefined : handleCreateGeneral}
                      className={cn(
                        "w-full sm:w-auto h-14 px-8 rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 group/btn overflow-hidden relative",
                        isAtLimit ? "bg-muted text-muted-foreground grayscale" : "bg-primary hover:bg-primary/90 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                      
                      {isCreatingGeneral ? (
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5 mr-3 group-hover/btn:rotate-90 transition-transform duration-300" />
                      )}
                      <span>{t("NewResume")}</span>
                    </Button>
                  </div>
                </TooltipTrigger>
                {isAtLimit && (
                  <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-4 shadow-2xl max-w-[200px]">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-center">{t("LimitReachedTooltip")}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </div>
          </div>
        </div>

        {/* Resumes Grid */}
        {resumes.length === 0 ? (
          <div className="mt-12">
            <Card
              className="glass border border-primary/20 bg-muted/5 hover:border-primary/40 transition-all cursor-pointer group rounded-2xl relative overflow-hidden"
              onClick={handleCreateGeneral}
            >
              {/* HUD Background Elements */}
              <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none" />

              

              <CardContent className="p-16 text-center flex flex-col items-center justify-center min-h-[350px] relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-background/50 backdrop-blur-sm shadow-xl border border-primary/30 flex items-center justify-center mb-8 group-hover:scale-105 group-hover:border-primary/60 transition-all duration-500 glow-border">
                  <LayoutTemplate className="w-10 h-10 text-primary drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                </div>
                <h3 className="font-black text-2xl text-foreground uppercase tracking-tight leading-none mb-4 drop-shadow-sm">{t("GeneralDescriptionTitle")}</h3>
                <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed font-bold text-[10px] uppercase tracking-[0.2em] opacity-80">
                   {t("EmptyStateMessage")}
                </p>
                <Button 
                  variant="outline" 
                  className="mt-10 rounded-xl border-primary/30 font-bold group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all px-10 h-14 text-sm tracking-wide shadow-lg shadow-primary/5 group-hover:shadow-primary/20" 
                  disabled={isCreatingGeneral}>
                  {isCreatingGeneral ? (
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-3" />
                  )}
                  {t("NewResume")}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumes.map((resume) => (
              <ResumeCard 
                key={resume.resume_id}
                resume={resume}
                t={t}
                onClone={handleClone}
                onDelete={openDeleteDialog}
                onTailor={(id, title) => setTailorBaseResume({ id, title })}
                isCloning={cloningId === resume.resume_id}
                isAtLimit={isAtLimit}
              />
            ))}
          </div>
        )}

        {/* Create General Resume Dialog */}
        <Dialog open={isNamingGeneral} onOpenChange={(open) => {
          if (!open) {
            setIsNamingGeneral(false);
            setGeneralResumeTitle("");
          }
        }}>
          <DialogContent className="rounded-3xl border border-primary/20 bg-background shadow-2xl p-8 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                {t("NewResume")}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest pt-2">
                {t("ResumeTitle")}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={generalResumeTitle}
                onChange={(e) => setGeneralResumeTitle(e.target.value)}
                placeholder={t("ResumeTitlePlaceholder")}
                className="h-12 rounded-xl border-primary/20 focus:border-primary/50 focus:ring-primary/10 bg-muted/20 font-bold"
                onKeyDown={(e) => e.key === "Enter" && handleCreateGeneral()}
                autoFocus
              />
            </div>
            <DialogFooter className="gap-2 pt-2">
              <Button
                variant="ghost"
                onClick={() => setIsNamingGeneral(false)}
                className="rounded-xl h-12 px-6 text-muted-foreground font-bold uppercase tracking-widest text-[10px]"
              >
                {t("Cancel")}
              </Button>
              <Button
                onClick={handleCreateGeneral}
                disabled={!generalResumeTitle.trim() || isCreatingGeneral}
                className="rounded-xl h-12 px-8 font-black uppercase tracking-widest text-[10px] bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 min-w-[120px]"
              >
                {isCreatingGeneral ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("CreateGeneral")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && closeDeleteDialog()}>
          <AlertDialogContent className="rounded-3xl border border-border bg-background shadow-2xl p-0 overflow-hidden max-w-md">
            <div className="p-8 space-y-6">
              <AlertDialogHeader>
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-4">
                   <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-foreground">{t("DeleteTitle")}</AlertDialogTitle>
                <AlertDialogDescription className="space-y-4 pt-2 block" asChild>
                  <div className="text-foreground/70">
                    <p className="font-bold text-xs leading-relaxed">{t("DeleteDescription1")}</p>
                    <div className="bg-red-500/10 p-4 border border-red-500/30 rounded-xl">
                      <p className="text-[10px] font-black text-red-500 uppercase tracking-widest leading-none mb-2">
                        {t("DeleteDescription2")}
                      </p>
                      <p className="text-sm font-black text-foreground uppercase tracking-tight">
                        {t("DeleteDescription3")}
                      </p>
                    </div>
                    <div className="space-y-2 mt-4">
                       <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest ml-1">{t("TypeDeleteToConfirm")}</p>
                       <Input
                         value={deleteConfirmationText}
                         onChange={(e) => setDeleteConfirmationText(e.target.value)}
                         placeholder="DELETE"
                         disabled={isDeleting}
                         className="h-12 rounded-xl border-border bg-muted/30 focus:ring-red-500 focus:border-red-500 font-mono text-center tracking-widest font-bold"
                       />
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3 mt-4">
                <AlertDialogCancel disabled={isDeleting} className="rounded-xl h-12 border-primary/10 bg-muted/5 font-bold px-6">{t("Cancel")}</AlertDialogCancel>
                <AlertDialogAction
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteConfirm();
                  }}
                  disabled={deleteConfirmationText !== "DELETE" || isDeleting}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-xl h-12 border-none disabled:opacity-50 font-black uppercase tracking-widest px-8 shadow-lg shadow-red-600/20"
                >
                  {isDeleting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    t("DeleteResume")
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        {/* Personalization Modal */}
        {tailorBaseResume && (
          <PersonalizationModal
            open={!!tailorBaseResume}
            onOpenChange={(open) => !open && setTailorBaseResume(null)}
            baseResumeId={tailorBaseResume.id}
            baseResumeTitle={tailorBaseResume.title}
          />
        )}
      </div>
    </TooltipProvider>
  );
}

function ResumeCard({ resume, t, onClone, onDelete, onTailor, isCloning, isAtLimit }: { 
  resume: any; 
  t: any; 
  onClone: (id: string, title: string) => void; 
  onDelete: (id: string) => void;
  onTailor: (id: string, title: string) => void;
  isCloning: boolean;
  isAtLimit: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isJobBased = resume.resume_type === "job_based" || resume.resume_type === "tailored";
  const targetCompany = resume.source_jd?.company_name;
  const targetRole = resume.source_jd?.job_title;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      <Card
        className={cn(
          "group relative flex flex-col h-full bg-dashboard-card-bg rounded-3xl overflow-hidden transition-all duration-500",
          "border border-primary/10",
          "hover:shadow-xl hover:border-primary/20 ring-0"
        )}
      >
        {/* Smooth Glow Gradient */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-colors" />

        {/* Card Header Illustration Area */}
        <div className="h-40 bg-muted/20 flex items-end justify-center overflow-hidden border-b border-primary/10 relative">
          <div className="absolute inset-0 bg-[radial-gradient(var(--primary)_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-[0.03]"></div>
          
          <div className="bg-card shadow-2xl border border-border rounded-xl w-[120px] h-[160px] p-2.5 relative z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out flex flex-col gap-2">
            <div className="w-12 h-1.5 bg-muted rounded-full"></div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-muted/40 rounded-full"></div>
              <div className="w-full h-1 bg-muted/40 rounded-full"></div>
              <div className="w-[90%] h-1 bg-muted/40 rounded-full"></div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="w-1/3 h-1.5 bg-muted rounded-full"></div>
              <div className="w-full h-0.5 bg-muted/20 rounded-full"></div>
              <div className="w-full h-0.5 bg-muted/20 rounded-full"></div>
            </div>
          </div>

          {isJobBased && (
             <div className="absolute top-4 start-4 z-10">
                <div className="flex items-center gap-1.5 bg-dashboard-card-bg/90 backdrop-blur px-2.5 py-1 border border-primary/10 rounded-full shadow-sm">
                   <Target className="w-3.5 h-3.5 text-primary" />
                   <span className="text-[9px] font-black uppercase tracking-wider text-primary">
                      {t("Targeted")}
                   </span>
                </div>
             </div>
          )}

          <div className="absolute top-4 end-4 z-10">
             {(() => {
                const score = resume.ats_score || 0;
                const scoreColor = score >= 80 ? "text-green-400 bg-green-500/5 border-green-500/10 shadow-green-500/5" :
                                 score >= 60 ? "text-yellow-400 bg-yellow-500/5 border-yellow-500/10 shadow-yellow-500/5" :
                                 score > 0 ? "text-red-400 bg-red-500/5 border-red-500/10 shadow-red-500/5" :
                                 "text-muted-foreground bg-dashboard-card-bg/50 border-primary/5";
                
                return (
                  <div className={cn(
                    "backdrop-blur-md px-3 py-1 border rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    scoreColor
                  )}>
                    <span className="opacity-50 mr-1">ATS</span> {resume.ats_score || "—"}
                  </div>
                );
             })()}
          </div>

          {/* Header HUD Overlay */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-md z-30 flex items-center justify-center p-4 border-b border-primary/20"
              >

                
                <div className="grid grid-cols-2 gap-4 w-full max-w-[160px] relative z-40">
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.05 }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          asChild 
                          className="w-full h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all active:scale-90 glow-border"
                        >
                          <Link href={`/dashboard/resume-builder/${resume.resume_id}`}>
                            <FileText className="w-5 h-5" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p className="font-bold text-xs">{t("Edit")}</p></TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            disabled={isAtLimit}
                            onClick={() => onTailor(resume.resume_id, resume.title)}
                            className="w-full h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all active:scale-90 glow-border"
                          >
                            {isJobBased ? <Target className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent><p className="font-bold text-xs">{t("TailorForJob")}</p></TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            disabled={isAtLimit || isCloning}
                            onClick={() => onClone(resume.resume_id, resume.title)}
                            className="w-full h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all active:scale-90 glow-border"
                          >
                            {isCloning ? <Loader2 className="w-5 h-5 animate-spin" /> : <Copy className="w-5 h-5" />}
                          </Button>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent><p className="font-bold text-xs">{t("Clone")}</p></TooltipContent>
                    </Tooltip>
                  </motion.div>

                  <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="secondary" 
                          size="icon" 
                          asChild
                          className="w-full h-12 rounded-2xl bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary transition-all active:scale-90 glow-border"
                        >
                          <a href={`/api/resume/${resume.resume_id}/export`} download>
                            <Download className="w-5 h-5" />
                          </a>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent><p className="font-bold text-xs">{t("Download")}</p></TooltipContent>
                    </Tooltip>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-5 flex flex-col flex-grow bg-dashboard-card-bg relative z-10">
          <div className="space-y-1.5 mb-4">
            <h3 className="font-black text-foreground uppercase truncate pr-4 leading-tight group-hover:text-primary transition-colors text-sm tracking-tight" title={resume.title}>
              {resume.title || t("UntitledResume")}
            </h3>
            
            {isJobBased && (
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-primary uppercase tracking-wider">
                 <span className="truncate">{targetCompany || targetRole || "Specific Role"}</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-primary/10">
             <span className="text-[9px] font-mono font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                UPD: {new Date(resume.last_updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
             </span>
             
             <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onDelete(resume.resume_id)}
                      className="h-7 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg px-2"
                    >
                       <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                       <span className="text-[9px] font-black uppercase tracking-widest">{t("Delete")}</span>
                    </Button>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
