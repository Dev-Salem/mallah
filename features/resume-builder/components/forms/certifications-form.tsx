"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { z } from "zod";
import { certificationsSchema } from "@/features/resume-builder/types";
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
import { Plus, Trash2 } from "lucide-react";

const formSchema = z.object({
  entries: certificationsSchema,
});

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function CertificationsForm({ initialData, onChange, t }: Props) {
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
              <span className="text-sm font-medium text-muted-foreground">
                {t("CertificationEntry")} #{idx + 1}
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
                name={`entries.${idx}.name`}
                render={({ field: inputField }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>{t("CertificationName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("CertificationPlaceholder")} {...inputField} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`entries.${idx}.issuer`}
                render={({ field: inputField }) => (
                  <FormItem>
                    <FormLabel>{t("Issuer")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("IssuerPlaceholder")} {...inputField} />
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
                    <FormLabel>{t("Year")}</FormLabel>
                    <FormControl>
                      <Input placeholder="2023" {...inputField} />
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
          onClick={() => append({ id: crypto.randomUUID(), name: "", issuer: "", year: "" })}
        >
          <Plus className="w-4 h-4" />
          {t("AddCertification")}
        </Button>
      </form>
    </Form>
  );
}
