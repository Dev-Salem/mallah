"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createJobBasedResumeAction } from "@/features/resume-builder/actions/resume-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

const jobResumeSchema = z.object({
  jobDescription: z.string().min(100, "Please provide a more detailed job description (minimum 100 characters)."),
  title: z.string().min(1, "Resume title is required."),
});

type JobResumeForm = z.infer<typeof jobResumeSchema>;

export default function JobSetupModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const t = useTranslations("ResumeBuilder");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<JobResumeForm>({
    resolver: zodResolver(jobResumeSchema),
    defaultValues: {
      jobDescription: "",
      title: "Target Job Resume",
    },
  });

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{t("WhichJobTitle")}</DialogTitle>
          <DialogDescription>
            {t("WhichJobDescription")}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="jobDescription"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <Label>{t("PasteJD")}</Label>
                  <FormControl>
                    <Textarea 
                      placeholder={t("JDPlaceholder")} 
                      className="min-h-[150px]" 
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
              render={({ field }: { field: any }) => (
                <FormItem>
                  <Label>{t("ResumeTitle")}</Label>
                  <FormControl>
                    <Input placeholder={t("ResumeTitlePlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4">
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
      </DialogContent>
    </Dialog>
  );
}
