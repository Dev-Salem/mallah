"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJobBasedResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { getSavedAnalysesAction } from "@/features/opportunity-analyzer/actions/analyzer.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2, Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const jobResumeSchema = z.object({
  jobDescription: z.string().min(100, "Please provide a more detailed job description (minimum 100 characters)."),
  title: z.string().min(1, "Resume title is required."),
});

type JobResumeForm = z.infer<typeof jobResumeSchema>;

export default function JobSetupModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<any[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("paste");

  const form = useForm<JobResumeForm>({
    resolver: zodResolver(jobResumeSchema),
    defaultValues: {
      jobDescription: "",
      title: "Target Job Resume",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setIsLoadingSaved(true);
      getSavedAnalysesAction()
        .then(res => {
          if (Array.isArray(res)) {
            setSavedAnalyses(res);
          }
        })
        .finally(() => setIsLoadingSaved(false));
    } else {
      // Reset when closed
      form.reset({
        jobDescription: "",
        title: "Target Job Resume",
      });
      setActiveTab("paste");
    }
  }, [isOpen, form]);

  const onSubmit = async (data: JobResumeForm) => {
    setIsSubmitting(true);
    try {
      const resume = await createJobBasedResumeAction(data.jobDescription, data.title);
      toast.success(t("JobBasedCreated"));
      onClose();
      router.push(`/dashboard/resume-builder/${resume.resume_id}`);
    } catch (e: any) {
      toast.error(e.message || t("JobBasedCreateFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAnalysis = (analysis: any) => {
    form.setValue("jobDescription", analysis.raw_jd_text || "", { shouldValidate: true });
    form.setValue("title", analysis.job_title ? `${analysis.job_title} Resume` : "Target Job Resume", { shouldValidate: true });
    setActiveTab("paste"); // Switch back to paste tab to review/edit, or stay? Switching is good for visibility.
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("WhichJobTitle")}</DialogTitle>
          <DialogDescription>
            {t("WhichJobDescription")}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="paste">Paste JD</TabsTrigger>
            <TabsTrigger value="saved">Saved Analyses</TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="space-y-4 pt-4">
            {isLoadingSaved ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : savedAnalyses.length === 0 ? (
              <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20 text-muted-foreground text-sm">
                No saved job analyses found.
              </div>
            ) : (
              <div className="h-[250px] overflow-y-auto border rounded-md">
                <div className="p-3 flex flex-col gap-2">
                  {savedAnalyses.map((analysis) => (
                    <button
                      key={analysis.id}
                      type="button"
                      onClick={() => handleSelectAnalysis(analysis)}
                      className="flex items-start text-left gap-3 p-3 rounded-md hover:bg-muted/50 border bg-background transition-colors"
                    >
                      <div className="mt-0.5 p-1.5 bg-primary/10 text-primary rounded-md">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <h4 className="font-semibold text-sm truncate">
                          {analysis.job_title || "Untitled Job"}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {analysis.company_name || "Unknown Company"}
                        </p>
                      </div>
                      <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {analysis.match_score}% Match
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground text-center">
              Select a saved job analysis to auto-fill the description.
            </p>
          </TabsContent>

          <TabsContent value="paste">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
                <FormField
                  control={form.control}
                  name="jobDescription"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("PasteJD")}</Label>
                      <FormControl>
                        <Textarea
                          placeholder={t("JDPlaceholder")}
                          className="min-h-[150px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <Label>{t("ResumeTitle")}</Label>
                      <FormControl>
                        <Input placeholder={t("ResumeTitlePlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
                    {t("Cancel")}
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {t("BuildJobResume")}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

      </DialogContent>
    </Dialog>
  );
}
