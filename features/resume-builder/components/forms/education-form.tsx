"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { educationSchema } from "@/features/resume-builder/types";
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
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  entries: educationSchema,
});

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function EducationForm({ initialData, onChange, t }: Props) {
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

  return (
    <Form {...form}>
      <form className="space-y-4">
        {fields.map((field, idx) => {
          const inProgress = watchEntries[idx]?.in_progress;
          
          return (
            <div
              key={field.id}
              className="border rounded-lg p-4 space-y-3 bg-muted/20"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-muted-foreground">
                  {t("EducationEntry")} #{idx + 1}
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
                  name={`entries.${idx}.degree`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("DegreeTitle")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("DegreePlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${idx}.institution`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("Institution")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("InstitutionPlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${idx}.field`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("FieldOfStudy")}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("FieldOfStudyPlaceholder")} {...inputField} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`entries.${idx}.year`}
                  render={({ field: inputField }) => (
                    <FormItem>
                      <FormLabel>{t("GraduationYear")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={inProgress ? t("ExpectedYear") : "2024"} 
                          {...inputField} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name={`entries.${idx}.in_progress`}
                render={({ field: checkboxField }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 mt-2">
                    <FormControl>
                      <Checkbox
                        checked={checkboxField.value}
                        onCheckedChange={checkboxField.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      {t("InProgress")}
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>
          );
        })}

        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => append({ id: crypto.randomUUID(), degree: "", institution: "", field: "", year: "", in_progress: false })}
        >
          <Plus className="w-4 h-4" />
          {t("AddEducation")}
        </Button>
      </form>
    </Form>
  );
}
