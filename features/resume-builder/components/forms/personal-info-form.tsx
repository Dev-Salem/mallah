"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { personalInfoSchema, PersonalInfoForm as PersonalInfoFormType } from "@/features/resume-builder/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface Props {
  initialData: any;
  onChange: (data: any) => void;
  t: any;
}

export default function PersonalInfoForm({ initialData, onChange, t }: Props) {
  const form = useForm<PersonalInfoFormType>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      phone: initialData?.phone || "",
      linkedin: initialData?.linkedin || "",
      github: initialData?.github || "",
      portfolio: initialData?.portfolio || "",
      location: initialData?.location || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      onChange(value);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onChange]);

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Phone")}</FormLabel>
              <FormControl>
                <Input placeholder="+966 5XX XXX XXXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("Location")}</FormLabel>
              <FormControl>
                <Input placeholder="Riyadh, Saudi Arabia" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="linkedin.com/in/yourname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="github"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub</FormLabel>
              <FormControl>
                <Input placeholder="github.com/yourname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="portfolio"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>{t("Portfolio")}</FormLabel>
              <FormControl>
                <Input placeholder="yourportfolio.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
