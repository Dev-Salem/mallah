"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { summarySchema, SummaryForm as SummaryFormType } from "@/features/resume-builder/types";
import { aiImproveAction } from "@/features/resume-builder/actions/resume-actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function SummaryForm({ initialData, onChange, t }: Props) {
  const [isImproving, setIsImproving] = useState(false);
  const form = useForm<SummaryFormType>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      text: initialData?.text || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  const textValue = form.watch("text");
  const wordCount = textValue?.trim() ? textValue.trim().split(/\s+/).length : 0;

  const handleAIImprove = async () => {
    if (!textValue?.trim()) return;
    setIsImproving(true);
    try {
      const improved = await aiImproveAction(textValue, "SUMMARY", "frontend", "Getting a job");
      form.setValue("text", improved, { shouldValidate: true, shouldDirty: true });
    } catch {
      // Silent fail — toast is handled upstream
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-3">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{t("ProfessionalSummary")}</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={handleAIImprove}
                  disabled={isImproving || !textValue?.trim()}
                >
                  {isImproving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Sparkles className="w-3 h-3" />
                  )}
                  {t("AIImprove")}
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder={t("SummaryPlaceholder")}
                  className="min-h-[120px] resize-none"
                  maxLength={1000}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {wordCount} {t("Words")} {wordCount < 20 && `— ${t("AimFor20Words")}`}
          </span>
          <span>{textValue?.length || 0}/1000</span>
        </div>
      </form>
    </Form>
  );
}
