"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";
import { projectEntrySchema } from "@/features/resume-builder/types";
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
import { Plus, Trash2, Edit2, X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type ProjectEntryFormType = z.infer<typeof projectEntrySchema>;

interface Props {
  initialData: ProjectEntryFormType[];
  onChange: (data: ProjectEntryFormType[]) => void;
  t: any;
}

export default function ProjectsForm({ initialData, onChange, t }: Props) {
  const [entries, setEntries] = useState<ProjectEntryFormType[]>(
    Array.isArray(initialData) ? initialData : []
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSaveEntry = (data: ProjectEntryFormType) => {
    let next: ProjectEntryFormType[];
    if (editingIndex !== null) {
      next = [...entries];
      next[editingIndex] = data;
      setEditingIndex(null);
    } else {
      next = [...entries, data];
      setIsAdding(false);
    }
    setEntries(next);
    onChange(next);
  };

  const handleEdit = (idx: number) => {
    setEditingIndex(idx);
    setIsAdding(false);
  };

  const handleDelete = (idx: number) => {
    const next = entries.filter((_, i) => i !== idx);
    setEntries(next);
    onChange(next);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setIsAdding(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {entries.map((entry, idx) => (
          <div key={entry.id || idx}>
            {editingIndex === idx ? (
              <div className="border rounded-lg p-4 bg-muted/10 shadow-sm animate-in fade-in duration-300">
                <ProjectSubForm
                  initialData={entry}
                  onSave={handleSaveEntry}
                  onCancel={handleCancel}
                  t={t}
                  isEditing
                />
              </div>
            ) : (
              <div className="flex items-center justify-between border rounded-md p-3 bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm truncate">{entry.title || t("Project")}</h4>
                    {!entry.included && <Badge variant="secondary" className="text-[10px] h-4">Hidden</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {entry.startDate || ""} {entry.startDate && (entry.endDate || entry.current) ? "-" : ""} {entry.current ? t("ProjectOngoing") : entry.endDate || ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground"
                    onClick={() => handleEdit(idx)}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDelete(idx)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isAdding ? (
          <div className="border rounded-lg p-4 bg-muted/10 shadow-sm animate-in zoom-in-95 duration-200">
            <ProjectSubForm
              initialData={{ id: crypto.randomUUID(), title: "", included: true, bullets: [""], technologies: [] }}
              onSave={handleSaveEntry}
              onCancel={handleCancel}
              t={t}
            />
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2 border-dashed h-12"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
            {t("AddProject")}
          </Button>
        )}
      </div>
    </div>
  );
}

function ProjectSubForm({
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
  const form = useForm<any>({
    resolver: zodResolver(projectEntrySchema),
    defaultValues: {
      id: initialData?.id || "",
      project_id: initialData?.project_id || "",
      included: initialData?.included ?? true,
      title: initialData?.title || "",
      description: initialData?.description || "",
      github: initialData?.github || "",
      demo: initialData?.demo || "",
      startDate: initialData?.startDate || "",
      endDate: initialData?.endDate || "",
      current: initialData?.current || false,
      bullets: (initialData?.bullets && initialData.bullets.length > 0) ? initialData.bullets : [""],
      technologies: initialData?.technologies || [],
    },
  });

  const bullets = form.watch("bullets") || [""];
  const isOngoing = form.watch("current");

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

  const onSubmit = (values: ProjectEntryFormType) => {
    values.bullets = (values.bullets || []).filter((b) => b.trim() !== "");
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {isEditing ? t("Project") : t("AddProject")}
          </h3>
          <FormField
            control={form.control}
            name="included"
            render={({ field }) => (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="project-included"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <label htmlFor="project-included" className="text-xs font-medium cursor-pointer">
                  Included in Resume
                </label>
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("ProjectName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("ProjectNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ProjectStartDate")}</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Jan 2024" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("ProjectEndDate")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="e.g. Present" 
                    disabled={isOngoing}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="current"
            render={({ field }) => (
              <FormItem className="sm:col-span-2 flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) form.setValue("endDate", "");
                    }}
                  />
                </FormControl>
                <FormLabel className="text-xs font-normal">
                  {t("ProjectOngoing")}
                </FormLabel>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="github.com/..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="demo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Demo</FormLabel>
                <FormControl>
                  <Input placeholder="demo.vercel.app" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="technologies"
            render={({ field: techField }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("ProjectTechnologies")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("ProjectTechnologiesPlaceholder")}
                    value={(techField.value || []).join(", ")}
                    onChange={(e) => {
                      const tags = e.target.value.split(",").map(t => t.trim());
                      techField.onChange(tags);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="sm:col-span-2 space-y-2">
            <FormLabel>{t("ProjectBullets")}</FormLabel>
            {bullets.map((bullet: string, bIdx: number) => (
              <div key={bIdx} className="flex gap-2">
                <Textarea
                  placeholder={t("ProjectBulletPlaceholder")}
                  value={bullet}
                  onChange={(e) => updateBullet(bIdx, e.target.value)}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 text-destructive shrink-0 self-start"
                  onClick={() => removeBullet(bIdx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full gap-2 text-xs border-dashed"
              onClick={addBullet}
            >
              <Plus className="w-3 h-3" />
              {t("ProjectAddBullet")}
            </Button>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            {t("Cancel")}
          </Button>
          <Button type="submit" size="sm" className="gap-2">
            <Check className="w-3.5 h-3.5" />
            {t("SaveAndClose")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
