"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { JobApplication, ApplicationStage } from "../types";
import { ApplicationCard } from "./ApplicationCard";
import { StageFilters } from "./StageFilters";
import { Input } from "@/components/ui/input";
import { Search, ListFilter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ApplicationListProps {
  initialApplications: JobApplication[];
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function ApplicationList({ initialApplications, onEdit, onDelete, onAdd }: ApplicationListProps) {
  const t = useTranslations("Dashboard.Tracker");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<ApplicationStage | "all">("all");
  const [sortBy, setSortBy] = useState("newest");

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: initialApplications.length };
    initialApplications.forEach(app => {
      map[app.stage] = (map[app.stage] || 0) + 1;
    });
    return map;
  }, [initialApplications]);

  const filtered = useMemo(() => {
    return initialApplications
      .filter(app => {
        const matchesSearch = 
          app.company_name.toLowerCase().includes(search.toLowerCase()) ||
          app.role_title.toLowerCase().includes(search.toLowerCase());
        const matchesStage = stage === "all" || app.stage === stage;
        return matchesSearch && matchesStage;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime();
        if (sortBy === "stage") return a.stage.localeCompare(b.stage);
        return 0;
      });
  }, [initialApplications, search, stage, sortBy]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            className="pl-9 bg-background/50 border-muted-foreground/20 focus:bg-background transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] bg-background/50">
              <ListFilter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t("sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{t("sortOptions.newest")}</SelectItem>
              <SelectItem value="oldest">{t("sortOptions.oldest")}</SelectItem>
              <SelectItem value="stage">{t("sortOptions.stage")}</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t("addApplication")}</span>
          </Button>
        </div>
      </div>

      <StageFilters 
        selectedStage={stage} 
        onStageChange={setStage} 
        counts={counts} 
      />

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map(app => (
            <ApplicationCard 
              key={app.application_id} 
              application={app} 
              onEdit={onEdit} 
              onDelete={onDelete} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center mb-6">
            <Search className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {stage === "all" ? t("empty.title") : t("empty.filterTitle", { stage: t(`stages.${stage}`) })}
          </h3>
          <p className="text-muted-foreground max-w-sm mx-auto mb-8">
            {stage === "all" ? t("empty.description") : t("empty.filterDescription")}
          </p>
          {stage === "all" && (
            <Button onClick={onAdd} variant="outline" className="border-dashed">
              <Plus className="h-4 w-4 mr-2" />
              {t("addApplication")}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
