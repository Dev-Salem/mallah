"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  User,
  FileText,
  Wrench,
  Briefcase,
  GraduationCap,
  Award,
  FolderKanban,
} from "lucide-react";

import PersonalInfoForm from "../forms/personal-info-form";
import SummaryForm from "../forms/summary-form";
import SkillsForm from "../forms/skills-form";
import ExperienceForm from "../forms/experience-form";
import ProjectsForm from "../forms/projects-form";
import EducationForm from "../forms/education-form";
import CertificationsForm from "../forms/certifications-form";

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

export default function EditorFormPanel({ initialSections, resumeId, onUpdate }: Props) {
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

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-muted/30">
      <div className="max-w-3xl mx-auto space-y-2 pb-12">
        <Accordion type="multiple" defaultValue={["PERSONAL_INFO", "SUMMARY", "SKILLS"]} className="space-y-3">
          {/* ── Personal Info ─────────────────────────────────────────── */}
          <AccordionItem value="PERSONAL_INFO" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <User className="w-4 h-4 text-primary" />
                {t("PersonalInfo")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <PersonalInfoForm
                initialData={getSection(sections, "PERSONAL_INFO").content}
                onChange={(c) => update("PERSONAL_INFO", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Summary ───────────────────────────────────────────────── */}
          <AccordionItem value="SUMMARY" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <FileText className="w-4 h-4 text-primary" />
                {t("Summary")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <SummaryForm
                initialData={getSection(sections, "SUMMARY").content}
                onChange={(c) => update("SUMMARY", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Skills ────────────────────────────────────────────────── */}
          <AccordionItem value="SKILLS" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <Wrench className="w-4 h-4 text-primary" />
                {t("Skills")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <SkillsForm
                initialData={getSection(sections, "SKILLS").content}
                onChange={(c) => update("SKILLS", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Experience ────────────────────────────────────────────── */}
          <AccordionItem value="EXPERIENCE" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <Briefcase className="w-4 h-4 text-primary" />
                {t("Experience")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <ExperienceForm
                initialData={getSection(sections, "EXPERIENCE").content}
                onChange={(c) => update("EXPERIENCE", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Projects ──────────────────────────────────────────────── */}
          <AccordionItem value="PROJECTS" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <FolderKanban className="w-4 h-4 text-primary" />
                {t("Projects")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <ProjectsForm
                initialData={getSection(sections, "PROJECTS").content}
                onChange={(c) => update("PROJECTS", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Education ─────────────────────────────────────────────── */}
          <AccordionItem value="EDUCATION" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <GraduationCap className="w-4 h-4 text-primary" />
                {t("Education")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <EducationForm
                initialData={getSection(sections, "EDUCATION").content}
                onChange={(c) => update("EDUCATION", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>

          {/* ── Certifications ────────────────────────────────────────── */}
          <AccordionItem value="CERTIFICATIONS" className="bg-background rounded-lg border shadow-sm">
            <AccordionTrigger className="px-5 py-4 hover:no-underline">
              <span className="flex items-center gap-2 font-semibold">
                <Award className="w-4 h-4 text-primary" />
                {t("Certifications")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="px-5 pb-5">
              <CertificationsForm
                initialData={getSection(sections, "CERTIFICATIONS").content}
                onChange={(c) => update("CERTIFICATIONS", c)}
                t={t}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
