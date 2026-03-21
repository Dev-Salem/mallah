"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import AtsSidebar from "./ats-sidebar";
import EditorFormPanel from "./editor-form-panel";
import PreviewCard from "../live-preview/preview-card";
import { Button } from "@/components/ui/button";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { toast } from "sonner";
import { Loader2, Download, Save } from "lucide-react";

export default function FullEditor({ resume }: { resume: any }) {
  const t = useTranslations("ResumeBuilder");
  const [isSaving, setIsSaving] = useState(false);
  const [sections, setSections] = useState<any[]>(resume.resume_sections || []);
  const [atsScore, setAtsScore] = useState(resume.ats_score);
  const [hints, setHints] = useState<any[]>([]);

  const handleSave = async (updatedSections: any[]) => {
      setIsSaving(true);
      try {
          const atsResult = await saveResumeAction(resume.resume_id, updatedSections);
          setAtsScore(atsResult.score);
          setHints(atsResult.hints || []);
          setSections(updatedSections);
          toast.success("Resume saved successfully");
      } catch (err: any) {
          toast.error("Failed to save resume");
      } finally {
          setIsSaving(false);
      }
  };

  return (
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-muted/20">
          <header className="flex items-center justify-between p-4 border-b bg-background z-10 shrink-0 shadow-sm">
              <div className="flex items-center space-x-4">
                  <h1 className="text-xl font-bold truncate max-w-sm">{resume.title || t("UntitledResume")}</h1>
                  <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-md">
                      {resume.resume_type === 'job_based' ? t("JobBased") : t("GeneralResume")}
                  </span>
              </div>
              <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={() => handleSave(sections)} disabled={isSaving}>
                      {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                      {/* {t("Save")} */}
                      Save Changes
                  </Button>
                  <Button asChild>
                      <a href={`/api/resume/${resume.resume_id}/export`} target="_blank" rel="noopener noreferrer">
                         <Download className="w-4 h-4 mr-2" />
                         {/* {t("Download")} */}
                         Download PDF
                      </a>
                  </Button>
              </div>
          </header>

          <main className="flex-1 flex overflow-hidden">
              <AtsSidebar score={atsScore} hints={hints} isJobBased={resume.resume_type === 'job_based'} />
              <EditorFormPanel 
                 initialSections={sections} 
                 onUpdate={(newSections) => {
                     setSections(newSections);
                     // Note: We can add auto-save debounce logic here in the future
                 }} 
              />
              <PreviewCard sections={sections} resumeInfo={resume} />
          </main>
      </div>
  );
}
