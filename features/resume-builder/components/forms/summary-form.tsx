"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useRef } from "react";
import {
  summarySchema,
  SummaryForm as SummaryFormType,
} from "@/features/resume-builder/types";
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
import AIImprovePanel from "../ai-improve-panel";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function SummaryForm({ initialData, onChange, t }: Props) {
  const [isImproving, setIsImproving] = useState(false);
  
  // AI Panel State
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [originalText, setOriginalText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");

  const form = useForm<SummaryFormType>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      text: initialData?.text || "",
    },
    mode: "onChange",
  });

  const textValue = form.watch("text");
  const wordCount = textValue?.trim()
    ? textValue.trim().split(/\s+/).length
    : 0;

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  const handleAIImprove = async () => {
    if (!textValue?.trim()) return;
    
    setIsImproving(true);
    setOriginalText(textValue);
    
    try {
      // In a real app, pathId and primaryGoal would come from the resume or user profile
      const improved = await aiImproveAction(
        textValue,
        "SUMMARY",
        "frontend",
        "Getting a job"
      );
      setSuggestedText(improved);
      setShowAIPanel(true);
    } catch {
      // Errors should be handled by standard toast providers up in the action
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptSuggestion = (text: string) => {
    form.setValue("text", text, { shouldValidate: true, shouldDirty: true });
    setShowAIPanel(false);
  };

  const handleRejectSuggestion = () => {
    setShowAIPanel(false);
  };

  return (
    <div className="space-y-4">
      {showAIPanel && (
        <AIImprovePanel
          originalText={originalText}
          suggestedText={suggestedText}
          onAccept={handleAcceptSuggestion}
          onReject={handleRejectSuggestion}
          onRetry={handleAIImprove}
          isRetrying={isImproving}
        />
      )}

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
                    className="h-7 gap-1.5 text-xs bg-primary/5 hover:bg-primary/10 text-primary border-primary/20"
                    onClick={handleAIImprove}
                    disabled={isImproving || !textValue?.trim() || showAIPanel}
                  >
                    {isImproving && !showAIPanel ? (
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
                    className="min-h-[140px] resize-none leading-relaxed"
                    maxLength={1000}
                    disabled={showAIPanel}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>
              {wordCount} {t("Words")}{" "}
              {wordCount > 0 && wordCount < 20 && `— ${t("AimFor20Words")}`}
            </span>
            <span>{textValue?.length || 0}/1000</span>
          </div>
        </form>
      </Form>
    </div>
  );
}
