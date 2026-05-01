"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { JobApplication, ApplicationStage } from "../types";
import { createApplicationAction, updateApplicationAction } from "../actions/tracker.actions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImportPanel } from "./ImportPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { OpportunityAnalysisResult } from "@/features/opportunity-analyzer/types";

interface ApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  application?: JobApplication | null;
  onSuccess: () => void;
}

const STAGES: ApplicationStage[] = [
  "saved", "applied", "in_review", "interviewing", "offer", "accepted", "rejected", "withdrawn"
];

export function ApplicationDrawer({ isOpen, onClose, application, onSuccess }: ApplicationDrawerProps) {
  const t = useTranslations("Dashboard.Tracker");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
  
  const [formData, setFormData] = useState({
    company_name: "",
    role_title: "",
    location: "",
    stage: "applied" as ApplicationStage,
    date: new Date().toISOString().split('T')[0],
    posting_url: "",
    notes: "",
    analysis_id: "" as string | undefined
  });

  useEffect(() => {
    if (application) {
      setFormData({
        company_name: application.company_name,
        role_title: application.role_title,
        location: application.location || "",
        stage: application.stage,
        date: application.date,
        posting_url: application.posting_url || "",
        notes: application.notes || "",
        analysis_id: application.analysis_id || undefined
      });
      setActiveTab("manual");
    } else {
      setFormData({
        company_name: "",
        role_title: "",
        location: "",
        stage: "applied",
        date: new Date().toISOString().split('T')[0],
        posting_url: "",
        notes: "",
        analysis_id: undefined
      });
    }
  }, [application, isOpen]);

  const handleImport = (analysis: OpportunityAnalysisResult) => {
    setFormData(prev => ({
      ...prev,
      company_name: analysis.company_name || prev.company_name,
      role_title: analysis.job_title || prev.role_title,
      location: analysis.location || prev.location,
      analysis_id: analysis.analysis_id,
    }));
    setActiveTab("manual");
    toast.success("Details imported from analysis");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (application) {
        const res = await updateApplicationAction(application.application_id, formData);
        if (res.success) {
          toast.success("Application updated successfully");
          onSuccess();
          onClose();
        } else {
          toast.error(res.error);
        }
      } else {
        const res = await createApplicationAction(formData);
        if (res.success) {
          toast.success("Application added successfully");
          onSuccess();
          onClose();
        } else {
          toast.error(res.error);
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle>{application ? t("editApplication") : t("addApplication")}</SheetTitle>
          <SheetDescription>
            {application ? "Modify application details and update progress." : "Track a new job opportunity in your pipeline."}
          </SheetDescription>
        </SheetHeader>

        {!application && (
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              <TabsTrigger value="import">Import Analysis</TabsTrigger>
            </TabsList>
            <TabsContent value="import" className="mt-4">
              <ImportPanel onSelect={handleImport} selectedId={formData.analysis_id} />
            </TabsContent>
            <TabsContent value="manual" className="mt-4">
               {/* Form will be here */}
            </TabsContent>
          </Tabs>
        )}

        { (activeTab === "manual" || !!application) && (
          <form onSubmit={handleSubmit} className="space-y-6 pb-20">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="company">{t("fields.company")}</Label>
                <Input
                  id="company"
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  placeholder="e.g. Google"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">{t("fields.role")}</Label>
                <Input
                  id="role"
                  value={formData.role_title}
                  onChange={(e) => setFormData({ ...formData, role_title: e.target.value })}
                  placeholder="e.g. Frontend Developer"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="location">{t("fields.location")}</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Riyadh"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">{t("fields.date")}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stage">{t("fields.stage")}</Label>
                <Select
                  value={formData.stage}
                  onValueChange={(v: ApplicationStage) => setFormData({ ...formData, stage: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {t(`stages.${s}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="url">{t("fields.url")}</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.posting_url}
                  onChange={(e) => setFormData({ ...formData, posting_url: e.target.value })}
                  placeholder="https://company.com/jobs/..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">{t("fields.notes")}</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder={t("fields.notesPlaceholder")}
                  rows={4}
                />
              </div>
            </div>

            <SheetFooter className="mt-8">
              <div className="flex w-full gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                  {t("actions.cancel")}
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? "Saving..." : t("actions.save")}
                </Button>
              </div>
            </SheetFooter>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
