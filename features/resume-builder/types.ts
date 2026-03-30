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
  full_name: z.string(),
  phone: z.string(),
  linkedin: z.string(),
  github: z.string(),
  portfolio: z.string(),
  location: z.string(),
});
export type PersonalInfoForm = z.infer<typeof personalInfoSchema>;

export const summarySchema = z.object({
  text: z.string().max(1000),
});
export type SummaryForm = z.infer<typeof summarySchema>;

export const manualSkillGroupSchema = z.object({
  name: z.string(),
  skills: z.array(z.string()),
});

export const skillsSchema = z.object({
  included_skill_ids: z.array(z.string()),
  manual_skills: z.array(z.union([z.string(), manualSkillGroupSchema])),
});
export type SkillsForm = z.infer<typeof skillsSchema>;
export type ManualSkillGroup = z.infer<typeof manualSkillGroupSchema>;

export const projectEntrySchema = z.object({
  project_id: z.string(),
  included: z.boolean(),
  description_override: z.string(),
  github_override: z.string(),
  demo_override: z.string(),
});
export const projectsSchema = z.array(projectEntrySchema);
export type ProjectsForm = z.infer<typeof projectsSchema>;
export type ProjectEntryForm = z.infer<typeof projectEntrySchema>;

export const experienceEntrySchema = z.object({
  id: z.string().optional(), // For internal form array mapping
  title: z.string().min(1, "Job title is required"),
  company: z.string().min(1, "Company name is required"),
  location: z.string(),
  start: z.string(),
  end: z.string(),
  current: z.boolean(),
  bullets: z.array(z.string()),
});
export const experienceSchema = z.array(experienceEntrySchema);
export type ExperienceForm = z.infer<typeof experienceSchema>;
export type ExperienceEntryForm = z.infer<typeof experienceEntrySchema>;

export const educationEntrySchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, "Degree name is required"),
  institution: z.string().min(1, "Institution is required"),
  field: z.string(),
  year: z.string(),
  in_progress: z.boolean(),
});
export const educationSchema = z.array(educationEntrySchema);
export type EducationForm = z.infer<typeof educationSchema>;
export type EducationEntryForm = z.infer<typeof educationEntrySchema>;

export const certificationEntrySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Certification name is required"),
  issuer: z.string().min(1, "Issuing organization is required"),
  year: z.string(),
});
export const certificationsSchema = z.array(certificationEntrySchema);
export type CertificationsForm = z.infer<typeof certificationsSchema>;
export type CertificationEntryForm = z.infer<typeof certificationEntrySchema>;
