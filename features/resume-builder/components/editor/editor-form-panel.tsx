"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";

import PersonalInfoForm from "../forms/personal-info-form";
import SummaryForm from "../forms/summary-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "../forms/experience-form";
import ProjectsForm from "../forms/projects-form";
import EducationForm from "../forms/education-form";
import CertificationsForm from "../forms/certifications-form";
import type { SectionType } from "./section-nav";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface Section {
  section_id?: string;
  section_type: string;
  content: any;
  is_visible?: boolean;
  sort_order?: number;
}

interface Props {
  initialSections: Section[];
  resumeId: string;
  activeSection: SectionType;
  onUpdate: (sections: Section[]) => void;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function getSection(sections: Section[], type: string): Section {
  return (
    sections.find((s) => s.section_type === type) || {
      section_type: type,
      content: {},
      is_visible: true,
      sort_order: 0,
    }
  );
}

function updateSectionContent(
  sections: Section[],
  type: string,
  content: any
): Section[] {
  const exists = sections.find((s) => s.section_type === type);
  if (exists) {
    return sections.map((s) =>
      s.section_type === type ? { ...s, content } : s
    );
  }
  return [
    ...sections,
    { section_type: type, content, is_visible: true, sort_order: sections.length },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                            */
/* -------------------------------------------------------------------------- */

export default function EditorFormPanel({
  initialSections,
  resumeId,
  activeSection,
  onUpdate,
}: Props) {
  const t = useTranslations("ResumeBuilder");
  const [sections, setSections] = useState<Section[]>(initialSections);

  const update = useCallback(
    (type: string, content: any) => {
      const next = updateSectionContent(sections, type, content);
      setSections(next);
      onUpdate(next);
    },
    [sections, onUpdate]
  );

  const sectionContent = getSection(sections, activeSection).content;

  return (
    <section className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/10 scrollbar-thin">
      <div className="max-w-3xl mx-auto pb-12">
        <div className="bg-card rounded-2xl border border-border/50 shadow-xl p-8 relative">
          {activeSection === "PERSONAL_INFO" && (
            <PersonalInfoForm
              initialData={sectionContent}
              onChange={(c) => update("PERSONAL_INFO", c)}
              t={t}
            />
          )}
          {activeSection === "SUMMARY" && (
            <SummaryForm
              initialData={sectionContent}
              onChange={(c) => update("SUMMARY", c)}
              t={t}
            />
          )}
          {activeSection === "SKILLS" && (
            <SkillsForm
              initialData={sectionContent}
              onChange={(c) => update("SKILLS", c)}
              t={t}
            />
          )}
          {activeSection === "EXPERIENCE" && (
            <ExperienceForm
              initialData={sectionContent}
              onChange={(c) => update("EXPERIENCE", c)}
              t={t}
            />
          )}
          {activeSection === "PROJECTS" && (
            <ProjectsForm
              initialData={sectionContent}
              onChange={(c) => update("PROJECTS", c)}
              t={t}
            />
          )}
          {activeSection === "EDUCATION" && (
            <EducationForm
              initialData={sectionContent}
              onChange={(c) => update("EDUCATION", c)}
              t={t}
            />
          )}
          {activeSection === "CERTIFICATIONS" && (
            <CertificationsForm
              initialData={sectionContent}
              onChange={(c) => update("CERTIFICATIONS", c)}
              t={t}
            />
          )}
        </div>
      </div>
    </section>
  );
}
