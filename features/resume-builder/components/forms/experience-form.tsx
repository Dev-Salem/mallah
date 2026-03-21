"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { experienceSchema } from "@/features/resume-builder/types";
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
import { Plus, Trash2, X } from "lucide-react";

const formSchema = z.object({
  entries: experienceSchema,
});

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function ExperienceForm({ initialData, onChange, t }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      entries: Array.isArray(initialData) ? initialData : [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "entries",
  });

  const watchEntries = form.watch("entries");

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value.entries || []);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  const updateBullet = (entryIdx: number, bulletIdx: number, value: string) => {
    const bullets = [...(watchEntries[entryIdx]?.bullets || [])];
    bullets[bulletIdx] = value;
    form.setValue(`entries.${entryIdx}.bullets`, bullets, { shouldValidate: true });
  };

  const addBullet = (entryIdx: number) => {
    const bullets = [...(watchEntries[entryIdx]?.bullets || [])];
    form.setValue(`entries.${entryIdx}.bullets`, [...bullets, ""], { shouldValidate: true });
  };

  const removeBullet = (entryIdx: number, bulletIdx: number) => {
    const bullets = [...(watchEntries[entryIdx]?.bullets || [])];
    bullets.splice(bulletIdx, 1);
    form.setValue(`entries.${entryIdx}.bullets`, bullets, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        {fields.map((field, idx) => {
          const isCurrent = watchEntries[idx]?.current;
          const bullets = watchEntries[idx]?.bullets || [""];

          return (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-muted/20"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("ExperienceEntry")} #{idx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-destructive hover:text-destructive"
                  onClick={() => remove(idx)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name={`entries.${idx}.title`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("JobTitle")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("JobTitlePlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${idx}.company`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("Company")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("CompanyPlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${idx}.location`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("Location")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("LocationPlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-1.5 flex items-end gap-3">
                  <FormField
                    control={form.control}
                    name={`entries.${idx}.start`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("StartDate")}</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan 2024" {...inputField} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`entries.${idx}.end`}
                    render={({ field: inputField }) => (
                      <FormItem className="flex-1">
                        <FormLabel>{t("EndDate")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder={isCurrent ? t("Present") : "Dec 2024"} 
                            disabled={isCurrent}
                            {...inputField} 
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
                name={`entries.${idx}.current`}
                render={({ field: checkboxField }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={checkboxField.value}
                        onCheckedChange={checkboxField.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t("CurrentlyWorking")}
                    </FormLabel>
                  </FormItem>
                )}
              />

              <div className="space-y-2 mt-4">
                <FormLabel>{t("KeyAchievements")}</FormLabel>
                {bullets.map((bullet: string, bIdx: number) => (
                  <div key={bIdx} className="flex gap-2 items-center">
                    <span className="text-muted-foreground text-xs w-4 shrink-0">•</span>
                    <Input
                      placeholder={t("BulletPlaceholder")}
                      value={bullet}
                      onChange={(e) => updateBullet(idx, bIdx, e.target.value)}
                      className="flex-1"
                    />
                    {bullets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-1 text-muted-foreground"
                        onClick={() => removeBullet(idx, bIdx)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  onClick={() => addBullet(idx)}
                >
                  <Plus className="w-3 h-3" />
                  {t("AddBullet")}
                </Button>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => append({ id: crypto.randomUUID(), title: "", company: "", location: "", start: "", end: "", current: false, bullets: [""] })}
        >
          <Plus className="w-4 h-4" />
          {t("AddExperience")}
        </Button>
      </form>
    </Form>
  );
}
