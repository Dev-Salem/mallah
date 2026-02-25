import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { SkillHubPrivateViewModel } from "../types";

interface SkillsHubPrivateViewProps {
  data: SkillHubPrivateViewModel;
  locale: string;
  notice?: string | null;
  error?: string | null;
  actions: {
    addManualSkill: (formData: FormData) => Promise<void>;
    updateManualSkill: (formData: FormData) => Promise<void>;
    deleteManualSkill: (formData: FormData) => Promise<void>;
    toggleSkillVisibility: (formData: FormData) => Promise<void>;
    createCustomProject: (formData: FormData) => Promise<void>;
    updateCustomProject: (formData: FormData) => Promise<void>;
    deleteCustomProject: (formData: FormData) => Promise<void>;
    updateProjectStatus: (formData: FormData) => Promise<void>;
  };
}

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const STATUSES = ["Available", "InProgress", "Completed"] as const;
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;

export function SkillsHubPrivateView({ data, locale, notice, error, actions }: SkillsHubPrivateViewProps) {
  const fullName = `${data.learner.first_name ?? ""} ${data.learner.last_name ?? ""}`.trim() || "Learner";

  return (
    <div className="space-y-6">
      <header className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h1 className="text-2xl font-black text-white uppercase tracking-tight">Skills & Portfolio Hub</h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your skills evidence and project portfolio. Public portfolio route is user-id based in this phase.
        </p>
        <div className="mt-3">
          <Link href={`/${locale}/portfolio/${data.learner.user_id}`} className="text-cyan-400 text-sm hover:text-cyan-300">
            View public portfolio for {fullName}
          </Link>
        </div>
      </header>

      {notice ? (
        <div className="border border-emerald-700/50 bg-emerald-950/30 text-emerald-200 rounded-lg px-3 py-2 text-sm">{notice}</div>
      ) : null}
      {error ? (
        <div className="border border-rose-700/50 bg-rose-950/30 text-rose-200 rounded-lg px-3 py-2 text-sm">{error}</div>
      ) : null}

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 space-y-3">
        <h2 className="text-white font-semibold">Add Manual Skill</h2>
        <form action={actions.addManualSkill} className="grid md:grid-cols-4 gap-3">
          <select name="skill_id" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200" required>
            <option value="">Choose skill</option>
            {data.skills_catalog.map((skill) => (
              <option key={skill.id} value={skill.id}>
                {skill.name}
              </option>
            ))}
          </select>
          <select name="level" defaultValue="Beginner" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200">
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="is_public" defaultChecked />
            Public
          </label>
          <Button type="submit">Add Skill</Button>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Skills Evidence</h2>
        <div className="space-y-3">
          {data.skills.length === 0 ? <p className="text-slate-400 text-sm">No skills yet.</p> : null}
          {data.skills.map((skill) => (
            <div key={skill.skill_id} className="border border-slate-800 rounded p-3 bg-slate-950/50">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-slate-100 font-medium">{skill.name}</p>
                  <p className="text-xs text-slate-400">
                    {skill.level} • {skill.source} {skill.category ? `• ${skill.category}` : ""}
                  </p>
                </div>
                <form action={actions.toggleSkillVisibility} className="flex items-center gap-2">
                  <input type="hidden" name="skill_id" value={skill.skill_id} />
                  <input type="hidden" name="is_public" value={String(!skill.is_public)} />
                  <Button type="submit" variant="outline" size="sm">
                    {skill.is_public ? "Make Private" : "Make Public"}
                  </Button>
                </form>
              </div>

              {skill.can_edit ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <form action={actions.updateManualSkill} className="grid md:grid-cols-3 gap-2 flex-1 min-w-[320px]">
                    <input type="hidden" name="skill_id" value={skill.skill_id} />
                    <select
                      name="level"
                      defaultValue={skill.level}
                      className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
                    >
                      {LEVELS.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input type="checkbox" name="is_public" defaultChecked={skill.is_public} />
                      Public
                    </label>
                    <Button type="submit" size="sm">
                      Save Skill
                    </Button>
                  </form>
                  <form action={actions.deleteManualSkill}>
                    <input type="hidden" name="skill_id" value={skill.skill_id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Delete
                    </Button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40 space-y-3">
        <h2 className="text-white font-semibold">Add Custom Project</h2>
        <form action={actions.createCustomProject} className="grid md:grid-cols-2 gap-3">
          <input
            name="title"
            required
            placeholder="Project title"
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
          />
          <select
            name="difficulty_level"
            defaultValue="Beginner"
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
          >
            {DIFFICULTIES.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty}
              </option>
            ))}
          </select>
          <textarea
            name="description"
            required
            placeholder="What this project does"
            className="md:col-span-2 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
          />
          <input
            name="github_url"
            placeholder="GitHub URL (optional)"
            className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
          />
          <select name="status" defaultValue="Available" className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200">
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="md:col-span-2">
            <p className="text-xs text-slate-400 mb-2">Attach skills (optional)</p>
            <div className="grid md:grid-cols-3 gap-2">
              {data.skills_catalog.map((skill) => (
                <label key={skill.id} className="text-xs text-slate-300 flex items-center gap-2 border border-slate-800 rounded px-2 py-1">
                  <input type="checkbox" name="skill_ids" value={skill.id} />
                  {skill.name}
                </label>
              ))}
            </div>
          </div>
          <Button type="submit" className="md:col-span-2">
            Create Project
          </Button>
        </form>
      </section>

      <section className="border border-slate-800 rounded-lg p-4 bg-slate-900/40">
        <h2 className="text-white font-semibold mb-3">Projects</h2>
        <div className="space-y-4">
          {data.projects.length === 0 ? <p className="text-slate-400 text-sm">No projects yet.</p> : null}
          {data.projects.map((project) => (
            <div key={project.project_id} className="border border-slate-800 rounded p-3 bg-slate-950/50 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-slate-100 font-medium">{project.title}</p>
                  <p className="text-xs text-slate-400">
                    {project.status} • {project.difficulty_level} • {project.source_type}
                  </p>
                  {project.github_url ? (
                    <a href={project.github_url} target="_blank" rel="noreferrer" className="text-cyan-400 text-xs hover:text-cyan-300">
                      {project.github_url}
                    </a>
                  ) : null}
                </div>
                <form action={actions.updateProjectStatus} className="flex items-center gap-2">
                  <input type="hidden" name="project_id" value={project.project_id} />
                  <select
                    name="status"
                    defaultValue={project.status}
                    className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 text-sm"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline" size="sm">
                    Update Status
                  </Button>
                </form>
              </div>
              <p className="text-sm text-slate-300">{project.description}</p>

              {project.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <span key={`${project.project_id}-${skill.skill_id}`} className="text-xs bg-slate-800 text-slate-300 rounded px-2 py-1">
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : null}

              {project.can_edit ? (
                <div className="space-y-2">
                  <form action={actions.updateCustomProject} className="grid md:grid-cols-2 gap-2">
                    <input type="hidden" name="project_id" value={project.project_id} />
                    <input
                      name="title"
                      defaultValue={project.title}
                      required
                      className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
                    />
                    <select
                      name="difficulty_level"
                      defaultValue={project.difficulty_level}
                      className="bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
                    >
                      {DIFFICULTIES.map((difficulty) => (
                        <option key={difficulty} value={difficulty}>
                          {difficulty}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="description"
                      defaultValue={project.description}
                      required
                      className="md:col-span-2 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
                    />
                    <input
                      name="github_url"
                      defaultValue={project.github_url ?? ""}
                      placeholder="GitHub URL"
                      className="md:col-span-2 bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200"
                    />
                    <div className="md:col-span-2 grid md:grid-cols-3 gap-2">
                      {data.skills_catalog.map((skill) => (
                        <label key={`${project.project_id}-${skill.id}`} className="text-xs text-slate-300 flex items-center gap-2 border border-slate-800 rounded px-2 py-1">
                          <input
                            type="checkbox"
                            name="skill_ids"
                            value={skill.id}
                            defaultChecked={project.skills.some((projectSkill) => projectSkill.skill_id === skill.id)}
                          />
                          {skill.name}
                        </label>
                      ))}
                    </div>
                    <div className="md:col-span-2">
                      <Button type="submit" size="sm">
                        Save Project
                      </Button>
                    </div>
                  </form>
                  <form action={actions.deleteCustomProject}>
                    <input type="hidden" name="project_id" value={project.project_id} />
                    <Button type="submit" variant="destructive" size="sm">
                      Delete Project
                    </Button>
                  </form>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
