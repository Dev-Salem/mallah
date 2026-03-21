"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { projectsSchema } from "@/features/resume-builder/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  entries: projectsSchema,
});

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function ProjectsForm({ initialData, onChange, t }: Props) {
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

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value.entries || []);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        {fields.map((field, idx) => (
          <div
            key={field.id}
            className="border rounded-lg p-4 space-y-3 bg-muted/20"
          >
            <div className="flex justify-between items-start">
              <FormField
                control={form.control}
                name={`entries.${idx}.included`}
                render={({ field: checkboxField }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={checkboxField.value}
                        onCheckedChange={checkboxField.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                      {t("Project")} #{idx + 1}
                    </FormLabel>
                  </FormItem>
                )}
              />
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
            
            <FormField
              control={form.control}
              name={`entries.${idx}.description_override`}
              render={({ field: textAreaField }) => (
                <FormItem>
                  <FormLabel>{t("ProjectDescription")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("ProjectDescPlaceholder")}
                      className="min-h-[80px] resize-none"
                      {...textAreaField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`entries.${idx}.github_override`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>GitHub URL</FormLabel>
                    <FormControl>
                      <Input placeholder="github.com/user/project" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`entries.${idx}.demo_override`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="project-demo.vercel.app" {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2"
          onClick={() => append({ project_id: crypto.randomUUID(), included: true, description_override: "", github_override: "", demo_override: "" })}
        >
          <Plus className="w-4 h-4" />
          {t("AddProject")}
        </Button>
      </form>
    </Form>
  );
}
