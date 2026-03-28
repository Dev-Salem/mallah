"use client";

import { useTranslations } from "next-intl";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Loader2,
  Download,
  Save,
  ArrowLeft,
  BarChart3,
} from "lucide-react";
import Link from "next/link";

import SectionNav, {
  buildSectionNavItems,
  type SectionType,
} from "./section-nav";
import EditorFormPanel from "./editor-form-panel";
import ATSModal, { type ATSBreakdown, type ATSHint } from "./ats-modal";
import PreviewCard from "../live-preview/preview-card";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { cn } from "@/lib/utils";

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

  const isJobBased = resume.resume_type === "job_based";
  const jobTitle = isJobBased ? resume.source_jd?.job_title : undefined;

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
  const navItems = buildSectionNavItems(sections, t);

  const scoreColor =
    atsScore === null
      ? "text-muted-foreground"
      : atsScore >= 75
        ? "text-green-600"
        : atsScore >= 50
          ? "text-amber-500"
          : "text-red-500";

  /* ── Render ───────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-muted/20">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background z-10 shrink-0 shadow-sm">
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
          {/* ATS Badge */}
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

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Nav */}
        <SectionNav
          sections={navItems}
          activeSection={activeSection}
          onSectionChange={(section) => {
            setActiveSection(section);
            setActiveTab("edit");
          }}
        />

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Edit / Preview Tabs */}
          <div className="px-6 pt-4 pb-2 bg-background border-b shrink-0">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "edit" | "preview")}
            >
              <TabsList className="grid w-[200px] grid-cols-2">
                <TabsTrigger value="edit">{t("Edit")}</TabsTrigger>
                <TabsTrigger value="preview">{t("Preview")}</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Content */}
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
      </main>

      {/* ATS Modal */}
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
    </div>
  );
}
