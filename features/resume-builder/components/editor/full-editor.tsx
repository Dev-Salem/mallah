"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AtsSidebar from "./ats-sidebar";
import EditorFormPanel from "./editor-form-panel";
import PreviewCard from "../live-preview/preview-card";
import { Button } from "@/components/ui/button";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { toast } from "sonner";
import { Loader2, Download, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FullEditor({ resume }: { resume: any }) {
  const t = useTranslations("ResumeBuilder");
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<any[]>(resume.resume_sections || []);
  const [atsScore, setAtsScore] = useState(resume.ats_score);
  const [hints, setHints] = useState<any[]>([]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const atsResult = await saveResumeAction(resume.resume_id, sections);
      setAtsScore(atsResult.score);
      setHints(atsResult.hints || []);
      toast.success(t("SaveSuccess"));
    } catch {
      toast.error(t("SaveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-muted/20">
      <header className="flex items-center justify-between p-4 border-b bg-background z-10 shrink-0 shadow-sm">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/resume-builder"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold truncate max-w-sm">
            {resume.title || t("UntitledResume")}
          </h1>
          <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-md">
            {resume.resume_type === "job_based"
              ? t("JobBased")
              : t("GeneralResume")}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {t("SaveChanges")}
          </Button>
          <Button asChild>
            <a
              href={`/api/resume/${resume.resume_id}/export`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4 mr-2" />
              {t("DownloadPDF")}
            </a>
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <AtsSidebar
          score={atsScore}
          hints={hints}
          isJobBased={resume.resume_type === "job_based"}
        />
        <EditorFormPanel
          initialSections={sections}
          resumeId={resume.resume_id}
          onUpdate={(newSections: any[]) => setSections(newSections)}
        />
        <PreviewCard sections={sections} resumeInfo={resume} />
      </main>
    </div>
  );
}
