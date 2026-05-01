"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { JobApplication } from "../types";
import { ApplicationList } from "./ApplicationList";
import { ApplicationDrawer } from "./ApplicationDrawer";
import { deleteApplicationAction } from "../actions/tracker.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TrackerContainerProps {
  initialApplications: JobApplication[];
}

export function TrackerContainer({ initialApplications }: TrackerContainerProps) {
  const t = useTranslations("Dashboard.Tracker");
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null);

  const handleAdd = useCallback(() => {
    setEditingApp(null);
    setIsDrawerOpen(true);
  }, []);

  const handleEdit = useCallback((app: JobApplication) => {
    setEditingApp(app);
    setIsDrawerOpen(true);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm(t("deleteConfirm"))) return;
    
    try {
      const res = await deleteApplicationAction(id);
      if (res.success) {
        toast.success("Application deleted");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  }, [t, router]);

  const handleSuccess = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">
          Manage your job applications and track your progress in the professional market.
        </p>
      </div>

      <ApplicationList
        initialApplications={initialApplications}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <ApplicationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        application={editingApp}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
