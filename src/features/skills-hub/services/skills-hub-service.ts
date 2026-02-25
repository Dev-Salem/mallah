import { createClient } from "@/lib/supabase/server";
import type {
  AddManualSkillInput,
  CreateCustomProjectInput,
  PortfolioPublicViewModel,
  ProjectDifficulty,
  ProjectStatus,
  SkillHubPrivateViewModel,
  SkillLevel,
  ToggleSkillVisibilityInput,
  UpdateCustomProjectInput,
  UpdateManualSkillInput,
  UpdateProjectStatusInput,
} from "../types";

const SKILL_LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];
const PROJECT_STATUSES: ProjectStatus[] = ["Available", "InProgress", "Completed"];
const PROJECT_DIFFICULTIES: ProjectDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

function assertSkillLevel(level: string): asserts level is SkillLevel {
  if (!SKILL_LEVELS.includes(level as SkillLevel)) {
    throw new Error("Invalid skill level.");
  }
}

function assertProjectStatus(status: string): asserts status is ProjectStatus {
  if (!PROJECT_STATUSES.includes(status as ProjectStatus)) {
    throw new Error("Invalid project status.");
  }
}

function assertProjectDifficulty(level: string): asserts level is ProjectDifficulty {
  if (!PROJECT_DIFFICULTIES.includes(level as ProjectDifficulty)) {
    throw new Error("Invalid project difficulty.");
  }
}

function normalizeSkillIds(skillIds: string[]): string[] {
  return Array.from(new Set(skillIds.filter(Boolean)));
}

function projectStatusOrder(status: ProjectStatus): number {
  if (status === "InProgress") return 0;
  if (status === "Available") return 1;
  return 2;
}

async function unlockProjectSkills(userId: string, projectId: string) {
  const supabase = await createClient();
  const { data: mappings, error: mappingError } = await supabase
    .from("project_skills")
    .select("skill_id")
    .eq("project_id", projectId);
  if (mappingError) throw mappingError;

  const now = new Date().toISOString();

  for (const mapping of mappings ?? []) {
    const { data: existing, error: existingError } = await supabase
      .from("user_skills")
      .select("level,source,is_public")
      .eq("user_id", userId)
      .eq("skill_id", mapping.skill_id)
      .maybeSingle();
    if (existingError) throw existingError;

    if (!existing) {
      const { error: insertError } = await supabase.from("user_skills").insert({
        user_id: userId,
        skill_id: mapping.skill_id,
        level: "Beginner",
        source: "Project",
        acquired_at: now,
        is_public: true,
      });
      if (insertError) throw insertError;
    }
  }
}

async function getOwnedProject(userId: string, projectId: string) {
  const supabase = await createClient();
  const { data: userProject, error: projectError } = await supabase
    .from("user_projects")
    .select("project_id,status")
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (projectError) throw projectError;
  if (!userProject) throw new Error("Project not found.");

  const { data: project, error: detailsError } = await supabase
    .from("projects")
    .select("id,source_type")
    .eq("id", projectId)
    .maybeSingle();
  if (detailsError) throw detailsError;
  if (!project) throw new Error("Project metadata not found.");

  return {
    status: userProject.status as ProjectStatus,
    source_type: project.source_type as string,
  };
}

export async function getSkillHubPrivateView(userId: string): Promise<SkillHubPrivateViewModel> {
  const supabase = await createClient();

  const { data: learner, error: learnerError } = await supabase
    .from("learners")
    .select("user_id,first_name,last_name,current_path_id")
    .eq("user_id", userId)
    .single();
  if (learnerError) throw learnerError;

  const { data: skillsRows, error: skillsError } = await supabase
    .from("user_skills")
    .select("skill_id,level,source,is_public,acquired_at,skills(id,name,category)")
    .eq("user_id", userId);
  if (skillsError) throw skillsError;

  const { data: projectsRows, error: projectsError } = await supabase
    .from("user_projects")
    .select("project_id,status,github_url,started_at,completed_at,projects(id,title,description,difficulty_level,source_type)")
    .eq("user_id", userId);
  if (projectsError) throw projectsError;

  const projectIds = (projectsRows ?? []).map((row) => row.project_id);
  const { data: projectSkillRows, error: projectSkillError } = projectIds.length
    ? await supabase
        .from("project_skills")
        .select("project_id,skill_id,skills(id,name,category)")
        .in("project_id", projectIds)
    : { data: [], error: null as Error | null };
  if (projectSkillError) throw projectSkillError;

  const { data: catalogRows, error: catalogError } = await supabase
    .from("skills")
    .select("id,name,category")
    .order("name", { ascending: true });
  if (catalogError) throw catalogError;

  const projectSkillsByProject = new Map<string, Array<{ skill_id: string; name: string; category: string | null }>>();
  for (const row of projectSkillRows ?? []) {
    const skillData = Array.isArray(row.skills) ? row.skills[0] : row.skills;
    if (!skillData) continue;
    const list = projectSkillsByProject.get(row.project_id) ?? [];
    list.push({
      skill_id: skillData.id,
      name: skillData.name,
      category: skillData.category ?? null,
    });
    projectSkillsByProject.set(row.project_id, list);
  }

  const skills = (skillsRows ?? [])
    .map((row) => {
      const skillData = Array.isArray(row.skills) ? row.skills[0] : row.skills;
      if (!skillData) return null;
      return {
        skill_id: row.skill_id,
        name: skillData.name,
        category: skillData.category ?? null,
        level: row.level as SkillLevel,
        source: row.source as "Roadmap" | "Project" | "Manual",
        is_public: row.is_public,
        acquired_at: row.acquired_at ?? null,
        can_edit: row.source === "Manual",
        can_delete: row.source === "Manual",
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.name.localeCompare(b.name));

  const projects = (projectsRows ?? [])
    .map((row) => {
      const projectData = Array.isArray(row.projects) ? row.projects[0] : row.projects;
      if (!projectData) return null;
      return {
        project_id: row.project_id,
        title: projectData.title,
        description: projectData.description,
        difficulty_level: projectData.difficulty_level as ProjectDifficulty,
        source_type: projectData.source_type as "RoadmapSuggested" | "OpportunityAnalyzer" | "PlatformSuggested" | "UserCustom",
        status: row.status as ProjectStatus,
        github_url: row.github_url ?? null,
        started_at: row.started_at ?? null,
        completed_at: row.completed_at ?? null,
        skills: projectSkillsByProject.get(row.project_id) ?? [],
        can_edit: projectData.source_type === "UserCustom",
        can_delete: projectData.source_type === "UserCustom",
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => {
      const byStatus = projectStatusOrder(a.status) - projectStatusOrder(b.status);
      if (byStatus !== 0) return byStatus;
      const aDate = a.completed_at ?? a.started_at ?? "";
      const bDate = b.completed_at ?? b.started_at ?? "";
      return bDate.localeCompare(aDate);
    });

  return {
    learner: {
      user_id: learner.user_id,
      first_name: learner.first_name ?? null,
      last_name: learner.last_name ?? null,
      current_path_id: learner.current_path_id ?? null,
    },
    skills,
    projects,
    skills_catalog: (catalogRows ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      category: row.category ?? null,
    })),
  };
}

export async function getPublicPortfolio(userId: string): Promise<PortfolioPublicViewModel | null> {
  const supabase = await createClient();
  const { data: learner, error: learnerError } = await supabase
    .from("learners")
    .select("user_id,first_name,last_name")
    .eq("user_id", userId)
    .maybeSingle();

  if (learnerError) throw learnerError;
  if (!learner) return null;

  const { data: skillRows, error: skillsError } = await supabase
    .from("user_skills")
    .select("skill_id,level,source,skills(id,name,category)")
    .eq("user_id", userId)
    .eq("is_public", true);
  if (skillsError) throw skillsError;

  const { data: projectRows, error: projectsError } = await supabase
    .from("user_projects")
    .select("project_id,status,github_url,completed_at,projects(id,title,description,difficulty_level)")
    .eq("user_id", userId)
    .eq("status", "Completed");
  if (projectsError) throw projectsError;

  const projectIds = (projectRows ?? []).map((row) => row.project_id);
  const { data: projectSkillRows, error: projectSkillError } = projectIds.length
    ? await supabase
        .from("project_skills")
        .select("project_id,skill_id,skills(id,name,category)")
        .in("project_id", projectIds)
    : { data: [], error: null as Error | null };
  if (projectSkillError) throw projectSkillError;

  const skillsByProject = new Map<string, Array<{ skill_id: string; name: string; category: string | null }>>();
  for (const row of projectSkillRows ?? []) {
    const skillData = Array.isArray(row.skills) ? row.skills[0] : row.skills;
    if (!skillData) continue;
    const list = skillsByProject.get(row.project_id) ?? [];
    list.push({
      skill_id: skillData.id,
      name: skillData.name,
      category: skillData.category ?? null,
    });
    skillsByProject.set(row.project_id, list);
  }

  return {
    learner: {
      user_id: learner.user_id,
      first_name: learner.first_name ?? null,
      last_name: learner.last_name ?? null,
    },
    public_skills: (skillRows ?? [])
      .map((row) => {
        const skillData = Array.isArray(row.skills) ? row.skills[0] : row.skills;
        if (!skillData) return null;
        return {
          skill_id: row.skill_id,
          name: skillData.name,
          category: skillData.category ?? null,
          level: row.level as SkillLevel,
          source: row.source as "Roadmap" | "Project" | "Manual",
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => a.name.localeCompare(b.name)),
    completed_projects: (projectRows ?? [])
      .map((row) => {
        const projectData = Array.isArray(row.projects) ? row.projects[0] : row.projects;
        if (!projectData) return null;
        return {
          project_id: row.project_id,
          title: projectData.title,
          description: projectData.description,
          difficulty_level: projectData.difficulty_level as ProjectDifficulty,
          github_url: row.github_url ?? null,
          completed_at: row.completed_at ?? null,
          skills: skillsByProject.get(row.project_id) ?? [],
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? "")),
  };
}

export async function addManualSkill(userId: string, input: AddManualSkillInput) {
  assertSkillLevel(input.level);
  const supabase = await createClient();

  const { data: existing, error: existingError } = await supabase
    .from("user_skills")
    .select("skill_id")
    .eq("user_id", userId)
    .eq("skill_id", input.skill_id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (existing) throw new Error("Skill already exists in your profile.");

  const { error } = await supabase.from("user_skills").insert({
    user_id: userId,
    skill_id: input.skill_id,
    level: input.level,
    source: "Manual",
    is_public: input.is_public,
    acquired_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateManualSkill(userId: string, input: UpdateManualSkillInput) {
  assertSkillLevel(input.level);
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("user_skills")
    .select("source")
    .eq("user_id", userId)
    .eq("skill_id", input.skill_id)
    .maybeSingle();
  if (existingError) throw existingError;
  if (!existing) throw new Error("Skill not found.");
  if (existing.source !== "Manual") throw new Error("Only manual skills can be edited.");

  const { error } = await supabase
    .from("user_skills")
    .update({
      level: input.level,
      is_public: input.is_public,
    })
    .eq("user_id", userId)
    .eq("skill_id", input.skill_id);
  if (error) throw error;
}

export async function deleteManualSkill(userId: string, skillId: string) {
  const supabase = await createClient();
  const { data: existing, error: existingError } = await supabase
    .from("user_skills")
    .select("source")
    .eq("user_id", userId)
    .eq("skill_id", skillId)
    .maybeSingle();
  if (existingError) throw existingError;
  if (!existing) throw new Error("Skill not found.");
  if (existing.source !== "Manual") throw new Error("Only manual skills can be deleted.");

  const { error } = await supabase.from("user_skills").delete().eq("user_id", userId).eq("skill_id", skillId);
  if (error) throw error;
}

export async function toggleSkillVisibility(userId: string, input: ToggleSkillVisibilityInput) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_skills")
    .update({
      is_public: input.is_public,
    })
    .eq("user_id", userId)
    .eq("skill_id", input.skill_id);
  if (error) throw error;
}

export async function createCustomProject(userId: string, input: CreateCustomProjectInput) {
  assertProjectDifficulty(input.difficulty_level);
  assertProjectStatus(input.status);
  const supabase = await createClient();
  const skillIds = normalizeSkillIds(input.skill_ids);

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      title: input.title,
      description: input.description,
      difficulty_level: input.difficulty_level,
      source_type: "UserCustom",
      is_active: true,
      is_external: true,
    })
    .select("id")
    .single();
  if (projectError) throw projectError;

  const now = new Date().toISOString();
  const startedAt = input.status === "InProgress" || input.status === "Completed" ? now : null;
  const completedAt = input.status === "Completed" ? now : null;

  const { error: userProjectError } = await supabase.from("user_projects").insert({
    user_id: userId,
    project_id: project.id,
    status: input.status,
    github_url: input.github_url?.trim() || null,
    started_at: startedAt,
    completed_at: completedAt,
  });
  if (userProjectError) throw userProjectError;

  if (skillIds.length > 0) {
    const { error: mapError } = await supabase.from("project_skills").insert(
      skillIds.map((skillId) => ({
        project_id: project.id,
        skill_id: skillId,
        importance_level: "Core",
      }))
    );
    if (mapError) throw mapError;
  }

  if (input.status === "Completed") {
    await unlockProjectSkills(userId, project.id);
  }
}

export async function updateCustomProject(userId: string, input: UpdateCustomProjectInput) {
  assertProjectDifficulty(input.difficulty_level);
  const skillIds = normalizeSkillIds(input.skill_ids);
  const owned = await getOwnedProject(userId, input.project_id);
  if (owned.source_type !== "UserCustom") throw new Error("Only custom projects can be edited.");

  const supabase = await createClient();
  const { error: projectUpdateError } = await supabase
    .from("projects")
    .update({
      title: input.title,
      description: input.description,
      difficulty_level: input.difficulty_level,
    })
    .eq("id", input.project_id);
  if (projectUpdateError) throw projectUpdateError;

  const { error: userProjectUpdateError } = await supabase
    .from("user_projects")
    .update({
      github_url: input.github_url?.trim() || null,
    })
    .eq("user_id", userId)
    .eq("project_id", input.project_id);
  if (userProjectUpdateError) throw userProjectUpdateError;

  const { error: deleteMapError } = await supabase.from("project_skills").delete().eq("project_id", input.project_id);
  if (deleteMapError) throw deleteMapError;

  if (skillIds.length > 0) {
    const { error: insertMapError } = await supabase.from("project_skills").insert(
      skillIds.map((skillId) => ({
        project_id: input.project_id,
        skill_id: skillId,
        importance_level: "Core",
      }))
    );
    if (insertMapError) throw insertMapError;
  }
}

export async function deleteCustomProject(userId: string, projectId: string) {
  const owned = await getOwnedProject(userId, projectId);
  if (owned.source_type !== "UserCustom") throw new Error("Only custom projects can be deleted.");

  const supabase = await createClient();
  const { error: userProjectDeleteError } = await supabase
    .from("user_projects")
    .delete()
    .eq("user_id", userId)
    .eq("project_id", projectId);
  if (userProjectDeleteError) throw userProjectDeleteError;

  const { error: mapDeleteError } = await supabase.from("project_skills").delete().eq("project_id", projectId);
  if (mapDeleteError) throw mapDeleteError;

  const { error: projectDeleteError } = await supabase.from("projects").delete().eq("id", projectId);
  if (projectDeleteError) throw projectDeleteError;
}

export async function updateProjectStatus(userId: string, input: UpdateProjectStatusInput) {
  assertProjectStatus(input.status);
  const owned = await getOwnedProject(userId, input.project_id);

  if (owned.status === "Completed" && input.status !== "Completed") {
    throw new Error("Completed projects cannot be downgraded.");
  }
  if (owned.status === input.status) return;

  const supabase = await createClient();
  const now = new Date().toISOString();
  const startedAt = input.status === "InProgress" || input.status === "Completed" ? now : null;
  const completedAt = input.status === "Completed" ? now : null;

  const payload: {
    status: ProjectStatus;
    started_at?: string | null;
    completed_at?: string | null;
  } = {
    status: input.status,
  };

  if (owned.status === "Available" && startedAt) {
    payload.started_at = startedAt;
  }
  if (input.status === "Completed") {
    payload.completed_at = completedAt;
    if (owned.status === "Available") {
      payload.started_at = startedAt;
    }
  }

  const { error } = await supabase
    .from("user_projects")
    .update(payload)
    .eq("user_id", userId)
    .eq("project_id", input.project_id);
  if (error) throw error;

  if (input.status === "Completed" && owned.status !== "Completed") {
    await unlockProjectSkills(userId, input.project_id);
  }
}

