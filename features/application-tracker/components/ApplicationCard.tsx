"use client";

import { useTranslations } from "next-intl";
import { JobApplication } from "../types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Building2, MapPin, Calendar, ExternalLink, MoreVertical, Edit2, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { updateApplicationAction } from "../actions/tracker.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApplicationStage } from "../types";

const ALL_STAGES: ApplicationStage[] = [
  "saved", "applied", "in_review", "interviewing", "offer", "accepted", "rejected", "withdrawn"
];

interface ApplicationCardProps {
  application: JobApplication;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onViewAnalysis?: (id: string) => void;
}

const STAGE_COLORS: Record<string, string> = {
  saved: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  applied: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  in_review: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  interviewing: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  offer: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  accepted: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
  rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  withdrawn: "bg-slate-400/10 text-slate-400 border-slate-400/20",
};

export function ApplicationCard({ application, onEdit, onDelete, onViewAnalysis }: ApplicationCardProps) {
  const t = useTranslations("Dashboard.Tracker");
  const router = useRouter();
  const isTerminal = ["rejected", "withdrawn", "accepted"].includes(application.stage);

  const handleStageUpdate = async (newStage: ApplicationStage) => {
    if (newStage === application.stage) return;

    try {
      const res = await updateApplicationAction(application.application_id, { stage: newStage });
      if (res.success) {
        toast.success(t("statusUpdated") || "Status updated");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden transition-all duration-300",
      "border-border dark:border-white/20 bg-card/60 backdrop-blur-md",
      "hover:shadow-2xl hover:shadow-primary/15 hover:border-primary/50",
      isTerminal && "opacity-75 hover:opacity-100"
    )}>
      <CardContent className="px-5 pb-5 pt-3.5">
        <div className="flex items-center justify-between mb-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] uppercase tracking-wider font-bold cursor-pointer transition-all",
                  "active:scale-95 hover:opacity-80 focus:ring-2 focus:ring-primary/20",
                  STAGE_COLORS[application.stage]
                )}
              >
                {t(`stages.${application.stage}`)}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              {ALL_STAGES.map((s) => (
                <DropdownMenuItem
                  key={s}
                  onClick={() => handleStageUpdate(s)}
                  className={cn(
                    "text-xs capitalize",
                    application.stage === s && "bg-primary/10 font-medium text-primary"
                  )}
                >
                  {t(`stages.${s}`)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-1">
            {application.posting_url && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                <a href={application.posting_url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit(application)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  {t("editApplication")}
                </DropdownMenuItem>
                {application.analysis_id && (
                  <DropdownMenuItem onClick={() => onViewAnalysis?.(application.analysis_id!)}>
                    <FileText className="mr-2 h-4 w-4" />
                    {t("actions.viewAnalysis")}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() => onDelete(application.application_id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t("deleteApplication")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-2">
            {application.role_title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              <span>{application.company_name}</span>
            </div>
            {application.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>{application.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>{format(new Date(application.date), "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {application.notes && (
          <div className="mt-4 border-t pt-4">
            <p className="text-sm text-muted-foreground line-clamp-2 italic">
              "{application.notes}"
            </p>
          </div>
        )}
      </CardContent>

      {/* Visual Accent */}
      <div className={cn(
        "absolute inset-y-0 left-0 w-1",
        STAGE_COLORS[application.stage].split(' ')[1] // Extract text color class
      )} />
    </Card>
  );
}
