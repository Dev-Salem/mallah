"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { certificationEntrySchema, CertificationEntryForm as CertificationEntryFormType } from "@/features/resume-builder/types";
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
import { Plus, Trash2, Edit2 } from "lucide-react";
import EntryDrawer from "../editor/entry-drawer";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function CertificationsForm({ initialData, onChange, t }: Props) {
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
              <h4 className="font-semibold text-sm">{entry.name || "Untitled Certification"}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                {entry.issuer || "Issuer"} • {entry.year}
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
            No certifications yet. Add your first certificate.
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
        {t("AddCertification")}
      </Button>

      {/* ── Drawer ────────────────────────────────────────────────── */}
      <EntryDrawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        title={editingIndex !== null ? "Edit Certification" : "Add Certification"}
      >
        <CertificationSubForm
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

function CertificationSubForm({ initialData, onSave, onCancel, t }: { initialData: any, onSave: (data: any) => void, onCancel: () => void, t: any }) {
  const form = useForm<CertificationEntryFormType>({
    resolver: zodResolver(certificationEntrySchema),
    defaultValues: {
      id: initialData?.id || "",
      name: initialData?.name || "",
      issuer: initialData?.issuer || "",
      year: initialData?.year || "",
    },
  });

  const onSubmit = (values: CertificationEntryFormType) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>{t("CertificationName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("CertificationPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("Issuer")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("IssuerPlaceholder")} {...field} />
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
                <FormLabel>{t("Year")}</FormLabel>
                <FormControl>
                  <Input placeholder="2023" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
