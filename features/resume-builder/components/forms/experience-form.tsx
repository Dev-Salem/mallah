"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { experienceEntrySchema, ExperienceEntryForm as ExperienceEntryFormType } from "@/features/resume-builder/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit2, Sparkles, Loader2 } from "lucide-react";
import { aiImproveBulletsAction } from "../../actions/resume-actions";
import { InlineDiffPanel } from "../editor/inline-diff-panel";
interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function ExperienceForm({ initialData, onChange, t }: Props) {
  const [entries, setEntries] = useState<any[]>(Array.isArray(initialData) ? initialData : []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    onChange(entries);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  const handleAdd = () => {
    setEditingIndex(null);
    setIsAdding(true);
  };

  const handleEdit = (idx: number) => {
    setIsAdding(false);
    setEditingIndex(idx);
  };

  const handleDelete = (idx: number) => {
    const next = [...entries];
    next.splice(idx, 1);
    setEntries(next);
    if (editingIndex === idx) setEditingIndex(null);
  };

  const handleSaveEntry = (data: any) => {
    const next = [...entries];
    if (editingIndex !== null) {
      next[editingIndex] = data;
      setEditingIndex(null);
    } else {
      next.push({ ...data, id: crypto.randomUUID() });
      setIsAdding(false);
    }
    setEntries(next);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      {/* ── List/Form View ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div key={entry.id || idx}>
            {editingIndex === idx ? (
              <div className="border rounded-lg p-4 bg-muted/10 shadow-sm animate-in fade-in duration-300">
                <ExperienceSubForm
                  initialData={entry}
                  onSave={handleSaveEntry}
                  onCancel={handleCancel}
                  t={t}
                  isEditing
                />
              </div>
            ) : (
              <div
                className="flex items-center justify-between border rounded-md p-3 bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className="overflow-hidden">
                  <h4 className="font-semibold text-sm truncate">{entry.title || t("UntitledExperience")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {entry.company || t("Company")} • {entry.start} - {entry.current ? t("Present") : entry.end}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleEdit(idx)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding && (
          <div className="border rounded-lg p-4 bg-muted/10 shadow-sm animate-in slide-in-from-top-2 duration-300">
            <ExperienceSubForm
              initialData={null}
              onSave={handleSaveEntry}
              onCancel={handleCancel}
              t={t}
            />
          </div>
        )}

        {entries.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            {t("NoExperienceYet")}
          </p>
        )}
      </div>

      {!isAdding && editingIndex === null && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed h-12 text-muted-foreground hover:text-foreground"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4" />
          {t("AddExperience")}
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-Form for Drawer                                                       */
/* -------------------------------------------------------------------------- */

function ExperienceSubForm({ 
  initialData, 
  onSave, 
  onCancel, 
  t,
  isEditing = false
}: { 
  initialData: any, 
  onSave: (data: any) => void, 
  onCancel: () => void, 
  t: any,
  isEditing?: boolean
}) {
  const form = useForm<ExperienceEntryFormType>({
    resolver: zodResolver(experienceEntrySchema),
    defaultValues: {
      id: initialData?.id || "",
      title: initialData?.title || "",
      company: initialData?.company || "",
      location: initialData?.location || "",
      start: initialData?.start || "",
      end: initialData?.end || "",
      current: initialData?.current || false,
      bullets: initialData?.bullets?.length ? initialData.bullets : [""],
    },
  });

  const [isImproving, setIsImproving] = useState(false);
  const [improvingIndex, setImprovingIndex] = useState<number | null>(null);
  const [originalText, setOriginalText] = useState("");
  const [suggestedText, setSuggestedText] = useState("");

  const isCurrent = form.watch("current");
  const bullets = form.watch("bullets") || [""];

  const updateBullet = (idx: number, val: string) => {
    const next = [...bullets];
    next[idx] = val;
    form.setValue("bullets", next, { shouldValidate: true });
  };

  const addBullet = () => {
    form.setValue("bullets", [...bullets, ""], { shouldValidate: true });
  };

  const removeBullet = (idx: number) => {
    const next = [...bullets];
    next.splice(idx, 1);
    form.setValue("bullets", next, { shouldValidate: true });
  };

  const handleAIImprove = async (idx: number) => {
    const bulletText = bullets[idx];
    if (!bulletText?.trim()) return;

    setIsImproving(true);
    setImprovingIndex(idx);
    setOriginalText(bulletText);

    try {
      const improved = await aiImproveBulletsAction(
        [bulletText],
        "frontend",
        "Getting a job"
      );
      setSuggestedText(improved[0]);
    } catch {
      // Errors handled by server action
    } finally {
      setIsImproving(false);
    }
  };

  const handleAcceptSuggestion = (idx: number, text: string) => {
    const nextBullets = [...bullets];
    nextBullets[idx] = text;
    form.setValue("bullets", nextBullets, { shouldValidate: true, shouldDirty: true });
    setImprovingIndex(null);
  };

  const handleRejectSuggestion = () => {
    setImprovingIndex(null);
  };

  const onSubmit = (values: ExperienceEntryFormType) => {
    // Clean up empty bullets
    values.bullets = values.bullets.filter((b) => b.trim() !== "");
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">
            {isEditing ? t("EditExperience") : t("AddExperience")}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("JobTitle")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("JobTitlePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Company")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("CompanyPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Location")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("LocationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2 space-y-1.5 flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <FormField
              control={form.control}
              name="start"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>{t("StartDate")}</FormLabel>
                  <FormControl>
                    <Input placeholder="Jan 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="end"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>{t("EndDate")}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={isCurrent ? t("Present") : "Dec 2024"} 
                      disabled={isCurrent}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="current"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer">
                {t("CurrentlyWorking")}
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="space-y-2 pt-4">
          <FormLabel>{t("KeyAchievements")}</FormLabel>


          <div className="space-y-3">
            {bullets.map((bullet, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground text-xs w-4 shrink-0 mt-2.5">•</span>
                  <Textarea
                    placeholder={t("BulletPlaceholder")}
                    value={bullet}
                    onChange={(e) => updateBullet(idx, e.target.value)}
                    className="flex-1 min-h-[60px] resize-none"
                  />
                  
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                      onClick={() => handleAIImprove(idx)}
                      disabled={isImproving || !bullet.trim() || (improvingIndex !== null && improvingIndex !== idx)}
                    >
                      {isImproving && improvingIndex === idx ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeBullet(idx)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {improvingIndex === idx && (
                  <InlineDiffPanel
                    originalText={originalText}
                    suggestedText={suggestedText}
                    onAccept={() => handleAcceptSuggestion(idx, suggestedText)}
                    onReject={handleRejectSuggestion}
                    isLoading={isImproving}
                  />
                )}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 text-xs gap-1 mt-1"
            onClick={addBullet}
          >
            <Plus className="w-3 h-3" />
            {t("AddBullet")}
          </Button>
        </div>

        <div className="flex gap-2 justify-end pt-6 border-t mt-6">
          <Button type="button" variant="ghost" onClick={onCancel}>
            {t("Cancel")}
          </Button>
          <Button type="submit">
            {t("SaveAndClose")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
