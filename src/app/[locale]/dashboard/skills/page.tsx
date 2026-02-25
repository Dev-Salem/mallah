import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import {
  addManualSkillAction,
  createCustomProjectAction,
  deleteCustomProjectAction,
  deleteManualSkillAction,
  toggleSkillVisibilityAction,
  updateCustomProjectAction,
  updateManualSkillAction,
  updateProjectStatusAction,
} from "@/features/skills-hub/actions/skills-hub-actions";
import { SkillsHubPrivateView } from "@/features/skills-hub/components/SkillsHubPrivateView";
import { getSkillHubPrivateView } from "@/features/skills-hub/services/skills-hub-service";
import type { ProjectDifficulty, ProjectStatus, SkillLevel } from "@/features/skills-hub/types";

interface SkillsPageProps {
  searchParams?: Promise<{ ok?: string; err?: string }>;
}

function parseBoolean(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const locale = await getLocale();

  if (!user) redirect(`/${locale}/login`);
  const userId = user.id;

  const query = searchParams ? await searchParams : undefined;
  const notice = query?.ok ? decodeURIComponent(query.ok) : null;
  const error = query?.err ? decodeURIComponent(query.err) : null;

  const model = await getSkillHubPrivateView(userId);

  async function withRedirect(action: () => Promise<{ success: boolean; error?: string }>, okMessage: string) {
    "use server";
    const result = await action();
    if (result.success) {
      redirect(`/${locale}/dashboard/skills?ok=${encodeURIComponent(okMessage)}`);
    }
    redirect(`/${locale}/dashboard/skills?err=${encodeURIComponent(result.error ?? "Operation failed")}`);
  }

  async function addManualSkill(formData: FormData) {
    "use server";
    await withRedirect(
      () =>
        addManualSkillAction(userId, {
          skill_id: String(formData.get("skill_id") ?? ""),
          level: String(formData.get("level") ?? "Beginner") as SkillLevel,
          is_public: parseBoolean(formData.get("is_public")),
        }),
      "Skill added"
    );
  }

  async function updateManualSkill(formData: FormData) {
    "use server";
    await withRedirect(
      () =>
        updateManualSkillAction(userId, {
          skill_id: String(formData.get("skill_id") ?? ""),
          level: String(formData.get("level") ?? "Beginner") as SkillLevel,
          is_public: parseBoolean(formData.get("is_public")),
        }),
      "Skill updated"
    );
  }

  async function deleteManualSkill(formData: FormData) {
    "use server";
    await withRedirect(() => deleteManualSkillAction(userId, String(formData.get("skill_id") ?? "")), "Skill deleted");
  }

  async function toggleSkillVisibility(formData: FormData) {
    "use server";
    await withRedirect(
      () =>
        toggleSkillVisibilityAction(userId, {
          skill_id: String(formData.get("skill_id") ?? ""),
          is_public: String(formData.get("is_public") ?? "false") === "true",
        }),
      "Skill visibility updated"
    );
  }

  async function createCustomProject(formData: FormData) {
    "use server";
    const skillIds = formData.getAll("skill_ids").map((value) => String(value));
    await withRedirect(
      () =>
        createCustomProjectAction(userId, {
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          difficulty_level: String(formData.get("difficulty_level") ?? "Beginner") as ProjectDifficulty,
          skill_ids: skillIds,
          github_url: String(formData.get("github_url") ?? ""),
          status: String(formData.get("status") ?? "Available") as ProjectStatus,
        }),
      "Project created"
    );
  }

  async function updateCustomProject(formData: FormData) {
    "use server";
    const skillIds = formData.getAll("skill_ids").map((value) => String(value));
    await withRedirect(
      () =>
        updateCustomProjectAction(userId, {
          project_id: String(formData.get("project_id") ?? ""),
          title: String(formData.get("title") ?? ""),
          description: String(formData.get("description") ?? ""),
          difficulty_level: String(formData.get("difficulty_level") ?? "Beginner") as ProjectDifficulty,
          skill_ids: skillIds,
          github_url: String(formData.get("github_url") ?? ""),
        }),
      "Project updated"
    );
  }

  async function deleteCustomProject(formData: FormData) {
    "use server";
    await withRedirect(
      () => deleteCustomProjectAction(userId, String(formData.get("project_id") ?? "")),
      "Project deleted"
    );
  }

  async function updateProjectStatus(formData: FormData) {
    "use server";
    await withRedirect(
      () =>
        updateProjectStatusAction(userId, {
          project_id: String(formData.get("project_id") ?? ""),
          status: String(formData.get("status") ?? "Available") as ProjectStatus,
        }),
      "Project status updated"
    );
  }

  return (
    <SkillsHubPrivateView
      data={model}
      locale={locale}
      notice={notice}
      error={error}
      actions={{
        addManualSkill,
        updateManualSkill,
        deleteManualSkill,
        toggleSkillVisibility,
        createCustomProject,
        updateCustomProject,
        deleteCustomProject,
        updateProjectStatus,
      }}
    />
  );
}

