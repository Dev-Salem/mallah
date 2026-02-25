export type SkillLevel = "Beginner" | "Intermediate" | "Advanced";
export type SkillSource = "Roadmap" | "Project" | "Manual";
export type ProjectStatus = "Available" | "InProgress" | "Completed";
export type ProjectDifficulty = "Beginner" | "Intermediate" | "Advanced";

export interface SkillHubLearnerSummary {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  current_path_id: string | null;
}

export interface SkillHubSkillItem {
  skill_id: string;
  name: string;
  category: string | null;
  level: SkillLevel;
  source: SkillSource;
  is_public: boolean;
  acquired_at: string | null;
  can_edit: boolean;
  can_delete: boolean;
}

export interface SkillHubProjectSkill {
  skill_id: string;
  name: string;
  category: string | null;
}

export interface SkillHubProjectItem {
  project_id: string;
  title: string;
  description: string;
  difficulty_level: ProjectDifficulty;
  source_type: "RoadmapSuggested" | "OpportunityAnalyzer" | "PlatformSuggested" | "UserCustom";
  status: ProjectStatus;
  github_url: string | null;
  started_at: string | null;
  completed_at: string | null;
  skills: SkillHubProjectSkill[];
  can_edit: boolean;
  can_delete: boolean;
}

export interface SkillHubPrivateViewModel {
  learner: SkillHubLearnerSummary;
  skills: SkillHubSkillItem[];
  projects: SkillHubProjectItem[];
  skills_catalog: Array<{
    id: string;
    name: string;
    category: string | null;
  }>;
}

export interface PortfolioPublicViewModel {
  learner: {
    user_id: string;
    first_name: string | null;
    last_name: string | null;
  };
  public_skills: Array<{
    skill_id: string;
    name: string;
    category: string | null;
    level: SkillLevel;
    source: SkillSource;
  }>;
  completed_projects: Array<{
    project_id: string;
    title: string;
    description: string;
    difficulty_level: ProjectDifficulty;
    github_url: string | null;
    completed_at: string | null;
    skills: SkillHubProjectSkill[];
  }>;
}

export interface AddManualSkillInput {
  skill_id: string;
  level: SkillLevel;
  is_public: boolean;
}

export interface UpdateManualSkillInput {
  skill_id: string;
  level: SkillLevel;
  is_public: boolean;
}

export interface ToggleSkillVisibilityInput {
  skill_id: string;
  is_public: boolean;
}

export interface CreateCustomProjectInput {
  title: string;
  description: string;
  difficulty_level: ProjectDifficulty;
  skill_ids: string[];
  github_url?: string | null;
  status: ProjectStatus;
}

export interface UpdateCustomProjectInput {
  project_id: string;
  title: string;
  description: string;
  difficulty_level: ProjectDifficulty;
  skill_ids: string[];
  github_url?: string | null;
}

export interface UpdateProjectStatusInput {
  project_id: string;
  status: ProjectStatus;
}

