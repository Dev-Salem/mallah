import { z } from "zod";

// ─── Step Enums ───

export const BACKGROUND_TYPES = ["student", "fresh_grad", "career_shifter", "no_tech"] as const;
export const PRIMARY_GOALS = ["job", "freelance", "startup", "exploring"] as const;
export const WEEKLY_HOURS = ["0-3", "4-7", "8-12", "13+"] as const;
export const LEARNING_VELOCITIES = ["slow", "normal", "fast"] as const;
export const AI_LANGUAGES = ["arabic", "english", "mix"] as const;
export const AI_DETAIL_LEVELS = ["short", "balanced", "detailed"] as const;
export const CONFIDENCE_LEVELS = ["never", "tried", "comfortable"] as const;
export const PATH_IDS = ["frontend", "fullstack", "cybersecurity", "datascience"] as const;

// ─── Zod Schemas ───

export const stepIdentitySchema = z.object({
  backgroundType: z.enum(BACKGROUND_TYPES),
});

export const stepGoalSchema = z.object({
  primaryGoal: z.enum(PRIMARY_GOALS),
});

export const stepCommitmentSchema = z.object({
  weeklyHoursCategory: z.enum(WEEKLY_HOURS),
});

export const stepInterestsSchema = z.object({
  interests: z.array(z.string()).min(0),
});

export const confidenceItemSchema = z.object({
  key: z.string(),
  level: z.enum(CONFIDENCE_LEVELS),
});

export const stepConfidenceSchema = z.object({
  confidenceItems: z.array(confidenceItemSchema).length(4),
});

export const stepPreferencesSchema = z.object({
  aiLanguagePref: z.enum(AI_LANGUAGES),
  aiDetailLevel: z.enum(AI_DETAIL_LEVELS),
});

export const onboardingFormDataSchema = z.object({
  backgroundType: z.enum(BACKGROUND_TYPES),
  primaryGoal: z.enum(PRIMARY_GOALS),
  weeklyHoursCategory: z.enum(WEEKLY_HOURS),
  interests: z.array(z.string()),
  confidenceItems: z.array(confidenceItemSchema).length(4),
  aiLanguagePref: z.enum(AI_LANGUAGES),
  aiDetailLevel: z.enum(AI_DETAIL_LEVELS),
});

// ─── Types ───

export type BackgroundType = (typeof BACKGROUND_TYPES)[number];
export type PrimaryGoal = (typeof PRIMARY_GOALS)[number];
export type WeeklyHours = (typeof WEEKLY_HOURS)[number];
export type LearningVelocity = (typeof LEARNING_VELOCITIES)[number];
export type AILanguage = (typeof AI_LANGUAGES)[number];
export type AIDetailLevel = (typeof AI_DETAIL_LEVELS)[number];
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
export type PathId = (typeof PATH_IDS)[number];

export type ConfidenceItem = z.infer<typeof confidenceItemSchema>;
export type OnboardingFormData = z.infer<typeof onboardingFormDataSchema>;

export const onboardingDraftSchema = onboardingFormDataSchema.partial().extend({
  currentStep: z.string().optional(),
});

export type OnboardingDraft = z.infer<typeof onboardingDraftSchema>;

export interface InterestSignal {
  id: string;
  statement: string;
  pathWeights: Record<PathId, number>;
}

export interface InterestVector {
  frontend: number;
  fullstack: number;
  cybersecurity: number;
  datascience: number;
}

export interface AIRecommendationResponse {
  recommended_path_id: PathId;
  match_score: number;
  reasons: string[];
  alternatives: Array<{
    path_id: PathId;
    reason: string;
  }>;
}

export interface OnboardingResult {
  onboardingId: string;
  recommendation: AIRecommendationResponse | null;
}

// ─── Wizard Step Index ───

export type WizardStep =
  | "intro"
  | "identity"
  | "goal"
  | "commitment"
  | "interests"
  | "confidence"
  | "preferences"
  | "loading"
  | "recommendation"
  | "manual-selection";

export const WIZARD_STEPS: WizardStep[] = [
  "intro",
  "identity",
  "goal",
  "commitment",
  "interests",
  "confidence",
  "preferences",
  "loading",
  "recommendation",
];
