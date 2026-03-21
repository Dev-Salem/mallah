"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { skillsSchema, SkillsForm as SkillsFormType } from "@/features/resume-builder/types";
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
import { Plus, X } from "lucide-react";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function SkillsForm({ initialData, onChange, t }: Props) {
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

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange({
         included_skill_ids: value.included_skill_ids || [],
         manual_skills: value.manual_skills || [],
      });
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  const addSkill = () => {
    const trimmed = input.trim();
    if (!trimmed || manualSkills.includes(trimmed)) return;
    form.setValue("manual_skills", [...manualSkills, trimmed], { shouldValidate: true });
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
      <form className="space-y-3">
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
        {manualSkills.length === 0 && (
          <p className="text-sm text-muted-foreground">{t("NoSkillsYet")}</p>
        )}
      </form>
    </Form>
  );
}
