"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const WIZARD_STEPS = ["Summary", "Experience", "Education", "Certifications"];

export default function GuidedWizard({ resume }: { resume: any }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [sectionsData, setSectionsData] = useState<any[]>([]);

  const handleNext = async (stepData?: any) => {
      // Accumulate data
      const newSections = [...sectionsData];
      if (stepData) {
          // Append or update stepData in newSections
          newSections.push(stepData);
          setSectionsData(newSections);
      }

      if (currentStep < WIZARD_STEPS.length - 1) {
          setCurrentStep(c => c + 1);
      } else {
          // Finish Wizard
          setIsSaving(true);
          try {
             await saveResumeAction(resume.resume_id, newSections, 'frontend'); // defaulting pathId for now
             toast.success("Resume wizard completed!");
             // Refresh page to load FullEditor
             window.location.reload(); 
          } catch (e: any) {
             toast.error(e.message || "Failed to save resume data");
          } finally {
             setIsSaving(false);
          }
      }
  };

  const handleSkip = () => {
      handleNext(); // proceed without adding section data
  };

  return (
      <div className="max-w-3xl mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
          <div className="w-full space-y-4">
              <div className="flex justify-between text-sm font-medium text-muted-foreground mb-4">
                  <span>{t("Step", { current: currentStep + 1, total: WIZARD_STEPS.length, title: WIZARD_STEPS[currentStep] })}</span>
                  <button onClick={() => handleNext()} className="hover:text-primary transition-colors hover:underline">
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
                      <CardTitle className="text-2xl">{WIZARD_STEPS[currentStep]}</CardTitle>
                  </CardHeader>
                  <CardContent className="min-h-[300px] flex items-center justify-center text-muted-foreground border-y bg-slate-50">
                      {/* Step Forms will be injected here */}
                      <p>Form mapping for {WIZARD_STEPS[currentStep]} goes here...</p>
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
