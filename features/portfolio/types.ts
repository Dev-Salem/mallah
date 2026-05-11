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
    id: string;
    project_id: string;
    title: string;
    description: string | null;
    custom_name: string | null;
    custom_description: string | null;
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

// ─── Tactical HUD Project Types ───

export interface BaseProject {
    id: string;
    title: string;
    description: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    status: "available" | "in_progress" | "completed";
    isPublic: boolean;
    techStack: string[];
    skills: {
        id: string;
        name: string;
        category:
            | "fundamentals"
            | "language"
            | "framework_library"
            | "tool"
            | "platform_service"
            | "practice"
            | "other";
    }[];
    githubUrl: string | null;
    demoUrl: string | null;
    completedAt: string | null;
    startedAt: string | null;
    bullets: string[];
    thumbnailUrl: string | null;
}

export interface RoadmapProject extends BaseProject {
    sourceType: "roadmap";
    personalNote: string | null;
}

export interface ExternalProject extends BaseProject {
    sourceType: "user_custom";
}

export type Project = RoadmapProject | ExternalProject;

/**
 * Maps the flat PortfolioProject from the service to the specialized Project types
 */
export function mapPortfolioProjectToProject(up: PortfolioProject): Project {
    const base: BaseProject = {
        id: up.id,
        title: up.custom_name || up.title,
        description: (up.custom_description || up.description) ?? "",
        difficulty: (up.difficulty_level as BaseProject["difficulty"]) || "beginner",
        status: up.status,
        isPublic: up.is_public,
        techStack: up.tech_stack || [],
        skills: up.skills.map((s) => ({
            id: s.skill_id,
            name: s.name,
            category: s.category as any,
        })),
        githubUrl: up.github_url,
        demoUrl: up.demo_url,
        completedAt: up.completed_at,
        startedAt: up.started_at,
        bullets: up.bullets || [],
        thumbnailUrl: up.thumbnail_url,
    };

    if (up.source_type === "roadmap") {
        return {
            ...base,
            sourceType: "roadmap",
            personalNote: up.personal_note,
        } as RoadmapProject;
    }

    return {
        ...base,
        sourceType: "user_custom",
    } as ExternalProject;
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
    skill_id: z.string().optional(),
    custom_name: z.string().optional(),
    custom_category: z.string().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced']),
    is_public: z.boolean().default(true),
}).refine(data => data.skill_id || (data.custom_name && data.custom_category), {
    message: "Either skill_id or both custom_name and custom_category must be provided",
    path: ["skill_id"]
});

export type AddManualSkillInput = z.infer<typeof addManualSkillSchema>;

export const addExternalProjectSchema = z.object({
    title: z.string().min(1).max(200),
    description: z.string().min(1).max(2000),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    github_url: z.string().optional().or(z.literal('')),
    demo_url: z.string().optional().or(z.literal('')),
    tech_stack: z.array(z.string()).optional(),
    skill_ids: z.array(z.string()).optional(),
    status: z.enum(['available', 'in_progress', 'completed']),
    started_at: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    thumbnail_url: z.string().optional().or(z.literal('')),
});

export type AddExternalProjectInput = z.infer<typeof addExternalProjectSchema>;

export const updateBioSchema = z.object({
    bio: z.string().max(160),
});

export type UpdateBioInput = z.infer<typeof updateBioSchema>;

export const updateExternalProjectSchema = z.object({
    projectId: z.string(), // Record ID
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().min(1, 'Description is required').max(2000),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']),
    github_url: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
    demo_url: z.string().url('Invalid Demo URL').optional().or(z.literal('')),
    tech_stack: z.array(z.string()),
    thumbnail_url: z.string().url('Invalid Thumbnail URL').optional().or(z.literal('')),
    status: z.enum(['available', 'in_progress', 'completed']),
    started_at: z.string().optional().or(z.literal('')),
    bullets: z.array(z.string()).optional(),
    skill_ids: z.array(z.string()).optional(),
});

export type UpdateExternalProjectInput = z.infer<typeof updateExternalProjectSchema>;
