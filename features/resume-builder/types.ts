import { z } from "zod";

export type ResumeType = "general" | "job_based";

export interface SourceJDShape {
  job_title: string;
  company_name: string;
  required_skills: string[];
  preferred_skills: string[];
  analysis_id?: string | null;
}

export const personalInfoSchema = z.object({
  phone: z.string().optional().default(""),
  linkedin: z.string().optional().default(""),
  github: z.string().optional().default(""),
  portfolio: z.string().optional().default(""),
  location: z.string().optional().default(""),
});
export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export const summarySchema = z.object({
  text: z.string().max(1000).optional().default(""),
});
export type SummaryForm = z.infer<typeof summarySchema>;

export const skillsSchema = z.object({
  included_skill_ids: z.array(z.string()).default([]),
  manual_skills: z.array(z.string()).default([]),
});
export type SkillsForm = z.infer<typeof skillsSchema>;

export const projectEntrySchema = z.object({
  project_id: z.string(),
  included: z.boolean().default(true),
  description_override: z.string().optional().default(""),
  github_override: z.string().optional().default(""),
  demo_override: z.string().optional().default(""),
});
export const projectsSchema = z.array(projectEntrySchema).default([]);
export type ProjectsForm = z.infer<typeof projectsSchema>;
export type ProjectEntryForm = z.infer<typeof projectEntrySchema>;

export const experienceEntrySchema = z.object({
  id: z.string().optional(), // For internal form array mapping
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string().optional().default(""),
  start: z.string().optional().default(""),
  end: z.string().optional().default(""),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([""]),
});
export const experienceSchema = z.array(experienceEntrySchema).default([]);
export type ExperienceForm = z.infer<typeof experienceSchema>;
export type ExperienceEntryForm = z.infer<typeof experienceEntrySchema>;

export const educationEntrySchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree name is required"),
  institution: z.string().min(1, "Institution is required"),
  field: z.string().optional().default(""),
  year: z.string().optional().default(""),
  in_progress: z.boolean().default(false),
});
export const educationSchema = z.array(educationEntrySchema).default([]);
export type EducationForm = z.infer<typeof educationSchema>;
export type EducationEntryForm = z.infer<typeof educationEntrySchema>;

export const certificationEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  year: z.string().optional().default(""),
});
export const certificationsSchema = z.array(certificationEntrySchema).default([]);
export type CertificationsForm = z.infer<typeof certificationsSchema>;
export type CertificationEntryForm = z.infer<typeof certificationEntrySchema>;
