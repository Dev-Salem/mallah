"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import JobSetupModal from "./job-setup-modal";
import { createGeneralResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ResumeCardsGrid({ initialData = [] }: { initialData: any[] }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [isCreatingGeneral, setIsCreatingGeneral] = useState(false);

  const handleCreateGeneral = async () => {
      setIsCreatingGeneral(true);
      try {
          const resume = await createGeneralResumeAction("General Resume");
          router.push(`/dashboard/resume-builder/${resume.resume_id}`);
      } catch (err: any) {
          toast.error(err.message || "Failed to create resume");
      } finally {
          setIsCreatingGeneral(false);
      }
  };

  // Filter or manage resumes
  const resumes = initialData;
  const isAtLimit = resumes.length >= 3;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("MyResumes")}</h1>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            disabled={isAtLimit || isCreatingGeneral}
            onClick={isAtLimit ? undefined : handleCreateGeneral}
          >
             {isAtLimit ? (
                 <span title={t("LimitReachedTooltip")} className="flex items-center">
                     <Plus className="w-4 h-4 mr-2" />
                     {t("GeneralResume")}
                 </span>
             ) : (
                 <span className="flex items-center">
                    {isCreatingGeneral ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                    {t("GeneralResume")}
                 </span>
             )}
          </Button>

          <Button 
            disabled={isAtLimit}
            className="flex items-center"
            onClick={() => setIsJobModalOpen(true)}
          >
            <Target className="w-4 h-4 mr-2" />
            {t("JobBasedResume")}
          </Button>
        </div>
      </div>

      {resumes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                  <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                      <p className="font-semibold text-foreground">{t("GeneralDescriptionTitle")}</p>
                      <p className="text-sm mt-2">{t("GeneralDescription")}</p>
                      <Button variant="outline" className="mt-4" disabled={isCreatingGeneral} onClick={handleCreateGeneral}>
                          {isCreatingGeneral && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                          {t("CreateGeneral")}
                      </Button>
                  </CardContent>
              </Card>
              <Card>
                  <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[200px]">
                      <p className="font-semibold text-foreground">{t("JobBasedDescriptionTitle")}</p>
                      <p className="text-sm mt-2">{t("JobBasedDescription")}</p>
                      <Button className="mt-4" onClick={() => setIsJobModalOpen(true)}>{t("CreateJobBased")}</Button>
                  </CardContent>
              </Card>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resumes.map(resume => (
                  <Card key={resume.resume_id} className="relative group overflow-hidden">
                      <div className="absolute top-2 right-2 z-10">
                        {resume.resume_type === 'job_based' && (
                            <Badge variant="secondary" className="flex items-center space-x-1 shadow-sm opacity-90 backdrop-blur">
                                <Target className="w-3 h-3 mr-1" />
                                <span>{t("JobBased")}</span>
                            </Badge>
                        )}
                      </div>
                      <CardContent className="p-0">
                          <div className="bg-muted h-[240px] w-full flex items-center justify-center overflow-hidden border-b relative">
                              {/* Background Pattern */}
                              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "10px 10px" }}></div>
                              
                              <div className="bg-white shadow-xl rounded-sm w-[140px] h-[200px] text-[8px] p-2 text-muted-foreground relative z-10 hover:scale-105 transition-transform duration-300">
                                   Preview Thumbnail
                              </div>
                          </div>
                          <div className="p-4 space-y-2">
                              <h3 className="font-semibold truncate">{resume.title || t("UntitledResume")}</h3>
                              <div className="flex items-center space-x-2 text-xs text-muted-foreground font-medium">
                                  <Badge variant={resume.ats_score && resume.ats_score > 75 ? "default" : "secondary"}>ATS: {resume.ats_score !== null ? `${resume.ats_score}/100` : "—"}</Badge>
                                  <span>•</span>
                                  <span suppressHydrationWarning>{new Date(resume.last_updated_at).toLocaleDateString()}</span>
                              </div>
                          </div>
                      </CardContent>
                      <CardFooter className="flex gap-2 p-4 pt-0">
                           <Button asChild className="w-full">
                               <Link href={`/dashboard/resume-builder/${resume.resume_id}`}>
                                  {t("Edit")}
                               </Link>
                           </Button>
                           <Button variant="outline" size="icon" asChild className="shrink-0">
                               <a href={`/api/resume/${resume.resume_id}/export`} download>
                                  <span className="sr-only">{t("Download")}</span>
                                  <span aria-hidden>↓</span>
                               </a>
                           </Button>
                      </CardFooter>
                  </Card>
              ))}
          </div>
      )}

      {isJobModalOpen && (
          <JobSetupModal isOpen={isJobModalOpen} onClose={() => setIsJobModalOpen(false)} />
      )}
    </div>
  );
}
