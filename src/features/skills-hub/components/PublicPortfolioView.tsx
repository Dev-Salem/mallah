import type { PortfolioPublicViewModel } from "../types";

interface PublicPortfolioViewProps {
  data: PortfolioPublicViewModel;
}

export function PublicPortfolioView({ data }: PublicPortfolioViewProps) {
  const fullName = `${data.learner.first_name ?? ""} ${data.learner.last_name ?? ""}`.trim() || "Learner";
  const isEmpty = data.public_skills.length === 0 && data.completed_projects.length === 0;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-8">
      <header className="border border-slate-800 rounded-lg p-5 bg-slate-900/40">
        <h1 className="text-3xl font-black text-white uppercase tracking-tight">{fullName}</h1>
        <p className="text-slate-400 text-sm mt-1">Public Portfolio</p>
      </header>

      {isEmpty ? (
        <section className="border border-slate-800 rounded-lg p-6 bg-slate-900/40">
          <p className="text-slate-300">No public skills or completed projects available yet.</p>
        </section>
      ) : null}

      {data.public_skills.length > 0 ? (
        <section className="border border-slate-800 rounded-lg p-5 bg-slate-900/40">
          <h2 className="text-xl text-white font-semibold mb-3">Public Skills</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {data.public_skills.map((skill) => (
              <div key={skill.skill_id} className="border border-slate-800 rounded p-3 bg-slate-950/40">
                <p className="text-slate-100 font-medium">{skill.name}</p>
                <p className="text-xs text-slate-400">
                  {skill.level} • {skill.source}
                  {skill.category ? ` • ${skill.category}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {data.completed_projects.length > 0 ? (
        <section className="border border-slate-800 rounded-lg p-5 bg-slate-900/40">
          <h2 className="text-xl text-white font-semibold mb-3">Completed Projects</h2>
          <div className="space-y-4">
            {data.completed_projects.map((project) => (
              <div key={project.project_id} className="border border-slate-800 rounded p-3 bg-slate-950/40">
                <p className="text-slate-100 font-medium">{project.title}</p>
                <p className="text-xs text-slate-400">
                  {project.difficulty_level}
                  {project.completed_at ? ` • Completed ${new Date(project.completed_at).toLocaleDateString()}` : ""}
                </p>
                <p className="text-sm text-slate-300 mt-2">{project.description}</p>
                {project.github_url ? (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className="text-cyan-400 text-sm hover:text-cyan-300 inline-block mt-2">
                    View source
                  </a>
                ) : null}
                {project.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.skills.map((skill) => (
                      <span key={`${project.project_id}-${skill.skill_id}`} className="text-xs bg-slate-800 text-slate-300 rounded px-2 py-1">
                        {skill.name}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

