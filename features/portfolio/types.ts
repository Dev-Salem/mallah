import { z } from 'zod/v4';

// ─── Skill types ───
export interface PortfolioSkill {
    skill_id: string;
    name: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    source: 'roadmap' | 'project' | 'manual';
    is_public: boolean;
    linked_projects?: string[]; // project titles that demonstrate this skill
}

// ─── Project types ───
export interface PortfolioProject {
    project_id: string;
    title: string;
    description: string | null;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
    source_type: 'roadmap' | 'user_custom';
    status: 'available' | 'in_progress' | 'completed';
    is_public: boolean;
    github_url: string | null;
    demo_url: string | null;
    personal_note: string | null;
    thumbnail_url: string | null; // resolved: user override → project default → null
    tech_stack: string[];
    completed_at: string | null;
    started_at: string | null;
    bullets: string[];
    skills: { skill_id: string; name: string; category: string }[];
}

// ─── Header profile ───
export interface PortfolioProfile {
    user_id: string;
    first_name: string;
    last_name: string;
    bio: string | null;
    portfolio_slug: string | null;
    current_path_id: string | null;
    path_name: string | null;
    primary_goal: string | null;
    skills_count: number;
    projects_completed_count: number;
}

// ─── Full portfolio data bundle ───
export interface PortfolioData {
    profile: PortfolioProfile;
    skills: PortfolioSkill[];
    projects: PortfolioProject[];
}

// ─── Zod schemas for mutations ───
export const addManualSkillSchema = z.object({
    skill_id: z.string().min(1),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
});

export type AddManualSkillInput = z.infer<typeof addManualSkillSchema>;

export const addExternalProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(300),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    github_url: z.url().optional().or(z.literal('')),
    demo_url: z.url().optional().or(z.literal('')),
    tech_stack: z.array(z.string()).optional(),
    skill_ids: z.array(z.string()).optional(),
    status: z.enum(['in_progress', 'completed']),
    started_at: z.string().optional(),
    bullets: z.array(z.string()).optional(),
});

export type AddExternalProjectInput = z.infer<typeof addExternalProjectSchema>;

export const updateBioSchema = z.object({
    bio: z.string().max(160),
});

export type UpdateBioInput = z.infer<typeof updateBioSchema>;
