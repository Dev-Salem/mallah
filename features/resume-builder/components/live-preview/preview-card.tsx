import { ZoomIn, ZoomOut } from "lucide-react";

export default function PreviewCard({
  sections,
  resumeInfo,
}: {
  sections: any[];
  resumeInfo: any;
}) {
  const personalInfo =
    sections.find((s) => s.section_type === "PERSONAL_INFO")?.content || {};
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

  return (
    <aside className="w-[480px] border-l bg-slate-200/50 p-6 overflow-y-auto flex flex-col shadow-inner relative z-0">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-slate-700">Live Preview</span>
        <div className="flex items-center space-x-2 bg-white rounded-md border shadow-sm p-1">
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-medium text-slate-600 px-2 border-x select-none">
            100%
          </span>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-500">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="bg-white text-black shadow-xl shadow-slate-300/50 w-[400px] min-h-[565px] p-8 rounded-sm shrink-0 border border-slate-100 relative overflow-hidden flex flex-col mx-auto transition-all">
          {/* ── Header ──────────────────────────────────── */}
          <h1 className="text-xl font-bold uppercase tracking-wide border-b border-black/80 pb-2 mb-2 text-center">
            {resumeInfo.title || "Your Name"}
          </h1>

          {contactParts.length > 0 && (
            <div className="text-center text-[8px] text-slate-500 mb-4 space-x-1.5">
              {contactParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-0.5">•</span>}
                  {part}
                </span>
              ))}
            </div>
          )}

          {/* ── Summary ─────────────────────────────────── */}
          {summary && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Summary
              </h2>
              <p className="text-[9px] leading-relaxed text-slate-700">
                {summary}
              </p>
            </div>
          )}

          {/* ── Skills ──────────────────────────────────── */}
          {skills.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Skills
              </h2>
              <p className="text-[9px] leading-relaxed text-slate-700">
                {skills.join(" • ")}
              </p>
            </div>
          )}

          {/* ── Experience ──────────────────────────────── */}
          {experienceEntries.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Experience
              </h2>
              {experienceEntries.map((exp: any, i: number) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between text-[9px]">
                    <span className="font-semibold">
                      {exp.title}
                      {exp.company && ` — ${exp.company}`}
                    </span>
                    <span className="text-slate-500">
                      {exp.start}
                      {(exp.end || exp.current) &&
                        ` – ${exp.current ? "Present" : exp.end}`}
                    </span>
                  </div>
                  {exp.location && (
                    <p className="text-[8px] text-slate-500 italic">
                      {exp.location}
                    </p>
                  )}
                  {exp.bullets?.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside text-[8px] text-slate-700 mt-0.5 space-y-0.5 pl-1">
                      {exp.bullets
                        .filter(Boolean)
                        .map((b: string, bIdx: number) => (
                          <li key={bIdx}>{b}</li>
                        ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Projects ────────────────────────────────── */}
          {projectEntries.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Projects
              </h2>
              {projectEntries.map((proj: any, i: number) => (
                <div key={i} className="mb-1.5">
                  {proj.description_override && (
                    <p className="text-[9px] text-slate-700">
                      {proj.description_override}
                    </p>
                  )}
                  <div className="text-[8px] text-slate-500 space-x-2">
                    {proj.github_override && (
                      <span>{proj.github_override}</span>
                    )}
                    {proj.demo_override && <span>{proj.demo_override}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Education ───────────────────────────────── */}
          {educationEntries.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Education
              </h2>
              {educationEntries.map((edu: any, i: number) => (
                <div key={i} className="mb-1 text-[9px]">
                  <span className="font-semibold">{edu.degree}</span>
                  {edu.institution && ` — ${edu.institution}`}
                  {edu.field && `, ${edu.field}`}
                  {edu.year && (
                    <span className="text-slate-500 ml-1">
                      ({edu.in_progress ? `Expected ${edu.year}` : edu.year})
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Certifications ──────────────────────────── */}
          {certEntries.length > 0 && (
            <div className="mb-3">
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-800 border-b border-slate-300 pb-1 mb-1.5">
                Certifications
              </h2>
              {certEntries.map((cert: any, i: number) => (
                <div key={i} className="text-[9px] mb-1">
                  <span className="font-semibold">{cert.name}</span>
                  {cert.issuer && ` — ${cert.issuer}`}
                  {cert.year && (
                    <span className="text-slate-500 ml-1">({cert.year})</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Empty watermark ─────────────────────────── */}
          {sections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-200 opacity-20 uppercase tracking-[1em] text-4xl font-black rotate-[-45deg] select-none pointer-events-none">
              DRAFT
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
