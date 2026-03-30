"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import {
  skillsSchema,
  SkillsForm as SkillsFormType,
  ManualSkillGroup,
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
  const [group, setGroup] = useState("");
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch]);

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
    const trimmedInput = input.trim();
    const trimmedGroup = group.trim();
    if (!trimmedInput) return;

    const currentManual = form.getValues("manual_skills");

    if (trimmedGroup) {
      const existingGroupIdx = currentManual.findIndex(
        (s) =>
          typeof s === "object" &&
          s.name.toLowerCase() === trimmedGroup.toLowerCase()
      );

      if (existingGroupIdx > -1) {
        const existingGroup = currentManual[
          existingGroupIdx
        ] as ManualSkillGroup;
        if (!existingGroup.skills.includes(trimmedInput)) {
          const updatedManual = [...currentManual];
          updatedManual[existingGroupIdx] = {
            ...existingGroup,
            skills: [...existingGroup.skills, trimmedInput],
          };
          form.setValue("manual_skills", updatedManual, {
            shouldValidate: true,
          });
        }
      } else {
        form.setValue(
          "manual_skills",
          [...currentManual, { name: trimmedGroup, skills: [trimmedInput] }],
          {
            shouldValidate: true,
          }
        );
      }
    } else {
      if (!currentManual.some((s) => s === trimmedInput)) {
        form.setValue("manual_skills", [...currentManual, trimmedInput], {
          shouldValidate: true,
        });
      }
    }
    setInput("");
  };

  const removeItem = (index: number) => {
    const current = form.getValues("manual_skills");
    form.setValue(
      "manual_skills",
      current.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const removeSkillFromGroup = (groupIdx: number, skillName: string) => {
    const current = form.getValues("manual_skills");
    const target = current[groupIdx];
    if (typeof target === "object") {
      const updatedSkills = target.skills.filter((s) => s !== skillName);
      const updatedManual = [...current];
      if (updatedSkills.length === 0) {
        updatedManual.splice(groupIdx, 1);
      } else {
        updatedManual[groupIdx] = { ...target, skills: updatedSkills };
      }
      form.setValue("manual_skills", updatedManual, { shouldValidate: true });
    }
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
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Category (e.g. Frameworks)"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="w-1/3"
                    />
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
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {manualSkills.length > 0 && (
            <div className="flex flex-col gap-3 pt-1">
              {manualSkills.map((item, idx) => {
                if (typeof item === "string") {
                  return (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="gap-1 pr-1 text-sm self-start"
                    >
                      {item}
                      <span className="text-[10px] text-muted-foreground ml-0.5">
                        Manual
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  );
                }

                return (
                  <div
                    key={idx}
                    className="border rounded-md p-3 bg-muted/20 relative group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {item.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-destructive/10 rounded"
                      >
                        <X className="w-3 h-3 text-destructive" />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="gap-1 pr-1 text-xs"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkillFromGroup(idx, skill)}
                            className="ml-1 rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
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
