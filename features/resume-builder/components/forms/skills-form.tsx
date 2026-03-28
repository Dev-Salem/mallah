"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import {
  skillsSchema,
  SkillsForm as SkillsFormType,
} from "@/features/resume-builder/types";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, X } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface UserSkillItem {
  skill_id: string;
  level: string;
  skills: {
    skill_id: string;
    name: string;
    category: string;
  };
}

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
  userSkills?: UserSkillItem[];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function SkillsForm({
  initialData,
  onChange,
  t,
  userSkills = [],
}: Props) {
  const form = useForm<SkillsFormType>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      included_skill_ids: initialData?.included_skill_ids || [],
      manual_skills: initialData?.manual_skills || [],
    },
    mode: "onChange",
  });

  const [input, setInput] = useState("");
  const manualSkills = form.watch("manual_skills");
  const includedIds = form.watch("included_skill_ids");

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange({
        included_skill_ids: value.included_skill_ids || [],
        manual_skills: value.manual_skills || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  /* ── Checkbox grid grouped by category ──────────────────────────────────── */
  const groupedSkills = useMemo(() => {
    const groups: Record<string, UserSkillItem[]> = {};
    for (const us of userSkills) {
      const cat = us.skills?.category || "Other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(us);
    }
    return groups;
  }, [userSkills]);

  const toggleSkill = (skillId: string) => {
    const current = form.getValues("included_skill_ids");
    if (current.includes(skillId)) {
      form.setValue(
        "included_skill_ids",
        current.filter((id) => id !== skillId),
        { shouldValidate: true }
      );
    } else {
      form.setValue("included_skill_ids", [...current, skillId], {
        shouldValidate: true,
      });
    }
  };

  /* ── Manual skills ─────────────────────────────────────────────────────── */
  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || manualSkills.includes(trimmed)) return;
    form.setValue("manual_skills", [...manualSkills, trimmed], {
      shouldValidate: true,
    });
    setInput("");
  };

  const removeSkill = (skillToRemove: string) => {
    form.setValue(
      "manual_skills",
      manualSkills.filter((s) => s !== skillToRemove),
      { shouldValidate: true }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        {/* ── Checkbox grid from user_skills ─────────────────────────────── */}
        {Object.keys(groupedSkills).length > 0 && (
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Your verified skills — check to include on this resume:
            </p>
            {Object.entries(groupedSkills).map(([category, skills]) => (
              <div key={category}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  {category}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {skills.map((us) => {
                    const isChecked = includedIds.includes(us.skill_id);
                    return (
                      <label
                        key={us.skill_id}
                        className="flex items-center gap-2 px-3 py-2 rounded-md border cursor-pointer transition-colors hover:bg-muted/50 has-[[data-state=checked]]:border-primary/40 has-[[data-state=checked]]:bg-primary/5"
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSkill(us.skill_id)}
                        />
                        <span className="text-sm truncate">
                          {us.skills?.name || us.skill_id}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Manual skills ──────────────────────────────────────────────── */}
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="manual_skills"
            render={() => (
              <FormItem>
                <FormLabel>{t("AddSkills")}</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      placeholder={t("SkillPlaceholder")}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1"
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSkill}
                    disabled={!input.trim()}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {manualSkills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {manualSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1 pr-1 text-sm"
                >
                  {skill}
                  <span className="text-[10px] text-muted-foreground ml-0.5">
                    Manual
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
          {manualSkills.length === 0 &&
            Object.keys(groupedSkills).length === 0 && (
              <p className="text-sm text-muted-foreground">
                {t("NoSkillsYet")}
              </p>
            )}
        </div>
      </form>
    </Form>
  );
}
