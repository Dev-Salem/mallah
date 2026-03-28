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
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, X, Edit2 } from "lucide-react";
import EntryDrawer from "../editor/entry-drawer";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function ExperienceForm({ initialData, onChange, t }: Props) {
  const [entries, setEntries] = useState<any[]>(Array.isArray(initialData) ? initialData : []);
  
  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    onChange(entries);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

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
              <h4 className="font-semibold text-sm">{entry.title || "Untitled Role"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {entry.company || "Company"} • {entry.start} - {entry.current ? t("Present") : entry.end}
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
            No experience entries yet. Add your first role.
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
        {t("AddExperience")}
      </Button>

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <EntryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingIndex !== null ? "Edit Experience" : "Add Experience"}
      >
        <ExperienceSubForm
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

function ExperienceSubForm({ initialData, onSave, onCancel, t }: { initialData: any, onSave: (data: any) => void, onCancel: () => void, t: any }) {
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

  const onSubmit = (values: ExperienceEntryFormType) => {
    // Clean up empty bullets
    values.bullets = values.bullets.filter((b) => b.trim() !== "");
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          {bullets.map((bullet, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <span className="text-muted-foreground text-xs w-4 shrink-0">•</span>
              <Input
                placeholder={t("BulletPlaceholder")}
                value={bullet}
                onChange={(e) => updateBullet(idx, e.target.value)}
                className="flex-1"
              />
              {bullets.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 px-2 text-muted-foreground hover:text-destructive"
                  onClick={() => removeBullet(idx)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
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
