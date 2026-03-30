"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import SummaryForm from "../forms/summary-form";
import ExperienceForm from "../forms/experience-form";
import EducationForm from "../forms/education-form";
import CertificationsForm from "../forms/certifications-form";

const WIZARD_STEPS = [
  { id: "SUMMARY", label: "ProfessionalSummary", Component: SummaryForm },
  { id: "EXPERIENCE", label: "Experience", Component: ExperienceForm },
  { id: "EDUCATION", label: "Education", Component: EducationForm },
  { id: "CERTIFICATIONS", label: "Certifications", Component: CertificationsForm }
];

export default function GuidedWizard({ resume }: { resume: any }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  
  // Track draft content for each section type
  const [draftSections, setDraftSections] = useState<Record<string, any>>({});

  const handleStepDataChange = (data: any) => {
    const stepId = WIZARD_STEPS[currentStep].id;
    setDraftSections(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const currentStepId = WIZARD_STEPS[currentStep].id;
  
  // Initial data: fallback to existing resume sections if not overridden in draft
  const getInitialData = () => {
    if (draftSections[currentStepId] !== undefined) {
      return draftSections[currentStepId];
    }
    const existingSection = resume.resume_sections?.find((s: any) => s.section_type === currentStepId);
    return existingSection?.content || null;
  };

  const handleNext = async () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      // Finish Wizard - save all drafted sections
      setIsSaving(true);
      try {
        // Build the payload: array of { section_type, content }
        const newSections = Object.entries(draftSections).map(([section_type, content]) => ({
          section_type,
          content
        }));

        if (newSections.length > 0) {
          await saveResumeAction(resume.id || resume.resume_id, newSections);
          toast.success(t("ResumeSaved"));
        } else {
          toast.success(t("WizardCompleted"));
        }
        
        // Refresh page to load FullEditor
        window.location.reload(); 
      } catch (e: any) {
        toast.error(e.message || t("FailedToSave"));
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSkip = () => {
    // Proceed without saving current step changes explicitly (though draft state remains if touched)
    handleNext(); 
  };

  const CurrentComponent = WIZARD_STEPS[currentStep].Component;

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full space-y-4">
        <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
          <span>{t("Step", { current: currentStep + 1, total: WIZARD_STEPS.length, title: t(WIZARD_STEPS[currentStep].label) })}</span>
          <button onClick={() => window.location.reload()} className="hover:text-primary transition-colors hover:underline">
            {t("SkipToEditor")}
          </button>
        </div>
        
        <div className="h-2 bg-muted rounded-full w-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
          />
        </div>

        <Card className="w-full shadow-lg border-2 mt-8">
          <CardHeader>
            <CardTitle className="text-2xl">{t(WIZARD_STEPS[currentStep].label)}</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[400px] border-y bg-slate-50/50 p-6">
            <CurrentComponent
              initialData={getInitialData()}
              onChange={handleStepDataChange}
              t={t}
            />
          </CardContent>
          <CardFooter className="flex justify-between p-6">
            <Button variant="ghost" onClick={() => setCurrentStep(c => Math.max(0, c - 1))} disabled={currentStep === 0 || isSaving}>
              {t("Back")}
            </Button>
            <div className="space-x-4">
              <Button variant="outline" onClick={handleSkip} disabled={isSaving}>
                {t("SkipStep")}
              </Button>
              <Button onClick={() => handleNext()} disabled={isSaving}>
                {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {currentStep === WIZARD_STEPS.length - 1 ? t("FinishOpenEditor") : t("Continue")}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
