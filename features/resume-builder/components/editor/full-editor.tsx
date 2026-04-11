"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Loader2,
  Download,
  Save,
  ArrowLeft,
  BarChart3,
  Sparkles,
  Target,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

import { buildSectionNavItems, type SectionType } from "./section-nav";
import EditorFormPanel from "./editor-form-panel";
import ATSModal, { type ATSBreakdown, type ATSHint } from "./ats-modal";
import PreviewCard from "../live-preview/preview-card";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { cn } from "@/lib/utils";

// New components
import { TwoZoneLayout } from "./two-zone-layout";
import { LeftNav, NavItem } from "./left-nav";
import { EditPreviewToggle } from "./edit-preview-toggle";
import { JDKeywordStrip } from "./jd-keyword-strip";
import { LiveKeywordPanel } from "./live-keyword-panel";
import { WhatChangedPanel } from "./what-changed-panel";
import PersonalizationModal from "../personalization-modal";

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function FullEditor({ resume }: { resume: any }) {
  const t = useTranslations("ResumeBuilder");

  /* ── State ────────────────────────────────────────────────────────────────── */
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<any[]>(resume.resume_sections || []);
  const [atsScore, setAtsScore] = useState<number | null>(resume.ats_score);
  const [hints, setHints] = useState<ATSHint[]>([]);
  const [atsBreakdown, setAtsBreakdown] = useState<ATSBreakdown>({
    keywordCoverage: 0,
    sectionCompleteness: 0,
    summaryQuality: 0,
    projectDescriptions: 0,
    formatting: 0,
  });
  const [activeSection, setActiveSection] = useState<SectionType>("PERSONAL_INFO");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [atsModalOpen, setAtsModalOpen] = useState(false);
  const [tailorModalOpen, setTailorModalOpen] = useState(false);

  const isJobBased = resume.resume_type === "job_based" || resume.resume_type === "tailored" || !!resume.source_jd;
  const jobTitle = isJobBased ? resume.source_jd?.job_title : undefined;
  const companyName = isJobBased ? resume.source_jd?.company_name : undefined;
  const requiredSkills = isJobBased ? resume.source_jd?.required_skills || [] : [];

  /* ── Handlers ─────────────────────────────────────────────────────────────── */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const atsResult = await saveResumeAction(resume.resume_id, sections);
      setAtsScore(atsResult.score);
      setHints(atsResult.hints || []);
      if (atsResult.breakdown) {
        setAtsBreakdown(atsResult.breakdown);
      }
      toast.success(t("SaveSuccess"));
    } catch {
      toast.error(t("SaveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleFixNavigation = useCallback(
    (section: SectionType) => {
      setActiveSection(section);
      setActiveTab("edit");
    },
    []
  );

  /* ── Derived ──────────────────────────────────────────────────────────────── */
  const oldNavItems = buildSectionNavItems(sections, t);
  const navItems: NavItem[] = oldNavItems.map(item => ({
    id: item.type,
    label: item.label,
    isComplete: item.status === "green",
    isActive: activeSection === item.type
  }));

  const scoreColor =
    atsScore === null
      ? "text-slate-400"
      : atsScore >= 75
        ? "text-green-500 bg-green-500/10 border-green-500/20"
        : atsScore >= 50
          ? "text-amber-500 bg-amber-500/10 border-amber-500/20"
          : "text-red-500 bg-red-500/10 border-red-500/20";

  /* ── Render ───────────────────────────────────────────────────────────────── */
  
  const headerNode = (
    <div className="flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b bg-card shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/resume-builder"
            className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <h1 className="text-xl font-bold tracking-tight text-foreground max-w-sm truncate">
                {resume.title || t("UntitledResume")}
              </h1>
            {isJobBased && (
              <div className={cn(
                "px-2 py-0.5 rounded-lg text-xs font-bold border",
                "text-primary bg-primary/10 border-primary/20"
              )}>
                {t("JobBased")}
              </div>
            )}
            </div>
            {isJobBased && (
               <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mt-0.5">
                  <Target className="w-3 h-3 text-primary" />
                  <span>{companyName || jobTitle || "Target Role"}</span>
                  <ChevronRight className="w-3 h-3 opacity-50" />
               </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setAtsModalOpen(true)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all hover:bg-accent active:scale-95",
              scoreColor
            )}
          >
            <BarChart3 className="w-4 h-4" />
            <span className="opacity-60">{t("Score")}:</span>
            <span>{atsScore !== null ? `${atsScore}` : "—"}</span>
          </button>

          <Button
            variant="outline"
            onClick={() => setTailorModalOpen(true)}
            className="rounded-xl h-10 px-4 border-border hover:border-primary/30 hover:bg-primary/5 text-foreground font-bold text-xs transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            {t("TailorForJob")}
          </Button>

          <div className="h-6 w-px bg-border mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl h-10 px-4 text-muted-foreground font-bold text-xs hover:bg-accent"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {t("Save")}
          </Button>

          <Button 
            size="sm" 
            onClick={() => {
              const summarySection = sections.find(s => s.section_type === "SUMMARY");
              const skillsSection = sections.find(s => s.section_type === "SKILLS");
              
              const hasSummary = summarySection?.content?.text?.trim().length > 0;
              const hasSkills = (skillsSection?.content?.skills?.length || 0) > 0;

              if (!hasSummary || !hasSkills) {
                toast.error(t("ExportGuardError"));
                return;
              }
              window.open(`/api/resume/${resume.resume_id}/export`, "_blank");
            }}
            className="rounded-xl h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 font-bold text-xs"
          >
            <Download className="w-4 h-4 mr-2" />
            {t("Export")}
          </Button>
        </div>
      </header>
      {isJobBased && (
        <JDKeywordStrip requiredSkills={requiredSkills} resumeText={JSON.stringify(sections)} />
      )}
    </div>
  );

  const leftNavNode = (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <LeftNav 
        items={navItems}
        onSelect={(id) => {
          setActiveSection(id as SectionType);
          setActiveTab("edit");
        }}
      />
      {isJobBased && (
        <div className="mt-auto p-4 border-t border-border overflow-hidden">
          <LiveKeywordPanel requiredSkills={requiredSkills} preferredSkills={[]} resumeText={JSON.stringify(sections)} />
        </div>
      )}
    </div>
  );

  const rightEditorNode = (
    <div className="flex flex-col h-full overflow-hidden bg-background">
      <WhatChangedPanel resumeId={resume.resume_id} />
      <div className="px-8 pt-6 pb-4 bg-transparent shrink-0 flex items-center justify-between">
         <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {navItems.find(i => i.id === activeSection)?.label}
            </h2>
            <p className="text-xs font-medium text-muted-foreground">Section Editor</p>
         </div>
         <EditPreviewToggle 
            mode={activeTab} 
            onChange={setActiveTab} 
         />
      </div>

      <div className="flex-grow overflow-hidden px-4 md:px-8 pb-8">
        <div className="h-full bg-card rounded-2xl shadow-xl border border-border overflow-hidden relative">

          {activeTab === "edit" ? (
            <EditorFormPanel
              initialSections={sections}
              resumeId={resume.resume_id}
              activeSection={activeSection}
              onUpdate={(newSections: any[]) => setSections(newSections)}
            />
          ) : (
            <div className="h-full overflow-auto p-8 bg-muted/20">
               <PreviewCard sections={sections} resumeInfo={resume} />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <TwoZoneLayout 
        header={headerNode}
        leftNav={leftNavNode}
        rightEditor={rightEditorNode}
        className="bg-background"
      />

      <ATSModal
        open={atsModalOpen}
        onOpenChange={setAtsModalOpen}
        score={atsScore}
        breakdown={atsBreakdown}
        hints={hints}
        isJobBased={isJobBased}
        jobTitle={jobTitle}
        onFixNavigation={handleFixNavigation}
      />

      {tailorModalOpen && (
        <PersonalizationModal
          open={tailorModalOpen}
          onOpenChange={setTailorModalOpen}
          baseResumeId={resume.resume_id}
          baseResumeTitle={resume.title || "Resume"}
        />
      )}
    </>
  );
}
