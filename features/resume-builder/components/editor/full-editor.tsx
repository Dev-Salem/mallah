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

  const isJobBased = resume.resume_type === "job_based" || resume.resume_type === "tailored";
  const jobTitle = isJobBased ? resume.source_jd?.job_title : undefined;
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
      ? "text-muted-foreground"
      : atsScore >= 75
        ? "text-green-600"
        : atsScore >= 50
          ? "text-amber-500"
          : "text-red-500";

  /* ── Render ───────────────────────────────────────────────────────────────── */
  
  const headerNode = (
    <div className="flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/resume-builder"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-bold truncate max-w-sm">
            {resume.title || t("UntitledResume")}
          </h1>
          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md">
            {isJobBased ? t("JobBased") : t("GeneralResume")}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setAtsModalOpen(true)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-sm font-semibold transition-colors hover:bg-muted/60",
              scoreColor
            )}
          >
            <BarChart3 className="w-4 h-4" />
            {t("ATSScore")}:{" "}
            {atsScore !== null ? `${atsScore}/100` : "—"}
          </button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-1.5" />
            )}
            {t("SaveChanges")}
          </Button>

          <Button size="sm" asChild>
            <a
              href={`/api/resume/${resume.resume_id}/export`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4 mr-1.5" />
              {t("DownloadPDF")}
            </a>
          </Button>
        </div>
      </header>
      {isJobBased && (
        <JDKeywordStrip requiredSkills={requiredSkills} resumeText={JSON.stringify(sections)} />
      )}
    </div>
  );

  const leftNavNode = (
    <div className="flex flex-col h-full bg-background">
      <LeftNav 
        items={navItems}
        onSelect={(id) => {
          setActiveSection(id as SectionType);
          setActiveTab("edit");
        }}
      />
      {isJobBased && (
        <div className="mt-auto p-4 border-t">
          <LiveKeywordPanel requiredSkills={requiredSkills} preferredSkills={[]} resumeText={JSON.stringify(sections)} />
        </div>
      )}
    </div>
  );

  const rightEditorNode = (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-6 pt-4 pb-2 bg-background border-b shrink-0 flex items-center justify-between">
         <h2 className="text-xl font-bold tracking-tight">
            {navItems.find(i => i.id === activeSection)?.label}
         </h2>
         <EditPreviewToggle 
            mode={activeTab} 
            onChange={setActiveTab} 
         />
      </div>

      {activeTab === "edit" ? (
        <EditorFormPanel
          initialSections={sections}
          resumeId={resume.resume_id}
          activeSection={activeSection}
          onUpdate={(newSections: any[]) => setSections(newSections)}
        />
      ) : (
        <PreviewCard sections={sections} resumeInfo={resume} />
      )}
    </div>
  );

  return (
    <>
      <TwoZoneLayout 
        header={headerNode}
        leftNav={leftNavNode}
        rightEditor={rightEditorNode}
        className="bg-muted/50"
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
    </>
  );
}
