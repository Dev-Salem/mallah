import { cn } from "@/lib/utils";

export default function PreviewCard({
  sections,
  resumeInfo,
}: {
  sections: any[];
  resumeInfo: any;
}) {
  const personalInfo =
    sections.find((s) => s.section_type === "PERSONAL_INFO")?.content || {};
  const displayName =
    personalInfo.full_name || resumeInfo.title || "Your Name";
  const summary =
    sections.find((s) => s.section_type === "SUMMARY")?.content?.text || "";
  const skills =
    sections.find((s) => s.section_type === "SKILLS")?.content?.manual_skills ||
    [];
  const experience = sections.find(
    (s) => s.section_type === "EXPERIENCE"
  )?.content;
  const experienceEntries = Array.isArray(experience) ? experience : [];
  const projects = sections.find(
    (s) => s.section_type === "PROJECTS"
  )?.content;
  const projectEntries = Array.isArray(projects)
    ? projects.filter((p: any) => p.included !== false)
    : [];
  const education = sections.find(
    (s) => s.section_type === "EDUCATION"
  )?.content;
  const educationEntries = Array.isArray(education) ? education : [];
  const certifications = sections.find(
    (s) => s.section_type === "CERTIFICATIONS"
  )?.content;
  const certEntries = Array.isArray(certifications) ? certifications : [];

  const contactParts = [
    personalInfo.phone,
    personalInfo.location,
    personalInfo.linkedin,
    personalInfo.github,
  ].filter(Boolean);

  const isEmpty = sections.length === 0 || sections.every(s => !s.content || (Array.isArray(s.content) && s.content.length === 0));

  return (
    <div className="flex-1 overflow-y-auto bg-slate-200/50 p-8 flex justify-center">
      <div className={cn(
        "bg-white text-black shadow-xl shadow-slate-300/50 w-[600px] min-h-[848px] p-[36pt] rounded-sm shrink-0 border border-slate-100 relative overflow-hidden flex flex-col transition-all",
        isEmpty && "items-center justify-center bg-slate-50"
      )}>
        {isEmpty ? (
          <div className="relative w-full h-full flex items-center justify-center p-12 group">
            {/* Tactical HUD Empty State */}
            <div className="absolute inset-0 hud-grid opacity-[0.05] pointer-events-none" />
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-6 glow-border">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">System Identification Required</h3>
              <p className="font-mono text-[10px] uppercase text-muted-foreground tracking-widest leading-relaxed max-w-[200px] mx-auto opacity-60">
                Input data to initialize candidate profile and generate navigational roadmap.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* ── Header ──────────────────────────────────── */}
            <div className="mb-6 text-left">
              <h1 className="text-[20px] font-semibold text-black mb-1.5 leading-tight">
                {displayName}
              </h1>
              <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-2">
                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                {personalInfo.phone && personalInfo.location && <span>•</span>}
                {personalInfo.location && <span>{personalInfo.location}</span>}
                {personalInfo.location && personalInfo.linkedin && <span>•</span>}
                {personalInfo.linkedin && (
                  <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#1a56db] hover:underline">
                    LinkedIn
                  </a>
                )}
                {personalInfo.linkedin && personalInfo.github && <span>•</span>}
                {personalInfo.github && (
                  <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className="text-[#1a56db] hover:underline">
                    GitHub
                  </a>
                )}
                {personalInfo.github && personalInfo.portfolio && <span>•</span>}
                {personalInfo.portfolio && (
                  <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className="text-[#1a56db] hover:underline">
                    Portfolio
                  </a>
                )}
              </div>
            </div>

            {/* ── Summary ─────────────────────────────────── */}
            {summary && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Summary
                </h2>
                <p className="text-[11px] leading-[1.3] text-black text-left">
                  {summary}
                </p>
              </div>
            )}

            {/* ── Skills ──────────────────────────────────── */}
            {skills.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Skills
                </h2>
                <div className="space-y-1">
                  {skills.map((item: any, i: number) => (
                    <p
                      key={i}
                      className="text-[11px] leading-relaxed text-black text-left"
                    >
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <>
                          <span className="text-[11px] font-semibold">{item.name}</span>{" — "}
                          {item.skills.join(", ")}
                        </>
                      )}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* ── Experience ──────────────────────────────── */}
            {experienceEntries.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Experience
                </h2>
                {experienceEntries.map((exp: any, i: number) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="text-[12px] font-semibold text-black">
                        {exp.title}
                        {exp.company && ` — ${exp.company}`}
                      </span>
                      <span className="font-mono text-[11px] text-slate-500 uppercase tracking-tighter">
                        {exp.start}
                        {(exp.end || exp.current) &&
                          ` – ${exp.current ? "Present" : exp.end}`}
                      </span>
                    </div>
                    {exp.location && (
                      <p className="text-[11px] text-slate-500 mb-1.5">
                        {exp.location}
                      </p>
                    )}
                    {exp.bullets?.filter(Boolean).length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-black space-y-1 pl-1 leading-[1.3]">
                        {exp.bullets
                          .filter(Boolean)
                          .map((b: string, bIdx: number) => (
                            <li key={bIdx} className="text-left">{b}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Projects ────────────────────────────────── */}
            {projectEntries.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Projects
                </h2>
                {projectEntries.map((proj: any, i: number) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="text-[12px] flex items-center gap-2">
                        {proj.demo || proj.demo_override ? (
                          <a 
                            href={proj.demo || proj.demo_override} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-semibold text-[#1a56db] hover:underline"
                          >
                            {proj.title || "Untitled Project"}
                          </a>
                        ) : (
                          <span className="font-semibold text-black">
                            {proj.title || "Untitled Project"}
                          </span>
                        )}
                        {(proj.technologies?.length > 0) && (
                          <span className="font-mono text-[11px] text-slate-500 tracking-tighter">
                            {" | "}
                            {proj.technologies.join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {(proj.github || proj.github_override) && (
                      <div className="text-[11px] text-[#1a56db] mb-1">
                        <a 
                          href={proj.github || proj.github_override} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          GitHub Codebase
                        </a>
                      </div>
                    )}

                    {proj.description || proj.description_override ? (
                      <p className="text-[11px] text-black mb-1.5 leading-[1.3]">
                        {proj.description || proj.description_override}
                      </p>
                    ) : null}

                    {proj.bullets?.filter(Boolean).length > 0 && (
                      <ul className="list-disc list-inside text-[11px] text-black space-y-1 pl-1 leading-[1.3]">
                        {proj.bullets
                          .filter(Boolean)
                          .map((b: string, bIdx: number) => (
                            <li key={bIdx} className="text-left">{b}</li>
                          ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Education ───────────────────────── */}
            {educationEntries.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Education
                </h2>
                {educationEntries.map((edu: any, i: number) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[12px] font-semibold text-black">
                        {edu.degree}
                        {edu.institution && ` — ${edu.institution}`}
                        {edu.field && `, ${edu.field}`}
                      </span>
                      {edu.year && (
                        <span className="font-mono text-[11px] text-slate-500 tracking-tighter">
                          {edu.in_progress ? `Expected ${edu.year}` : edu.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Certifications ──────────────────────────── */}
            {certEntries.length > 0 && (
              <div className="mb-5">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.1em] text-black border-b-[0.5px] border-slate-300 pb-1 mb-2">
                  Certifications
                </h2>
                {certEntries.map((cert: any, i: number) => (
                  <div key={i} className="mb-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[12px] text-black">
                        <span className="font-semibold">{cert.name}</span>
                        {cert.issuer && ` — ${cert.issuer}`}
                      </span>
                      {cert.year && (
                        <span className="font-mono text-[11px] text-slate-500 tracking-tighter">
                          {cert.year}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
