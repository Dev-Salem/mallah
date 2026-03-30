"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { educationEntrySchema, EducationEntryForm as EducationEntryFormType } from "@/features/resume-builder/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Edit2 } from "lucide-react";
interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function EducationForm({ initialData, onChange, t }: Props) {
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
                <EducationSubForm
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
                  <h4 className="font-semibold text-sm truncate">{entry.degree || t("UntitledDegree")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {entry.institution || t("Institution")} • {entry.year}
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
            <EducationSubForm
              initialData={null}
              onSave={handleSaveEntry}
              onCancel={handleCancel}
              t={t}
            />
          </div>
        )}

        {entries.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            {t("NoEducationYet")}
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
          {t("AddEducation")}
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-Form for Drawer                                                       */
/* -------------------------------------------------------------------------- */

function EducationSubForm({ 
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
  const form = useForm<EducationEntryFormType>({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: {
      id: initialData?.id || "",
      degree: initialData?.degree || "",
      institution: initialData?.institution || "",
      field: initialData?.field || "",
      year: initialData?.year || "",
      in_progress: initialData?.in_progress || false,
    },
  });

  const inProgress = form.watch("in_progress");

  const onSubmit = (values: EducationEntryFormType) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">
            {isEditing ? t("EditEducation") : t("AddEducation")}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="degree"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("DegreeTitle")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("DegreePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="institution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Institution")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("InstitutionPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("FieldOfStudy")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("FieldOfStudyPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("GraduationYear")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={inProgress ? t("ExpectedYear") : "2024"} 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="in_progress"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="text-sm font-normal cursor-pointer">
                {t("InProgress")}
              </FormLabel>
            </FormItem>
          )}
        />

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
