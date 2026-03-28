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
import EntryDrawer from "../editor/entry-drawer";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function EducationForm({ initialData, onChange, t }: Props) {
  const [entries, setEntries] = useState<any[]>(Array.isArray(initialData) ? initialData : []);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    onChange(entries);
  }, [entries, onChange]);

  const handleAdd = () => {
    setEditingIndex(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setIsDrawerOpen(true);
  };

  const handleDelete = (idx: number) => {
    const next = [...entries];
    next.splice(idx, 1);
    setEntries(next);
  };

  const handleSaveEntry = (data: any) => {
    const next = [...entries];
    if (editingIndex !== null) {
      next[editingIndex] = data;
    } else {
      next.push({ ...data, id: crypto.randomUUID() });
    }
    setEntries(next);
    setIsDrawerOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* ── List View ────────────────────────────────────────────── */}
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div
            key={entry.id || idx}
            className="flex items-center justify-between border rounded-md p-3 bg-muted/20 hover:bg-muted/40 transition-colors"
          >
            <div>
              <h4 className="font-semibold text-sm">{entry.degree || "Untitled Degree"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {entry.institution || "Institution"} • {entry.year}
              </p>
            </div>
            <div className="flex items-center gap-1">
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
        ))}

        {entries.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            No education entries yet. Add your degree.
          </p>
        )}
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full gap-2"
        onClick={handleAdd}
      >
        <Plus className="w-4 h-4" />
        {t("AddEducation")}
      </Button>

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <EntryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingIndex !== null ? "Edit Education" : "Add Education"}
      >
        <EducationSubForm
          initialData={editingIndex !== null ? entries[editingIndex] : null}
          onSave={handleSaveEntry}
          onCancel={() => setIsDrawerOpen(false)}
          t={t}
        />
      </EntryDrawer>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Sub-Form for Drawer                                                       */
/* -------------------------------------------------------------------------- */

function EducationSubForm({ initialData, onSave, onCancel, t }: { initialData: any, onSave: (data: any) => void, onCancel: () => void, t: any }) {
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
            Cancel
          </Button>
          <Button type="submit">
            Save & Close
          </Button>
        </div>
      </form>
    </Form>
  );
}
